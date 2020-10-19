import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { TaskStep, TaskType, HardwareScanTestResult, HardwareScanProtocolModule } from 'src/app/modules/hardware-scan/enums/hardware-scan.enum';
import { TimerService } from 'src/app/services/timer/timer.service';
import { ModalPreScanInfoComponent } from '../components/modal/modal-pre-scan-info/modal-pre-scan-info.component';
import { HardwareScanResultService } from './hardware-scan-result.service';
import { HardwareScanService } from './hardware-scan.service';
import { RecoverBadSectorsService } from './recover-bad-sectors.service';
import { LenovoSupportService } from './lenovo-support.service';
import { ModalScanFailureComponent } from '../components/modal/modal-scan-failure/modal-scan-failure.component';
import { PreviousResultService } from './previous-result.service';
import { ModalCancelComponent } from '../components/modal/modal-cancel/modal-cancel.component';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { FormatLocaleDateTimePipe } from 'src/app/pipe/format-locale-datetime/format-locale-datetime.pipe';

const RootParent = 'HardwareScan';
const CancelButton = 'Cancel';
const ConfirmButton = 'Confirm';
const CloseButton = 'Close';
const ViewResultsButton = 'ViewResults';

@Injectable({
  providedIn: 'root'
})
export class ScanExecutionService {
	private startScanClicked = false;
	private itemParentCancelScan: string;
	private itemNameCancelScan: string;
	private devicesRecoverBadSectors: any[];
	private rbsStartDate: Date;
	private progress = 0;
	private metrics: any;
	private culture: any;
	private modulesStored: any;
	private batteryMessage: string;
	private lastModules: HardwareScanProtocolModule;

	private cancelHandler = {
		cancel: undefined
	};

	constructor(
		private hardwareScanService: HardwareScanService,
		private timerService: TimerService,
		private hardwareScanResultService: HardwareScanResultService,
		private recoverBadSectorsService: RecoverBadSectorsService,
		private modalService: NgbModal,
		private translate: TranslateService,
		private lenovoSupportService: LenovoSupportService,
		private previousResultService: PreviousResultService,
		private shellService: VantageShellService,
		private formatDateTime: FormatLocaleDateTimePipe) {
			this.culture = this.hardwareScanService.getCulture();
			this.metrics = this.shellService.getMetrics();
	}

	// Getters and Setters
	public set deviceInRecover(value: string) {
		this.hardwareScanService.setDeviceInRecover(value);
	}
	public get deviceInRecover(): string {
		return this.hardwareScanService.getDeviceInRecover();
	}

	public set modules(value: any) {
		this.modulesStored = value;
	}

	public get modules(): any {
		return this.modulesStored;
	}

	public setLastModules(value: HardwareScanProtocolModule) {
		this.lastModules = value;
	}

	public getLastModules(): any {
		return this.lastModules;
	}

	public set setDevicesRecoverBadSectors(devices: any) {
		this.devicesRecoverBadSectors = devices;
	}

	public set executionProgress(value: any) {
		this.progress = value;
	}

	public get executionProgress(): any {
		return this.progress;
	}

	public get scanClicked(): boolean {
		return this.startScanClicked;
	}

	public set scanClicked(value: boolean) {
		this.startScanClicked = value;
	}

	public get itemParentCancelScanMetrics(): string {
		return this.itemParentCancelScan;
	}

	public set itemParentCancelScanMetrics(value: string) {
		this.itemParentCancelScan = value;
	}

	public get itemNameCancelScanMetrics(): string {
		return this.itemNameCancelScan;
	}

	public set itemNameCancelScanMetrics(value: string) {
		this.itemNameCancelScan = value;
	}

	public get devicesToRecoverBadSectors(): any[] {
		return this.devicesRecoverBadSectors;
	}

	public set devicesToRecoverBadSectors(devices: any[]) {
		this.devicesRecoverBadSectors = devices;
	}

	// Recover Bad Sectors Functions
	public doRecoverBadSectors() {
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
			this.rbsStartDate = new Date();
			this.hardwareScanService.getRecoverBadSectors(payload)
				.then((response) => {
				this.hardwareScanService.setEnableViewResults(true);
				// Sending the RBS's TaskAction metrics
				const rbsTaskActionResult = this.getRecoverBadSectorsMetricsTaskResult(response);
				this.sendTaskActionMetrics(TaskType.RecoverBadSectors, rbsTaskActionResult.taskCount,
					'', rbsTaskActionResult.taskResult, this.timerService.stop());
			})
			.finally(() => {
				this.onViewResultsRecover();
			});
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

			const results = {
				resultModule: HardwareScanTestResult.Pass,
				startDate: this.rbsStartDate,
				date: this.formatDateTime.transform(new Date()),
				items: []
			};

			for (const device of this.devicesRecoverBadSectors) {
				const item = {
					module: storageModule.name,
					icon: storageModule.id,
					name: device.name,
					deviceId: device.id,
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
						id: device.id,
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

	public generateRequestAndResponseScan(taskType: TaskType, scanAgain = false, moduleExecution = HardwareScanProtocolModule.all) {
		let requests;
		let response;

		this.hardwareScanService.cleanResponses();
		this.hardwareScanService.setCurrentTaskType(taskType);

		if (taskType === TaskType.QuickScan && moduleExecution === HardwareScanProtocolModule.all) {
			response = this.hardwareScanService.getQuickScanResponse();
			requests = this.hardwareScanService.getQuickScanRequest();
		} else {
			response = this.hardwareScanService.getQuickScanResponse()
							.filter(moduleName => moduleName.id === moduleExecution);
			requests = this.hardwareScanService.getQuickScanRequest()
							.filter(moduleName => moduleName.moduleId === moduleExecution);
		}

		if (taskType === TaskType.CustomScan) {
			if (scanAgain) {
				response = this.hardwareScanService.getLastFilteredCustomScanResponse();
				requests = this.hardwareScanService.getLastFilteredCustomScanRequest();
			} else {
				response = this.hardwareScanService.getFilteredCustomScanResponse();
				requests = this.hardwareScanService.getFilteredCustomScanRequest();
			}
			// Saving the selected filter in case the user wants to redo the same scan
			this.hardwareScanService.setLastFilteredCustomScanResponse(response);
			this.hardwareScanService.setLastFilteredCustomScanRequest(requests);
		}

		this.setLastModules(moduleExecution);
		return [response, requests];
	}


	// Scan Execution Functions
	public checkPreScanInfo(taskType: TaskType, scanAgain = false, moduleExecution = HardwareScanProtocolModule.all) {

		let requests;
		[this.modules, requests] = this.generateRequestAndResponseScan(taskType, scanAgain, moduleExecution);

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

		this.validateBatteryModal(preScanInformationRequest, taskType, requests);
	}

	private validateBatteryModal(preScanInfo: any, taskType: TaskType, requests: any) {
		this.batteryMessage = '';

		this.hardwareScanService.getPreScanInfo(preScanInfo).then((response) => {
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
					this.getDoScan(requests);
					// User has clicked in the OK button, so we need to re-enable the Quick/Custom scan button here
					this.startScanClicked = false;
				}, () => {
					this.hardwareScanService.cleanCustomTests();
					// User has clicked in the 'X' button, so we also need to re-enable the Quick/Custom scan button here.
					this.startScanClicked = false;
				});
			} else {
				this.getDoScan(requests);
			}
		});
	}

	/*
	* Used to start a scan, 0 is a quick scan, and 1 is a custom scan
	*/
	private getDoScan(requests: any): any {
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

				return undefined;
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

		return false;
	}

	private cleaningUpScan(response: any): boolean {
		if (response) {
			this.hardwareScanService.setFinalResponse(response);
		}

		this.startScanClicked = false;
		if (!this.hardwareScanService.isCancelRequested()) {
			this.hardwareScanService.setEnableViewResults(true);
		} else {
			return true;
		}
		return false;
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

	public onCancelScan() {
		let isCancelingRBS;
		if (this.hardwareScanService) {
			isCancelingRBS = this.hardwareScanService.isRecoverExecuting();
		}

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

	// Metrics purposes
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
}
