import { Component, OnInit, NgZone, OnDestroy, HostListener } from '@angular/core';
import { CommonService } from 'src/app/services/common/common.service';
import { Subscription, EMPTY } from 'rxjs';
import { HardwareScanProgress } from 'src/app/enums/hw-scan-progress.enum';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { NgbModal, NgbModalRef, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { HardwareScanTestResult } from 'src/app/enums/hardware-scan-test-result.enum';
import { DeviceService } from 'src/app/services/device/device.service';
import { TranslateService } from '@ngx-translate/core';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { ModalHardwareScanCustomizeComponent } from '../../../../modal/modal-hardware-scan-customize/modal-hardware-scan-customize.component';
import { ModalCancelComponent } from '../../../../modal/modal-cancel/modal-cancel.component';
import { ModalEticketComponent } from '../../../../modal/modal-eticket/modal-eticket.component';
import { ModalScheduleScanCollisionComponent } from '../../../../modal/modal-schedule-scan-collision/modal-schedule-scan-collision.component';
import { HardwareScanService } from '../../../../../services/hardware-scan/hardware-scan.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { VantageShellService } from '../../../../../services/vantage-shell/vantage-shell.service';
import { TimerService } from 'src/app/services/timer/timer.service';
import { ModalWaitComponent } from '../../../../modal/modal-wait/modal-wait.component';
import { TaskType, TaskStep } from 'src/app/enums/hardware-scan-metrics.enum';
import { LenovoSupportService } from 'src/app/services/hardware-scan/lenovo-support.service';

const RootParent = 'HardwareScan';
const ConfirmButton = 'Confirm';
const CloseButton = 'Close';
const CancelButton = 'Cancel';
const ViewResultsButton = 'ViewResults'


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
	public modules: any;
	public progress = 0;
	public tooltipInformation: any;

	public itemParentCancelScan: string;
	public itemNameCancelScan: string;
	public itemParentSummary: string;
	public itemNameSummary: string;

	public isRecoverBadSectorsInProgress = false;
	public devicesRecoverBadSectors: any[];
	public deviceInRecover: any; // Current device in Recover Bad Sectors

	private notificationSubscription: Subscription;
	private customizeModal = ModalHardwareScanCustomizeComponent;
	private startDate: any;
	public itemsNextScan: any = [];
	private cancelHandler = {
		cancel: undefined
	};
	private batteryMessage: string;
	private culture: any;
	private metrics: any;

	public isOnline = true;
	completeStatusToken: string;
	public startScanClicked = false;

	// "Wrapper" value to be accessed from the HTML
	public taskTypeEnum = TaskType;

	// This is used to determine the scan overall status when sending metrics information
	private resultSeverityConversion = {};

	constructor(
		public deviceService: DeviceService,
		private commonService: CommonService,
		private hardwareScanService: HardwareScanService,
		private ngZone: NgZone,
		private modalService: NgbModal,
		config: NgbModalConfig,
		private translate: TranslateService,
		private logger: LoggerService,
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

		this.initComponent();
		this.initResultSeverityConversion();
	}

	ngOnDestroy() {
		if (this.notificationSubscription) {
			this.notificationSubscription.unsubscribe();
		}
	}

	private initResultSeverityConversion() {
		// the enum HardwareScanTestResult isn't really in the best order to determine the severity of the results
		// because of that, I'm creating a map with the best order to determine the scan overall status
		this.resultSeverityConversion[HardwareScanTestResult.NotStarted] = 0;
		this.resultSeverityConversion[HardwareScanTestResult.InProgress] = 1;
		this.resultSeverityConversion[HardwareScanTestResult.Na] = 2;
		this.resultSeverityConversion[HardwareScanTestResult.Pass] = 3;
		this.resultSeverityConversion[HardwareScanTestResult.Warning] = 4;
		this.resultSeverityConversion[HardwareScanTestResult.Fail] = 5;
		this.resultSeverityConversion[HardwareScanTestResult.Cancelled] = 6;
	}

	public initComponent() {
		this.setPageTitle();
		this.modules = this.getItemToDisplay();

		if (this.hardwareScanService) {
			if (this.hardwareScanService.isRecoverInit()) {
				this.doRecoverBadSectors();
				this.hardwareScanService.setRecoverInit(false);
			}

			if (this.hardwareScanService.hasLastResponse()) {
				this.hardwareScanService.renderLastResponse();
			} else {
				if (this.hardwareScanService.isScanDoneExecuting()) {
					this.hardwareScanService.setIsScanDone(false);
					this.hardwareScanService.setScanExecutionStatus(false);
					this.hardwareScanService.setRecoverExecutionStatus(false);
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
			if (this.hardwareScanService.isRefreshingModules()) {
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

	private getFinalResultCode() {
		if (this.hardwareScanService) {
			this.hardwareScanService.getFinalResultCode();
		}
	}

	public onCancelScan() {
		let isCancelingRBS = this.isRecoverExecuting();

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
		let scanFinished = this.hardwareScanService.isWorkDone().subscribe((done) => {
			modalCancel.componentInstance.showProcessFinishedMessage();
		});

		modalCancel.componentInstance.cancelRequested.subscribe(() => {
			// If the cancelation process has started, unsubscribe from the other subject to avoid any odd behavior
			scanFinished.unsubscribe();

			if (this.hardwareScanService) {
				let cancelWatcherDelay = 3000;
				let cancelWatcher;
				let self = this;

				let checkCliRunning = function() {
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
				this.hardwareScanService.cancelScanExecution();

				this.hardwareScanService.isWorkDone().subscribe((done) => {
					clearInterval(cancelWatcher);
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
				for (let i = 0; i < categoryInfo.groupList.length; i++) {
					const group = categoryInfo.groupList[i];
					const info = categoryInfo.name;
					if (!this.hardwareScanService.getIsDesktopMachine()) {
						if (categoryInfo.id === 'pci_express') {
							categoryInfo.id += '_laptop';
						}
					}
					devices.push({
						module: info,
						name: group.name,
						icon: categoryInfo.id,
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
		this.startDate = new Date();
		this.progress = 0;

		this.hardwareScanService.setCurrentTaskStep(TaskStep.Run);

		const payload = {
			requests: requests,
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
				this.initComponent();
			})
			.finally(() => {
				const metricsResult = this.getMetricsTaskResult();
				this.sendTaskActionMetrics(this.hardwareScanService.getCurrentTaskType(), metricsResult.countSuccesses,
					'', metricsResult.scanResultJson, this.timerService.stop());
				this.cleaningUpScan(undefined);

				// Defines information about module details
				this.onViewResults();
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
					device.testResultList.some(test => test.result == HardwareScanTestResult.Fail));

				// Returning undefined here once this response there's no failures.
				// It'll be removed by the 'filter' ahead.
				if (modulesContainingTestsFailed.length == 0) {
					return undefined;
				}

				// Transforms the filtered data to the desired format.
				// At the beginning result is an object containing no data and it's updated with the information of each device
				return modulesContainingTestsFailed.reduce((result, device) => {
					// Retriving device information (id, name, etc ...)
					const category = categoryInfoList.find(category => category.id == device.moduleName);
					const deviceInfo = category.groupList.find(groupDevice => groupDevice.id == device.id);

					// Updates result with the device information grouped by module (cpu, storage, etc ...)
					// Resulting in something like:
					// {
					// 		moduleId: "storage",
					//		moduleName: "Storage",
					//		devices: [
					//			{ deviceId: "0", deviceName: "WDC PC SN720 SDAPNTW-256G-1101 - 238.47 GBs" },
					//			{ deviceId: "1", deviceName: "SAMSUNG HM160HX - 149.05 GBs" }
					//		]
					// }
					result.moduleId = category.id;
					result.moduleName = category.name;
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
				const supportUrl = await this.lenovoSupportService.getSupportUrl(this.startDate);
				const modalRef = this.modalService.open(ModalEticketComponent, {
					backdrop: 'static',
					size: 'lg',
					centered: true,
					windowClass: 'hardware-scan-modal-size'
				});
				modalRef.componentInstance.moduleNames = JSON.stringify(failedModules);
				modalRef.componentInstance.setUrl(supportUrl);
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
			backdrop: 'static',
			size: 'lg',
			centered: true
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

	public checkPreScanInfo(taskType: TaskType) {
		this.hardwareScanService.cleanResponses();
		this.hardwareScanService.setCurrentTaskType(taskType);

		let requests;
		if (taskType === TaskType.QuickScan) { // quick
			this.modules = this.hardwareScanService.getQuickScanResponse();
			requests = this.hardwareScanService.getQuickScanRequest();

		} else if (taskType === TaskType.CustomScan) { // custom
			this.modules = this.hardwareScanService.getFilteredCustomScanResponse();
			requests = this.hardwareScanService.getFilteredCustomScanRequest();
		}

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
		if (taskType === TaskType.QuickScan) {
			this.sendFeatureClickMetrics('HardwareScan.QuickScan', 'HardwareScan', testMapMetrics);
		} else if (taskType === TaskType.CustomScan) {
			this.sendFeatureClickMetrics('CustomizeScan.RunSelectedTests', 'HardwareScan.CustomizeScan', testMapMetrics);
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
				this.batteryMessage += '\n';
			}

			if (this.batteryMessage !== '') {
				const modal: NgbModalRef = this.modalService.open(ModalScheduleScanCollisionComponent, {
					backdrop: 'static',
					size: 'lg',
					centered: true,
					windowClass: 'hardware-scan-modal-size'
				});

				this.hardwareScanService.setCurrentTaskStep(TaskStep.Confirm);

				( modal.componentInstance as ModalScheduleScanCollisionComponent).error = this.translate.instant('hardwareScan.warning');
				( modal.componentInstance as ModalScheduleScanCollisionComponent).description = this.batteryMessage;
				( modal.componentInstance as ModalScheduleScanCollisionComponent).description = this.batteryMessage;
				( modal.componentInstance as ModalScheduleScanCollisionComponent).ItemParent = this.getMetricsParentValue();
				( modal.componentInstance as ModalScheduleScanCollisionComponent).CancelItemName = this.getMetricsItemNameClose();
				( modal.componentInstance as ModalScheduleScanCollisionComponent).ConfirmItemName = this.getMetricsItemNameConfirm();

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
			status: HardwareScanTestResult[HardwareScanTestResult.Pass],
			statusValue: HardwareScanTestResult.Pass,
			statusToken: this.statusToken(HardwareScanTestResult.Pass),
			date: this.hardwareScanService.getFinalResultStartDate(),
			information: this.hardwareScanService.getFinalResultDescription(),
			items: []
		};

		for (const module of this.modules) {
			let module_id = module.id;
			if (!this.hardwareScanService.getIsDesktopMachine()) {
				if (module_id === 'pci_express') {
					module_id += '_laptop';
				}
			}

			const item = {
				id: module.id,
				module: module.module,
				name: module.name,
				resultCode: module.resultCode,
				information: module.description,
				collapsed: false,
				icon: module_id,
				details: [],
				listTest: []
			};

			for (const metaInfo of module.metaInformation) {
				const info = {};
				info[metaInfo.name] = metaInfo.value;
				item.details.push(info);
			}

			for (const test of module.listTest) {
				item.listTest.push({
					id: test.id,
					name: test.name,
					status: test.status,
					information: test.description,
					statusToken: this.statusToken(test.status)
				});

				if (test.status === HardwareScanTestResult.Cancelled) {
					results.status = HardwareScanTestResult[HardwareScanTestResult.Cancelled];
					results.statusValue = HardwareScanTestResult.Cancelled;
					results.statusToken = this.statusToken(HardwareScanTestResult.Cancelled);
				} else if (test.status === HardwareScanTestResult.Fail) {
					results.status = HardwareScanTestResult[HardwareScanTestResult.Fail];
					results.statusValue = HardwareScanTestResult.Fail;
					results.statusToken = this.statusToken(HardwareScanTestResult.Fail);
				} else if (test.status === HardwareScanTestResult.Warning) {
					results.status = HardwareScanTestResult[HardwareScanTestResult.Warning];
					results.statusValue = HardwareScanTestResult.Warning;
					results.statusToken = this.statusToken(HardwareScanTestResult.Warning);
				}
			}
			results.items.push(item);
		}

		// Update the ViewResultItem and list of the modules with the details
		this.hardwareScanService.setViewResultItems(results);
		this.modules = results.items;
	}

	/* This function is used to standardize the RBS intermediate response with the same used by a Scan. */
	public standardizeRbsResponse(){
		const moduleInformation = this.hardwareScanService.getModulesRetrieved();
		if ( moduleInformation ) {
			let storageModule =
				moduleInformation.categoryList.find( category => category.id === 'storage' );

			const results = { items: [] };

			for (const device of this.devicesRecoverBadSectors) {

				const item = {
					module: storageModule.name,
					icon: storageModule.id,
					name: device.name,
					collapsed: false,
					listTest: [{
						id: '',
						name: device.name,
						status: device.status,
						percent:device.percent,
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
			let storageModule = moduleInformation.categoryList.find( category => category.id === 'storage' );

			const date = new Date();
			const day = date.getDate().toString();
			const month = date.getMonth() + 1;
			const monthString = month.toString();
			const year = date.getFullYear().toString();
			const time = date.toTimeString().split(' ');
			const dateString = year + '/' + monthString + '/' + day + ' ' + time[0];

			const results = {
				status: HardwareScanTestResult[HardwareScanTestResult.Pass],
				statusValue: HardwareScanTestResult.Pass,
				statusToken: this.statusToken(HardwareScanTestResult.Pass),
				date: dateString,
				items: []
			};

			for (const device of this.devicesRecoverBadSectors) {
				const item = {
					module: storageModule.name,
					icon: storageModule.id,
					name: device.name,
					collapsed: false,
					details: [
						{ [this.translate.instant('hardwareScan.recoverBadSectors.numberSectors')]: device.numberOfSectors },
						{ [this.translate.instant('hardwareScan.recoverBadSectors.numberBadSectors')]: device.numberOfBadSectors },
						{ [this.translate.instant('hardwareScan.recoverBadSectors.numberFixedSectors')]: device.numberOfFixedSectors },
						{ [this.translate.instant('hardwareScan.recoverBadSectors.numberNonFixedSectors')]: device.numberOfNonFixedSectors },
						{ [this.translate.instant('hardwareScan.recoverBadSectors.elapsedTime')]: device.elapsedTime }
					],
					listTest: [{
						id: '',
						name: device.name,
						status: device.status,
						percent:device.percent,
					}],
				};

				if (device.status === HardwareScanTestResult.Cancelled) {
					results.status = HardwareScanTestResult[HardwareScanTestResult.Cancelled];
					results.statusValue = HardwareScanTestResult.Cancelled;
					results.statusToken = this.statusToken(HardwareScanTestResult.Cancelled);
				} else if (device.status === HardwareScanTestResult.Fail) {
					results.status = HardwareScanTestResult[HardwareScanTestResult.Fail];
					results.statusValue = HardwareScanTestResult.Fail;
					results.statusToken = this.statusToken(HardwareScanTestResult.Fail);
				} else if (device.status === HardwareScanTestResult.Warning) {
					results.status = HardwareScanTestResult[HardwareScanTestResult.Warning];
					results.statusValue = HardwareScanTestResult.Warning;
					results.statusToken = this.statusToken(HardwareScanTestResult.Warning);
				}
				results.items.push(item);
			}

		this.hardwareScanService.setViewResultItems(results);
		this.modules = results.items;
		}
	}

	private statusToken(status) {
		switch (status) {
			case HardwareScanTestResult.Cancelled:
				return this.translate.instant('hardwareScan.cancelled');
			case HardwareScanTestResult.Fail:
				return this.translate.instant('hardwareScan.fail');
			case HardwareScanTestResult.Pass:
				return this.translate.instant('hardwareScan.pass');
			case HardwareScanTestResult.Warning:
				return this.translate.instant('hardwareScan.warning');
		}
	}

	public finalStatusToken() {
		return this.completeStatusToken;
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
					if (payload.status === false) {
						this.completeStatusToken = this.translate.instant('hardwareScan.notCompleted');
					} else {
						this.completeStatusToken = this.translate.instant('hardwareScan.completed');
					}
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

					if (payload.status === false) {
						this.completeStatusToken = this.translate.instant('hardwareScan.notCompleted');
					} else {
						this.completeStatusToken = this.translate.instant('hardwareScan.completed');
					}
					break;
				case HardwareScanProgress.HasDevicesToRecoverBadSectors:
					break;
				case NetworkStatus.Online:
					this.isOnline = notification.payload.isOnline;
					this.lenovoSupportService.startCheckingIfETicketIsAvailable();
					break;
				case NetworkStatus.Offline:
					this.isOnline = notification.payload.isOnline;
					break;
				case HardwareScanProgress.BackEvent:
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
						Result: HardwareScanTestResult[test.status],
						// for now, this field will be "NA". At a later time, more useful information will be sent by the Plugin to fill it.
						Reason: 'NA',
					};

					if (test.status === HardwareScanTestResult.Pass) {
						countSuccesses = countSuccesses + 1;
					}

					// Only change result when finds a worse case
					if (this.resultSeverityConversion[overalTestResult] < this.resultSeverityConversion[test.status]) {
						overalTestResult = test.status;
					}

					resultJson.TestsList[testName].push(testObj);
				}
			}
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
			// Only change result when finds a worse case
			if (this.resultSeverityConversion[result] < this.resultSeverityConversion[device.status]) {
				result = device.status;
			}

			// Counting the devices where RBS was successful
			if (device.status == HardwareScanTestResult.Pass) {
				numberOfSuccess++;
			}
		}

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

	private sendTaskActionMetrics(taskName: TaskType , taskCount: number, taskParam: string,
									 taskResult: any, taskDuration: number) {
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
