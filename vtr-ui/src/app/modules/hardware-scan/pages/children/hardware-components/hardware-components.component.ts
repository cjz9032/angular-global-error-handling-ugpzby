import { Component, OnInit, NgZone, OnDestroy, HostListener } from '@angular/core';
import { CommonService } from 'src/app/services/common/common.service';
import { Subscription } from 'rxjs';
import { HardwareScanProgress } from 'src/app/enums/hw-scan-progress.enum';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { NgbModal, NgbModalRef, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { HardwareScanTestResult } from 'src/app/enums/hardware-scan-test-result.enum';
import { DeviceService } from 'src/app/services/device/device.service';
import { TranslateService } from '@ngx-translate/core';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { ModalHardwareScanCustomizeComponent } from '../../../components/modal/modal-hardware-scan-customize/modal-hardware-scan-customize.component';
import { ModalCancelComponent } from '../../../components/modal/modal-cancel/modal-cancel.component';
import { ModalScanFailureComponent } from '../../../components/modal/modal-scan-failure/modal-scan-failure.component';
import { ModalPreScanInfoComponent } from '../../../components/modal/modal-pre-scan-info/modal-pre-scan-info.component';
import { HardwareScanService } from '../../../services/hardware-scan.service';
import { HardwareScanResultService } from '../../../services/hardware-scan-result.service';
import { PreviousResultService } from '../../../services/previous-result.service';
import { VantageShellService } from '../../../../../services/vantage-shell/vantage-shell.service';
import { TimerService } from 'src/app/services/timer/timer.service';
import { ModalWaitComponent } from '../../../components/modal/modal-wait/modal-wait.component';
import { TaskType, TaskStep } from 'src/app/enums/hardware-scan-metrics.enum';
import { LenovoSupportService } from 'src/app/modules/hardware-scan/services/lenovo-support.service';
import { RecoverBadSectorsService } from 'src/app/modules/hardware-scan/services/recover-bad-sectors.service';

const RootParent = 'HardwareScan';
const ConfirmButton = 'Confirm';
const CloseButton = 'Close';
const CancelButton = 'Cancel';
const ViewResultsButton = 'ViewResults';


@Component({
	selector: 'vtr-hardware-components',
	templateUrl: './hardware-components.component.html',
	styleUrls: ['./hardware-components.component.scss']
})

export class HardwareComponentsComponent implements OnInit, OnDestroy {

	public viewResultsPath = '';
	public resultItems: any;
	public hardwareTitle = '';
	public isScanDone = false;
	public progress = 0;
	public tooltipInformation: any;

	public itemParentCancelScan: string;
	public itemNameCancelScan: string;
	public itemParentSummary: string;
	public itemNameSummary: string;

	public isRecoverBadSectorsInProgress = false;
	public devicesRecoverBadSectors: any[];

	public set deviceInRecover(value: string) {
		this.hardwareScanService.setDeviceInRecover(value);
	}
	public get deviceInRecover(): string {
		return this.hardwareScanService.getDeviceInRecover();
	}

	private notificationSubscription: Subscription;
	private customizeModal = ModalHardwareScanCustomizeComponent;
	public itemsNextScan: any = [];
	private cancelHandler = {
		cancel: undefined
	};
	private batteryMessage: string;
	private culture: any;
	private metrics: any;

	public isOnline = true;
	public startScanClicked = false;

	// "Wrapper" value to be accessed from the HTML
	public taskTypeEnum = TaskType;

	public set modules(value: any) {
		this.hardwareScanService.setModules(value);
	}

	public get modules(): any {
		return this.hardwareScanService.getModules();
	}

	public get completedStatus(): boolean | undefined {
		return this.hardwareScanService.getCompletedStatus();
	}

	constructor(
		public deviceService: DeviceService,
		private commonService: CommonService,
		private hardwareScanService: HardwareScanService,
		private previousResultService: PreviousResultService,
		private recoverBadSectorsService: RecoverBadSectorsService,
		private hardwareScanResultService: HardwareScanResultService,
		private ngZone: NgZone,
		private modalService: NgbModal,
		config: NgbModalConfig,
		private translate: TranslateService,
		private shellService: VantageShellService,
		private timerService: TimerService,
		private lenovoSupportService: LenovoSupportService
	) {
		this.viewResultsPath = '/hardware-scan/view-results';
		this.isOnline = this.commonService.isOnline;
		this.metrics = this.shellService.getMetrics();
	}

	@HostListener('document: visibilitychange')
	onVisibilityChange(): void {
		const visibility = document.visibilityState;
		if (visibility === 'visible') {
			if (this.hardwareScanService.hasLastResponse()) {
				this.hardwareScanService.renderLastResponse();
			}
		}
	}

	ngOnInit() {
		this.culture = this.hardwareScanService.getCulture();

		this.notificationSubscription = this.commonService.notification.subscribe((response: AppNotification) => {
			this.onNotification(response);
		});

		this.hardwareScanService.startRecover.subscribe(() => {
			this.initComponent();
		});

		this.setPageTitle();
		this.initComponent();
	}

	ngOnDestroy() {
		if (this.notificationSubscription) {
			this.notificationSubscription.unsubscribe();
		}
	}

	public initComponent() {
		if (this.hardwareScanService) {
			if (this.hardwareScanService.isRecoverInit()) {
				this.doRecoverBadSectors();
				this.hardwareScanService.setRecoverInit(false);
			}

			if (this.hardwareScanService.hasLastResponse()) {
				// Here we're executing a scan or RBS and the screen must reflect the running state
				this.hardwareScanService.renderLastResponse();
			} else if (!this.hardwareScanService.isScanOrRBSFinished()) {
				if (this.hardwareScanService.isScanDoneExecuting()) {
					this.hardwareScanService.setIsScanDone(false);
					this.hardwareScanService.setScanExecutionStatus(false);
					this.hardwareScanService.setRecoverExecutionStatus(false);
				}

				// Here we "initialize" the homepage, but only if a scan or RBS isn't running or just finished.
				// In that case, we'll keep the screen with the last state, which is already stored in "this.modules"
				if (!this.hardwareScanService.isScanExecuting() &&
					!this.hardwareScanService.isRecoverExecuting() &&
					!this.hardwareScanService.isScanOrRBSFinished()) {
					this.modules = this.getItemToDisplay();
				}

				if (!this.hardwareScanService.isLoadingDone()) {
					this.hardwareScanService.initLoadingModules(this.culture);
				}

				this.hardwareScanService.setFinalResponse(null);
				this.hardwareScanService.setEnableViewResults(false);
			}
		}
	}

	public disableRefreshAnchor() {
		return this.startScanClicked || !this.isModulesRetrieved();
	}

	public isModulesRetrieved() {
		if (this.hardwareScanService) {
			return this.hardwareScanService.getModulesRetrieved() !== undefined;
		}
	}

	public isLoadingDone() {
		if (this.hardwareScanService) {
			return this.hardwareScanService.isLoadingDone();
		}
	}

	public isScanExecuting() {
		if (this.hardwareScanService) {
			return this.hardwareScanService.isScanExecuting();
		}
	}

	public isRecoverExecuting() {
		if (this.hardwareScanService) {
			return this.hardwareScanService.isRecoverExecuting();
		}
	}

	public getProgress() {
		if (this.hardwareScanService) {
			return this.hardwareScanService.getProgress();
		}
	}

	public getEnableViewResults() {
		const isEnableViewResults = this.hardwareScanService.getEnableViewResults();
		if (isEnableViewResults) {
			this.hardwareScanService.setCurrentTaskStep(TaskStep.Summary);
			this.itemParentSummary = this.getMetricsParentValue();
			this.itemNameSummary = this.getMetricsItemNameSummary();
		}
		return isEnableViewResults;
	}

	public getComponentsTitle() {
		if (this.hardwareScanService) {
			// Component List title when refreshing components
			if (this.isRefreshingModules()) {
				return this.translate.instant('hardwareScan.loadingComponents');
			}

			// Component List title when executing a RBS operation
			if (this.hardwareScanService.isRecoverExecuting()) {
				return this.translate.instant('hardwareScan.recoverBadSectors.localDevices');
			}

			// Component List title used for all other cases
			return this.translate.instant('hardwareScan.hardwareComponents');
		}
	}

	public getDeviceTitle() {
		if (this.hardwareScanService) {
			if (this.hardwareScanService.isRecoverExecuting()) {
				return this.deviceInRecover;
			} else {
				return this.translate.instant('hardwareScan.title');
			}
		}
	}

	public getDeviceSubTitle() {
		if (this.hardwareScanService) {
			if (this.hardwareScanService.isRecoverExecuting()) {
				return this.translate.instant('hardwareScan.recoverBadSectors.moreInfo');
			} else {
				return this.translate.instant('hardwareScan.subtitle');
			}
		}
	}

	private setPageTitle(title?: string) {
		if (title) {
			this.hardwareTitle = title;
		} else {
			this.hardwareTitle = this.translate.instant('hardwareScan.title');
		}
	}

	public onCancelScan() {
		const isCancelingRBS = this.isRecoverExecuting();

		this.hardwareScanService.setCurrentTaskStep(TaskStep.Cancel);

		const modalCancel = this.modalService.open(ModalCancelComponent, {
			backdrop: 'static',
			size: 'lg',
			centered: true,
			windowClass: 'cancel-modal-hwscan'
		});

		modalCancel.componentInstance.ItemParent = this.getMetricsParentValue();
		modalCancel.componentInstance.CancelItemName = this.getMetricsItemNameClose();
		modalCancel.componentInstance.ConfirmItemName = this.getMetricsItemNameConfirm();

		// If the scan/rbs process has finished and the cancelation modal is still opened,
		// alert the user that the process cannot be canceled anymore.
		const scanFinished = this.hardwareScanService.isWorkDone().subscribe((done) => {
			modalCancel.componentInstance.showProcessFinishedMessage();
		});

		modalCancel.componentInstance.cancelRequested.subscribe(() => {
			// If the cancelation process has started, unsubscribe from the other subject to avoid any odd behavior
			scanFinished.unsubscribe();

			if (this.hardwareScanService) {
				let cancelWatcher;

				if (!isCancelingRBS) {
					const cancelWatcherDelay = 3000;
					const self = this;
					const checkCliRunning = () => {
						// Workaround for RTC changing date/time problem!
						// NOTICE: Remove this code piece as soon as this problem is fixed
						cancelWatcher = setInterval(function watch() {
							self.hardwareScanService.getStatus().then((result: any) => {
								if (!result.isScanInProgress) {
									clearInterval(cancelWatcher);
									self.hardwareScanService.setIsScanDone(true);
									self.hardwareScanService.setScanExecutionStatus(false);
									self.hardwareScanService.setScanOrRBSFinished(true);
									self.cleaningUpScan(undefined);
									self.refreshModules();
									modalCancel.close();
									if (self.cancelHandler && self.cancelHandler.cancel) {
										self.cancelHandler.cancel();
									}
								}
							});
						}, cancelWatcherDelay);
					};

					// Let's start monitoring the CLI during the cancelation process.
					// If it closes and no response is received (through isWorkDone() subject), the front-end will
					// be redirected to the HardwareScan home page (forcing an init through a refresh modules call), preventing
					// that the application gets stuck.
					checkCliRunning();
				}
				this.hardwareScanService.cancelScanExecution();

				this.hardwareScanService.isWorkDone().subscribe((done) => {
					if (!isCancelingRBS) {
						clearInterval(cancelWatcher);
					}
					if (done) {
						// When the cancelation is done, close the cancelation dialog.
						// Sets the status of the scan to avoid problems when viewing their results
						// (without that, the back button doesn't work as expected!) only if we're not canceling a RBS!
						modalCancel.close();
						if (!isCancelingRBS) {
							this.hardwareScanService.setIsScanDone(false);
						}
					}
				});
			}
		});
	}

	public refreshModules() {
		this.timerService.start();
		this.hardwareScanService.setLoadingStatus(false);
		this.hardwareScanService.reloadItemsToScan(true);
		this.hardwareScanService.initLoadingModules(this.culture);

		this.hardwareScanService.isHardwareModulesLoaded().subscribe((loaded) => {
			if (loaded) {
				this.modules = this.getItemToDisplay();

				const taskResult = {
					Result: 'Pass'
				};
				this.sendTaskActionMetrics(TaskType.RefreshModules, 1,
					'', taskResult, this.timerService.stop());
			}
		});
	}

	getItemToDisplay() {
		// Shows a default component list
		if (!this.hardwareScanService.isShowComponentList()) {
			return this.hardwareScanService.getInitialHardwareComponentList();
		}

		// Shows the real component list, retrieved after a Quick/Custom scan
		const devices = [];
		const modules = this.hardwareScanService.getModulesRetrieved();
		if (modules !== undefined) {
			for (const categoryInfo of modules.categoryList) {
				for (const groupList of categoryInfo.groupList) {
					const group = groupList;
					const info = categoryInfo.name;
					let icon = categoryInfo.id;
					if (!this.hardwareScanService.getIsDesktopMachine()) {
						if (categoryInfo.id === 'pci_express') {
							icon += '_laptop';
						}
					}
					devices.push({
						module: info,
						name: group.name,
						icon,
					});
				}
			}
		}
		return devices;
	}

	/*
	* Used to start a scan, 0 is a quick scan, and 1 is a custom scan
	*/
	private getDoScan(scanType: number, requests: any) {
		this.progress = 0;

		this.hardwareScanService.setCurrentTaskStep(TaskStep.Run);

		const payload = {
			requests,
			categories: [],
			localizedItems: []
		};

		if (this.hardwareScanService) {

			this.timerService.start();

			this.itemParentCancelScan = this.getMetricsParentValue();
			this.itemNameCancelScan = this.getMetricsItemNameCancel();

			this.hardwareScanService.setFinalResponse(null);
			this.hardwareScanService.getDoScan(payload, this.modules, this.cancelHandler)
			.then((response) => {
				this.cleaningUpScan(response);
				this.showSupportPopupIfNeeded();
			})
			.catch((ex: any) => {
				// Clean up the scan variables when occurs a power event (CLI stopped brusquely)
				this.hardwareScanService.setIsScanDone(false);
				this.hardwareScanService.setScanExecutionStatus(false);
				this.hardwareScanService.setRecoverExecutionStatus(false);

				this.initComponent();
			})
			.finally(() => {
				this.cleaningUpScan(undefined);

				const metricsResult = this.getMetricsTaskResult();
				this.sendTaskActionMetrics(this.hardwareScanService.getCurrentTaskType(), metricsResult.countSuccesses,
					'', metricsResult.scanResultJson, this.timerService.stop());

				// Defines information about module details
				this.onViewResults();
				this.modules.forEach(module => { module.expanded = true; });
			});
		}
	}

	private cleaningUpScan(response: any) {
		if (response) {
			this.hardwareScanService.setFinalResponse(response);
		}

		this.startScanClicked = false;
		if (!this.hardwareScanService.isCancelRequested()) {
			this.hardwareScanService.setEnableViewResults(true);
		} else {
			this.initComponent();
		}
	}

	public async showSupportPopupIfNeeded() {
		const finalResponse = this.hardwareScanService.getFinalResponse();
		if (finalResponse) {
			const categoryInfoList = this.hardwareScanService.getCategoryInformation();

			const failedModules = finalResponse.responses.map(response => {
				// Extracting the module list of responses having at least one test failed
				const modulesContainingTestsFailed = response.groupResults.filter(device =>
					device.testResultList.some(test => test.result === HardwareScanTestResult.Fail));

				// Returning undefined here once this response there's no failures.
				// It'll be removed by the 'filter' ahead.
				if (modulesContainingTestsFailed.length === 0) {
					return undefined;
				}

				// Transforms the filtered data to the desired format.
				// At the beginning result is an object containing no data and it's updated with the information of each device
				return modulesContainingTestsFailed.reduce((result, device) => {
					// Retriving device information (id, name, etc ...)
					const category = categoryInfoList.find(categoryItem => categoryItem.id === device.moduleName);
					const deviceInfo = category.groupList.find(groupDevice => groupDevice.id === device.id);

					// Updates result with the device information grouped by module (cpu, storage, etc ...)
					// Resulting in something like:
					// {
					// 		moduleId: "storage",
					// 		moduleName: "Storage",
					// 		devices: [
					// 			{ deviceId: "0", deviceName: "WDC PC SN720 SDAPNTW-256G-1101 - 238.47 GBs" },
					// 			{ deviceId: "1", deviceName: "SAMSUNG HM160HX - 149.05 GBs" }
					// 		]
					// }
					result.moduleId = category.id;
					result.moduleName = category.name;
					result.resultModule = HardwareScanTestResult.Fail;
					result.devices.push({
						deviceId: deviceInfo.id,
						deviceName: deviceInfo.name
					});

					return result;
				},
				// This is the initial value of the resulting object.
				{
					moduleId: '',
					moduleName: '',
					devices: []
				});
			}).filter(module => module !== undefined); // Removing empty elements from resulting list

			// If there's failure, shows the support pop-up
			if (failedModules.length > 0) {
				const scanDate =  this.hardwareScanService.getFinalResultStartDate();
				const finalResultCode = this.hardwareScanService.getFinalResultCode();
				const supportUrl = await this.lenovoSupportService.getETicketUrl(scanDate, finalResultCode);
				const rbsDevices = this.hardwareScanService.getDevicesToRecoverBadSectors();
				const modalRef = this.modalService.open(ModalScanFailureComponent, {
					backdrop: 'static',
					size: 'lg',
					centered: true,
					windowClass: 'support-modal-hwscan'
				});
				modalRef.componentInstance.supportUrl = supportUrl;
				modalRef.componentInstance.configureDevicesLists(failedModules, rbsDevices);
			}
		}
	}

	private doRecoverBadSectors() {
		this.hardwareScanService.setCurrentTaskType(TaskType.RecoverBadSectors);
		this.hardwareScanService.setCurrentTaskStep(TaskStep.Run);
		this.itemParentCancelScan = this.getMetricsParentValue();
		this.itemNameCancelScan = this.getMetricsItemNameCancel();

		this.progress = 0;

		const devicesId = [];

		this.devicesRecoverBadSectors = this.hardwareScanService.getDevicesRecover();
		this.standardizeRbsResponse();
		if (this.devicesRecoverBadSectors[0].name) {
			this.deviceInRecover = this.devicesRecoverBadSectors[0].name;
		}

		for (const storageDevice of this.devicesRecoverBadSectors) {
			devicesId.push(storageDevice.id);
		}

		const payload = {
			devices: devicesId
		};

		if (this.hardwareScanService) {
			this.timerService.start();
			this.hardwareScanService.getRecoverBadSectors(payload)
				.then((response) => {
				this.hardwareScanService.setEnableViewResults(true);

				// Sending the RBS's TaskAction metrics
				const rbsTaskActionResult = this.getRecoverBadSectorsMetricsTaskResult(response);
				this.sendTaskActionMetrics(TaskType.RecoverBadSectors, rbsTaskActionResult.taskCount,
					'', rbsTaskActionResult.taskResult, this.timerService.stop());
			})
			.finally(() => {
				// Defines information about module details
				this.onViewResultsRecover();
			});
		}
	}

	private onCustomizeScan() {
		const modalRef = this.modalService.open(this.customizeModal, {
			size: 'lg',
			centered: true,
			windowClass: 'custom-modal-size'
		});
		modalRef.componentInstance.items = this.hardwareScanService.getCustomScanModules();
		modalRef.componentInstance.passEntry.subscribe(() => {
			this.hardwareScanService.filterCustomTests(this.culture);
			this.checkPreScanInfo(TaskType.CustomScan); // custom scan
		});

		modalRef.componentInstance.modalClosing.subscribe(success => {
			// Re-enabling the button, once the modal has been closed in a way
			// the user didn't started the Scan proccess.
			if (!success) {
				this.startScanClicked = false;
			}
		});
	}

	private openWaitHardwareComponentsModal() {
		const modal: NgbModalRef = this.modalService.open(ModalWaitComponent, {
			size: 'lg',
			centered: true,
			windowClass: 'hardware-scan-modal-size'
		});

		( modal.componentInstance as ModalWaitComponent).modalTitle = this.translate.instant('hardwareScan.loadingComponents');
		( modal.componentInstance as ModalWaitComponent).modalDescription = this.translate.instant('hardwareScan.retrievingHardwareInformation');
		( modal.componentInstance as ModalWaitComponent).shouldCloseModal = this.hardwareScanService.isHardwareModulesLoaded();
		( modal.componentInstance as ModalWaitComponent).ItemParent = 'HardwareScan.LoadingComponents';
		( modal.componentInstance as ModalWaitComponent).CancelItemName = 'LoadingComponents.Close';

		return modal;
	}

	public startScanWaitingModules(taskType: TaskType) {
		this.startScanClicked = true; // Disable button, preventing multiple clicks by the user
		this.hardwareScanService.setLastTaskType(taskType);

		if (!this.hardwareScanService.isLoadingDone()) {
			const modalWait = this.openWaitHardwareComponentsModal();
			modalWait.result.then((result) => {
				// Hardware modules have been retrieved, so let's continue with the Scan process
				if (taskType === TaskType.QuickScan) {
					this.checkPreScanInfo(taskType);
				} else if (taskType === TaskType.CustomScan) {
					this.onCustomizeScan();
				}
			}, (reason) => {
				// User has clicked in the 'X' button, so we need to re-enable the Quick/Custom scan button here.
				this.startScanClicked = false;
			});
		} else {
			// Hardware modules is already retrieved, so let's continue with the Scan process
			if (taskType === TaskType.QuickScan) {
				this.checkPreScanInfo(taskType);
			} else if (taskType === TaskType.CustomScan) {
				this.onCustomizeScan();
			}
		}
	}

	public scanAgain(){
		this.hardwareScanService.setEnableViewResults(false);
		this.hardwareScanService.setIsScanDone(false);
		this.hardwareScanService.setScanExecutionStatus(true);
		this.checkPreScanInfo(this.hardwareScanService.getLastTaskType(), true);
	}

	public checkPreScanInfo(taskType: TaskType, scanAgain = false) {
		this.hardwareScanService.cleanResponses();
		this.hardwareScanService.setCurrentTaskType(taskType);

		let requests;
		if (taskType === TaskType.QuickScan) { // quick
			this.modules = this.hardwareScanService.getQuickScanResponse();
			requests = this.hardwareScanService.getQuickScanRequest();

		} else if (taskType === TaskType.CustomScan) { // custom
			if (scanAgain) {
				this.modules = this.hardwareScanService.getLastFilteredCustomScanResponse();
				requests = this.hardwareScanService.getLastFilteredCustomScanRequest();
			} else {
				this.modules = this.hardwareScanService.getFilteredCustomScanResponse();
				requests = this.hardwareScanService.getFilteredCustomScanRequest();
			}
			// Saving the selected filter in case the user wants to redo the same scan
			this.hardwareScanService.setLastFilteredCustomScanResponse(this.modules);
			this.hardwareScanService.setLastFilteredCustomScanRequest(requests);
		}

		// Resets the 'expanded' state and User visibility to the default value (closed)
		this.modules.forEach(module => {
			module.expanded = false;
			module.expandedStatusChangedByUser = false;
		});

		// Used for metrics purposes
		const testMapMetrics = {};
		const testList = [];
		for (const scanRequest of requests) {
			for (const test of scanRequest.testRequestList) {
				testList.push(test);
				const testName = test.id.split(':::')[0];
				if (!(testName in testMapMetrics)) {
					testMapMetrics[testName] = true;
				}

			}
		}

		// Ideally, FeatureClicks are sent directly through the HTML tags, but in this case, we need ItemParam
		// data that needs to be processed. This way, we are sending them using the API.
		// Scan Again should not send these metrics here because they're already sent in html as feature click
		if (!scanAgain) {
			if (taskType === TaskType.QuickScan) {
				this.sendFeatureClickMetrics('HardwareScan.QuickScan', 'HardwareScan', testMapMetrics);
			} else if (taskType === TaskType.CustomScan) {
				this.sendFeatureClickMetrics('CustomizeScan.RunSelectedTests', 'HardwareScan.CustomizeScan', testMapMetrics);
			}
		}

		const preScanInformationRequest = {
			lang: this.culture,
			tests: testList
		};

		this.batteryMessage = '';

		this.hardwareScanService.getPreScanInfo(preScanInformationRequest).then((response) => {
			for (const message of response.MessageList) {
				if (message.id === 'connect-power') {
					this.batteryMessage = message.description;
				}
			}

			if (this.batteryMessage !== '') {
				const modal: NgbModalRef = this.modalService.open(ModalPreScanInfoComponent, {
					backdrop: 'static',
					size: 'lg',
					centered: true,
					windowClass: 'hardware-scan-modal-size'
				});

				this.hardwareScanService.setCurrentTaskStep(TaskStep.Confirm);

				( modal.componentInstance as ModalPreScanInfoComponent).error = this.translate.instant('hardwareScan.warning');
				( modal.componentInstance as ModalPreScanInfoComponent).description = this.batteryMessage;
				( modal.componentInstance as ModalPreScanInfoComponent).ItemParent = this.getMetricsParentValue();
				( modal.componentInstance as ModalPreScanInfoComponent).CancelItemName = this.getMetricsItemNameClose();
				( modal.componentInstance as ModalPreScanInfoComponent).ConfirmItemName = this.getMetricsItemNameConfirm();

				modal.result.then((result) => {
					this.getDoScan(taskType, requests);

					// User has clicked in the OK button, so we need to re-enable the Quick/Custom scan button here
					this.startScanClicked = false;
				}, (reason) => {
					this.hardwareScanService.cleanCustomTests();

					// User has clicked in the 'X' button, so we also need to re-enable the Quick/Custom scan button here.
					this.startScanClicked = false;
				});
			} else {
				this.getDoScan(taskType, requests);
			}
		});
	}

	public onViewResults() {
		const results = {
			finalResultCode: this.hardwareScanService.getFinalResultCode(),
			date: this.hardwareScanService.getFinalResultStartDate(),
			information: this.hardwareScanService.getFinalResultDescription(),
			items: []
		};

		for (const module of this.modules) {
			let moduleId = module.id;
			if (!this.hardwareScanService.getIsDesktopMachine()) {
				if (moduleId === 'pci_express') {
					moduleId += '_laptop';
				}
			}

			const item = {
				id: module.id,
				module: module.module,
				name: module.name,
				resultCode: module.resultCode,
				information: module.description,
				expanded: false,
				expandedStatusChangedByUser: false,
				detailsExpanded: false,
				icon: moduleId,
				details: this.previousResultService.buildDetails(module),
				listTest: [],
				resultModule: HardwareScanTestResult.Pass,
			};

			for (const test of module.listTest) {
				item.listTest.push({
					id: test.id,
					name: test.name,
					statusTest: test.statusTest,
					information: test.description,
				});
			}

			item.resultModule = this.hardwareScanResultService.consolidateResults(item.listTest.map(itemTest => itemTest.statusTest));
			results.items.push(item);
		}

		// Update the ViewResultItem
		this.previousResultService.setViewResultItems(results);

		// If a cancellation was requested, the application will return the HW Scan home page.
		// So, in this case, the modules list will be updated with the data to be displayed on
		// the home screen (this.getItemToDisplay()) the modules name and description
		// If the scan finished without cancellation, then the scan result will be display.
		// In this case, the module list is updated with the scan results and modules details (results.items)
		if (!this.hardwareScanService.isCancelRequested()){
			this.modules = results.items;
		} else {
			this.modules = this.getItemToDisplay();
		}
	}

	/* This function is used to standardize the RBS intermediate response with the same used by a Scan. */
	public standardizeRbsResponse(){
		const moduleInformation = this.hardwareScanService.getModulesRetrieved();
		if ( moduleInformation ) {
			const storageModule =
				moduleInformation.categoryList.find( category => category.id === 'storage' );

			const results = { items: [] };

			for (const device of this.devicesRecoverBadSectors) {
				const item = {
					module: storageModule.name,
					icon: storageModule.id,
					name: device.name,
					expanded: false,
					detailsExpanded: false,
					listTest: [{
						id: '',
						name: device.name,
						statusTest: device.status,
						percent: device.percent,
					}],
				};

				results.items.push(item);
			}
			this.modules = results.items;
		}
	}

	public onViewResultsRecover() {
		const moduleInformation = this.hardwareScanService.getModulesRetrieved();
		if ( moduleInformation ) {
			const storageModule = moduleInformation.categoryList.find( category => category.id === 'storage' );

			const date = new Date();
			const day = date.getDate().toString();
			const month = date.getMonth() + 1;
			const monthString = month.toString();
			const year = date.getFullYear().toString();
			const time = date.toTimeString().split(' ');
			const dateString = year + '/' + monthString + '/' + day + ' ' + time[0];

			const results = {
				resultModule: HardwareScanTestResult.Pass,
				date: dateString,
				items: []
			};

			for (const device of this.devicesRecoverBadSectors) {
				const item = {
					module: storageModule.name,
					icon: storageModule.id,
					name: device.name,
					expanded: false,
					detailsExpanded: false,
					details: [
						{ key: 'numberSectors', value: device.numberOfSectors },
						{ key: 'numberBadSectors', value: device.numberOfBadSectors },
						{ key: 'numberFixedSectors', value: device.numberOfFixedSectors },
						{ key: 'numberNonFixedSectors', value: device.numberOfNonFixedSectors },
						{ key: 'elapsedTime', value: device.elapsedTime }
					],
					listTest: [{
						id: '',
						name: device.name,
						statusTest: device.status,
						percent: device.percent,
					}],
				};

				results.items.push(item);
			}

			results.resultModule = this.hardwareScanResultService.consolidateResults(this.devicesRecoverBadSectors.map(item => item.status));

			this.recoverBadSectorsService.setRecoverResultItems(results);
			this.modules = results.items;
		}
	}

	public isDisableCancel() {
		return this.hardwareScanService.isDisableCancel();
	}

	private onNotification(notification: AppNotification) {
		if (notification) {
			const { type, payload } = notification;
			switch (type) {
				case HardwareScanProgress.ScanProgress:
					this.ngZone.run(() => {
						if (!this.hardwareScanService.isCancelRequested()) {
							this.progress = payload;
						}
					});
					break;
				case HardwareScanProgress.ScanResponse:
					this.modules = payload;
					break;
				case HardwareScanProgress.RecoverProgress:
					this.ngZone.run(() => {
						this.progress = payload;
					});
					break;
				case HardwareScanProgress.RecoverResponse:
					this.devicesRecoverBadSectors = payload.devices;
					this.standardizeRbsResponse();
					if (payload.deviceInRecover) {
						this.deviceInRecover = payload.deviceInRecover;
					}
					break;
				case HardwareScanProgress.HasDevicesToRecoverBadSectors:
					break;
				case NetworkStatus.Online:
					this.isOnline = notification.payload.isOnline;
					break;
				case NetworkStatus.Offline:
					this.isOnline = notification.payload.isOnline;
					break;
				case HardwareScanProgress.BackEvent:
					// User has pressed the back button, so we need to redirect them to the homepage instead of
					// the scan or RBS result screen
					this.hardwareScanService.setScanOrRBSFinished(false);
					this.initComponent();
					break;
				default:
					break;
			}
		}
	}

	private getMetricsParentValue() {
		let taskTypeMetrics = TaskType[this.hardwareScanService.getCurrentTaskType()];
		const currentTaskStep = this.hardwareScanService.getCurrentTaskStep();
		if (currentTaskStep === TaskStep.Summary) {
			// For summary metrics, it was defined that only the word "Scan" will be sent, so we should remove "Custom" or "Quick" from it
			taskTypeMetrics = taskTypeMetrics.replace('Custom', '').replace('Quick', '');
		}
		return RootParent + '.' + TaskStep[currentTaskStep] + taskTypeMetrics;
	}

	private getMetricsItemNameConfirm() {
		const currentTaskStep = this.hardwareScanService.getCurrentTaskStep();
		const currentTaskType = this.hardwareScanService.getCurrentTaskType();
		return TaskStep[currentTaskStep] + TaskType[currentTaskType] + '.' + ConfirmButton;
	}

	private getMetricsItemNameClose() {
		const currentTaskStep = this.hardwareScanService.getCurrentTaskStep();
		const currentTaskType = this.hardwareScanService.getCurrentTaskType();
		return TaskStep[currentTaskStep] + TaskType[currentTaskType] + '.' + CloseButton;
	}

	private getMetricsItemNameCancel() {
		const currentTaskStep = this.hardwareScanService.getCurrentTaskStep();
		const currentTaskType = this.hardwareScanService.getCurrentTaskType();
		return TaskStep[currentTaskStep] + TaskType[currentTaskType] + '.' + CancelButton;
	}

	private getMetricsItemNameSummary() {
		const currentTaskStep = this.hardwareScanService.getCurrentTaskStep();
		const currentTaskType = this.hardwareScanService.getCurrentTaskType();
		// For summary metrics, it was defined that only the word "Scan" will be sent, so we should remove "Custom" or "Quick" from it
		const taskTypeMetrics = TaskType[currentTaskType].replace('Custom', '').replace('Quick', '');
		return TaskStep[currentTaskStep] + taskTypeMetrics + '.' + ViewResultsButton;
	}

	private getMetricsTaskResult() {
		let countSuccesses = 0;
		let overalTestResult = HardwareScanTestResult.Na;

		const resultJson = {
			Result: '',
			Reason: '',
			TestsList: {}
		};

		// scanResultJson["TestsList"] = {};
		if (this.modules) {
			for (const module of this.modules) {
				for (const test of module.listTest) {

					const testName = test.id.split(':::')[0];
					if (!(testName in resultJson.TestsList)) {
						resultJson.TestsList[testName] = [];
					}

					const testObj = {
						Id: module.groupId,
						Result: HardwareScanTestResult[test.statusTest],
						// for now, this field will be "NA". At a later time, more useful information will be sent by the Plugin to fill it.
						Reason: 'NA',
					};

					if (test.status === HardwareScanTestResult.Pass) {
						countSuccesses = countSuccesses + 1;
					}

					resultJson.TestsList[testName].push(testObj);
				}
			}
			overalTestResult = this.hardwareScanResultService.consolidateResults(this.modules.map(test => test.resultModule));
		}

		resultJson.Result = HardwareScanTestResult[overalTestResult];
		resultJson.Reason = 'NA';

		return {
			scanResultJson: resultJson,
			countSuccesses
		};
	}

	private getRecoverBadSectorsMetricsTaskResult(rbsFinalResponse) {
		let numberOfSuccess = 0;
		let result = HardwareScanTestResult.Na;

		for (const device of rbsFinalResponse.devices) {
			// Counting the devices where RBS was successful
			if (device.status === HardwareScanTestResult.Pass) {
				numberOfSuccess++;
			}
		}
		result = this.hardwareScanResultService.consolidateResults(rbsFinalResponse.devices.map(item => item.status));

		return {
			taskCount: numberOfSuccess,
			taskResult: {
				Reason: 'NA',
				Result: HardwareScanTestResult[result]
			}
		};
	}

	private sendFeatureClickMetrics(itemName: string, itemParent: string, itemParam: any) {
		const data = {
			ItemType: 'FeatureClick',
			ItemName: itemName,
			ItemParent: itemParent,
			ItemParam: itemParam
		};
		if (this.metrics) {
			this.metrics.sendAsync(data);
		}
	}

	private sendTaskActionMetrics(taskName: TaskType, taskCount: number, taskParam: string, taskResult: any, taskDuration: number) {
		const data = {
			ItemType: 'TaskAction',
			TaskName: TaskType[taskName],
			TaskCount: taskCount,
			TaskResult: taskResult,
			TaskParam: taskParam,
			TaskDuration: taskDuration
		};
		if (this.metrics) {
			this.metrics.sendAsync(data);
		}
	}

	public isRefreshingModules() {
		return this.hardwareScanService.isRefreshingModules();
	}

}