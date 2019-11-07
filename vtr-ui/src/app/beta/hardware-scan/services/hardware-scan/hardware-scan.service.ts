import { Injectable, NgZone } from '@angular/core';
import { HardwareScanProgress } from 'src/app/beta/hardware-scan/enums/hw-scan-progress.enum';
import { HardwareScanTestResult } from 'src/app/beta/hardware-scan/enums/hardware-scan-test-result.enum';
import { HardwareScanOverallResult } from 'src/app/beta/hardware-scan/enums/hardware-scan-overall-result.enum';
import { TranslateService } from '@ngx-translate/core';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { CommonService } from 'src/app/services/common/common.service';
import { Subject, Observable } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class HardwareScanService {

	private hardwareScanBridge: any;
	private modulesRetrieved: any; // modules retrieve from get items [object from ItemToScanResponse]
	private isLoadingModulesDone = false;
	private isScanDone = false;
	private scanExecution = false;
	private hasLastResults = false;
	private hasItemsToRecoverBadSectors = false;
	private devicesToRecoverBadSectors;
	private progress = 0;
	private modules: any; // modules displayed on screen
	private viewResultItems: any;
	private devices: any[];
	private recoverExecution = false;
	private recoverInProgress = false;
	private recoverInit = false;
	private deviceInRecover: string;
	private isViewingRecoverLog = false;
	private hasDevicesToRecover = false;

	private quickScanRequest: any = []; // request modules
	private quickScanResponse: any = []; // response modules
	private customScanRequest: any = []; // request modules
	private customScanResponse: any = []; // response modules
	private customScanModules: any = []; // modules to display on custom modal
	private categoryInformationList: any = []; // List of categoryInformation
	private filteredCustomScanRequest = [];
	private filteredCustomScanResponse = [];
	private previousResults = {};
	private previousItemsWidget = {};
	private cancelRequested: boolean;
	private disableCancel = false;
	private finalResponse: any;
	private enableViewResults = false;
	private lastResponse: any;
	private workDone = new Subject<boolean>();
	private hardwareScanAvailable: boolean;

	constructor(shellService: VantageShellService, private commonService: CommonService, private ngZone: NgZone, private translate: TranslateService) {
		this.hardwareScanBridge = shellService.getHardwareScan();
		this.hardwareScanAvailable = this.isAvailable();
	}

	public getCategoryInformation() {
		return this.categoryInformationList;
	}

	public getModulesRetrieved() {
		return this.modulesRetrieved;
	}

	public getQuickScanRequest() {
		return this.quickScanRequest;
	}

	public getQuickScanResponse() {
		return this.quickScanResponse;
	}

	public getCustomScanRequest() {
		return this.customScanRequest;
	}

	public getCustomScanResponse() {
		return this.customScanResponse;
	}

	public getCustomScanModules() {
		return this.customScanModules;
	}

	public getFilteredCustomScanRequest() {
		return this.filteredCustomScanRequest;
	}

	public getFilteredCustomScanResponse() {
		return this.filteredCustomScanResponse;
	}

	public getProgress() {
		return this.progress;
	}

	public getViewResultItems() {
		return this.viewResultItems;
	}

	public setViewResultItems(items: any) {
		this.viewResultItems = items;
	}

	public getDevicesRecover() {
		return this.devices;
	}

	public setDevicesRecover(items: any[]) {
		this.devices = items;
	}

	public getPreviousResults() {
		return this.previousResults;
	}

	public getPreviousResultsWidget() {
		return this.previousItemsWidget;
	}

	public getHasDevicesToRecover() {
		return this.hasDevicesToRecover;
	}

	public isScanExecuting() {
		return this.scanExecution;
	}

	public hasPreviousResults() {
		return this.hasLastResults;
	}

	public setScanExecutionStatus(status: boolean) {
		this.scanExecution = status;
	}

	public isLoadingDone() {
		return this.isLoadingModulesDone;
	}

	public setLoadingStatus(status: boolean) {
		this.isLoadingModulesDone = status;
	}

	public setIsScanDone(status: boolean) {
		this.isScanDone = status;
	}

	public isScanDoneExecuting() {
		return this.isScanDone;
	}

	public getLastResponse() {
		return this.modules;
	}

	public getDevicesToRecoverBadSectors() {
		return this.devicesToRecoverBadSectors;
	}

	public getHasItemsToRecoverBadSectors() {
		return this.hasItemsToRecoverBadSectors;
	}

	public isRecoverExecuting() {
		return this.recoverExecution;
	}

	public setRecoverExecutionStatus(status: boolean) {
		this.recoverExecution = status;
	}

	public isRecoverInProgress() {
		return this.recoverInProgress;
	}

	public setRecoverInProgress(status: boolean) {
		this.recoverInProgress = status;
	}

	public getIsViewingRecoverLog() {
		return this.isViewingRecoverLog;
	}

	public setIsViewingRecoverLog(status: boolean) {
		this.isViewingRecoverLog = status;
	}

	public isRecoverInit() {
		return this.recoverInit;
	}

	public setRecoverInit(status: boolean) {
		this.recoverInit = status;
	}

	public setHasItemsToRecoverBadSectors(status: boolean) {
		this.hasItemsToRecoverBadSectors = status;
	}

	public isDisableCancel() {
		return this.disableCancel;
	}

	public setFinalResponse(response: any) {
		this.finalResponse = response;
	}

	public getFinalResponse() {
		return this.finalResponse;
	}

	public getFinalResultCode() {
		if (this.finalResponse && this.finalResponse.finalResultCode) {
			return this.finalResponse.finalResultCode;
		}
		return '';
	}

	public getFinalResultDescription() {
		if (this.finalResponse && this.finalResponse.resultDescription) {
			return this.finalResponse.resultDescription;
		}
		return '';
	}

	public getFinalResultStartDate() {
		if (this.finalResponse && this.finalResponse.startDate) {
			return this.finalResponse.startDate;
		}
		return '';
	}

	public setEnableViewResults(status: boolean) {
		this.enableViewResults = status;
	}

	public getEnableViewResults() {
		return this.enableViewResults;
	}

	public isCancelRequested() {
		return this.cancelRequested;
	}

	public setHasDevicesToRecover(status: boolean) {
		this.hasDevicesToRecover = status;
	}

	public getHardwareScanAvailable() {
		return this.hardwareScanAvailable;
	}

	public setHardwareScanAvailable(status: boolean) {
		this.hardwareScanAvailable = status;
	}

	public deleteScan(payload) {
		console.log('[Start] DeleteScan (hwscanService)!');
		if (this.hardwareScanBridge) {
			return this.hardwareScanBridge.deleteScan(payload)
				.then((response) => {
					if (response) {
						console.log('[DELETE SCAN] ', response);
					} else {
						console.log('Delete Scan undefined');
					}
					return response;
				});
		}
		return undefined;
	}

	public editScheduledScan(payload) {
		if (this.hardwareScanBridge) {
			return this.hardwareScanBridge.editScan(payload)
				.then((response) => {
					if (response) {
						console.log('[EDIT SCAN] ', response);
					} else {
						console.log('EDIT Scan undefined');
					}
					return response;
				});
		}
		return undefined;
	}

	public getNextScans() {
		console.log('[Start] NextScans (hwscanService)!');
		if (this.hardwareScanBridge) {
			return this.hardwareScanBridge.getNextScans()
				.then((response) => {
					if (response) {
						console.log('[NEXT SCANS] ', response);
						console.log('[Schedule Requests] ', response.scheduleRequests);
					} else {
						console.log('NextScans undefined');
					}
					return response;
				});
		}

		return undefined;
	}

	public getScheduleScan(payload) {
		console.log('[Start] getScheduleScan (hwscanService)!');
		if (this.hardwareScanBridge) {
			return this.hardwareScanBridge.getScheduleScan(payload)
				.then((response) => {
					if (response) {
						console.log(response);
					} else {
						console.log('Schedule Response undefined');
					}

					return response;
				});
		}
		return undefined;
	}

	public getPluginInfo() {
		console.log('[Start]: getPluginInfo() on service');
		if (this.hardwareScanBridge) {
			return this.hardwareScanBridge.getPluginInformation()
				.then((response) => {
					console.log(response);
					return response;
				});
		}
		console.log('[End]: getPluginInfo() on service');
		return undefined;
	}

	public isHardwareScanAvailable() {
		return this.hardwareScanAvailable;
	}

	public isAvailable() {
		return this.getPluginInfo()
			.then((hwscanPluginInfo: any) => {
				// Shows Hardware Scan menu icon only when the Hardware Scan plugin exists and it is not Legacy (version <= 1.0.38)
				this.hardwareScanAvailable = hwscanPluginInfo !== undefined &&
					   hwscanPluginInfo.LegacyPlugin === false &&
					   hwscanPluginInfo.PluginVersion !== "1.0.39"; // This version is not compatible with current version
			})
			.catch(() => {
				this.hardwareScanAvailable = false;
			});
	}

	public getItemsToScan(scanType: number, culture: string) {
		console.log('[Start]: getItemsToScan() on service');
		if (this.hardwareScanBridge) {
			return this.hardwareScanBridge.getItemsToScan(scanType, culture)
				.then((response) => {
					console.log(response);
					return response;
				});
		}
		console.log('[End]: getItemsToScan() on service');
		return undefined;
	}

	public getPreScanInfo(payload) {
		console.log('[Start]: getPreScanInfo() on service');
		if (this.hardwareScanBridge) {
			return this.hardwareScanBridge.getPreScanInformation(payload)
				.then((response) => {
					console.log('[PRE SCAN INFO] ', response);
					return response;
				});
		}
		console.log('[End]: getPreScanInfo() on service');
		return undefined;
	}

	public getDoScan(payload, modules, cancelHandler) {
		console.log('[Start]: getDoScan() on service');
		if (this.hardwareScanBridge) {
			this.cancelRequested = false;
			this.modules = modules;
			this.scanExecution = true;
			this.workDone.next(false);
			this.clearLastResponse();
			return this.hardwareScanBridge.getDoScan(payload, (response: any) => {
				console.log('response', response);
				// Keeping track of the latest response allows the right render when user
				// navigates to another page and then come back to the Hardware Scan page
				this.lastResponse = response;
				this.updateProgress(response);
				this.updateScanResponse(response);
			}, cancelHandler)
				.then((response) => {
					console.log('[End]: getDoScan() on service');
					if (response !== null && response.finalResultCode !== null) {
						return response;
					}
				}).catch((ex: any) => {
					console.error('[getDoScan on service] An exception has occurred: ', ex);
					if (ex !== null) {
						this.cancelRequested = true;
					}
					throw ex;
				}).finally(() => {
					this.setIsScanDone(true);
					this.cleanUp();

					if (this.cancelRequested === true) {
						this.scanExecution = false;
						// this.isLoadingModulesDone = false;
					}

					this.workDone.next(true);
				});
		}
		return undefined;
	}

	public hasLastResponse() {
		return this.lastResponse != undefined;
	}

	public clearLastResponse() {
		this.lastResponse = undefined;
	}

	/**
	 * Renders the latest Scan/RBS's status.
	 * It ensures that the user will see an updated status when entering in the
	 * HardwareScan main page if either a Scan or RBS is running.
	 */
	public renderLastResponse() {
		// Recover bad sectors response has a member devices,
		// Scan responses doesn't.
		const isRBSResponse = this.lastResponse.devices &&
			this.lastResponse.devices.length &&
			this.lastResponse.devices[0].numberOfSectors != undefined;

		if (isRBSResponse) {
			this.updateRecover(this.lastResponse);
			this.updateProgressRecover(this.lastResponse);
		} else {
			this.updateProgress(this.lastResponse);
			this.updateScanResponse(this.lastResponse);
		}
	}

	/**
	 * This can be observed to know when a Scan/RBS work has done (successfully or canceled)
	 */
	public isWorkDone(): Observable<boolean> {
		return this.workDone.pipe(first())
	}

	public cancelScanExecution() {
		console.log('[Service] Start Cancel Scan Execution');
		if (this.hardwareScanBridge) {
			return this.hardwareScanBridge.cancelScan((response: any) => {
				console.log('[cancelScanExecution][Progress]: ', response);
			})
			.then((response) => {
				this.cancelRequested = true;
				this.clearLastResponse();
			})
			.finally(() => {
				this.cleanUp();
			});
		}
		return undefined;
	}

	private updateStatusOfTests(doScanResponse: any) {
		for (const response of doScanResponse.responses) {
			for (const group of response.groupResults) {
				for (const test of group.testResultList) {
					if (test.result === HardwareScanOverallResult.Incomplete) {
						test.percentageComplete = 100;
						test.result = HardwareScanOverallResult.Cancelled;
					}
				}
			}
		}
	}

	public getRecoverBadSectors(payload) {
		console.log('[Start] Recover on Service');
		this.disableCancel = true;
		if (this.hardwareScanBridge) {
			this.clearLastResponse();
			return this.hardwareScanBridge.getRecoverBadSectors(payload, (response: any) => {
				// Keeping track of the latest response allows the right render when user
				// navigates to another page and then come back to the Hardware Scan page
				this.lastResponse = response;
				this.updateRecover(response);
				this.updateProgressRecover(response);
				this.disableCancel = false;
			}).then((response) => {
				console.log(response);

				for (let i = 0; i < this.devices.length; i++) {
					if (Number(response.devices[i].numberOfNonFixedSectors) > 0) {
						response.devices[i].status = HardwareScanTestResult.Warning;
					}
				}

				// Keeping track of the latest response allows the right render when user
				// navigates to another page and then come back to the Hardware Scan page
				this.lastResponse = response;
				this.updateRecover(response);
				this.updateProgressRecover(response);
				console.log('[End]: Recover on service');
				return response;
			}).finally(() => {
				this.setIsScanDone(true);
				this.cleanUp();
			});
		}
	}

	public updateRecover(response: any) {
		console.log('[Start] Update Recover');

		let statusRecover = true;

		for (let i = 0; i < this.devices.length; i++) {
			this.devices[i].percent = response.devices[i].percentageComplete;
			this.devices[i].numberOfSectors = response.devices[i].numberOfSectors;
			this.devices[i].numberOfBadSectors = response.devices[i].numberOfBadSectors;
			this.devices[i].numberOfFixedSectors = response.devices[i].numberOfFixedSectors;
			this.devices[i].numberOfNonFixedSectors = response.devices[i].numberOfNonFixedSectors;
			this.devices[i].elapsedTime = response.devices[i].elapsedTime;
			this.devices[i].status = response.devices[i].status;

			if (response.devices[i].status !== HardwareScanTestResult.Pass) {
				statusRecover = false;
			}

			if (response.devices[i].status === HardwareScanTestResult.InProgress && response.devices[i].deviceName !== '') {
				this.deviceInRecover = response.devices[i].deviceName;
			}
		}

		const payload = {
			devices: this.devices,
			deviceInRecover: this.deviceInRecover,
			status: statusRecover
		};

		console.log('Recover Updated: ', payload);
		this.commonService.sendNotification(HardwareScanProgress.RecoverResponse, payload);
		console.log('[End] Update Recover');
	}

	public updateProgressRecover(response: any) {
		console.log('[Start] Update Progress Recover');
		let totalPercent = 0;

		for (let i = 0; i < this.devices.length; i++) {
			totalPercent += response.devices[i].percentageComplete;
		}

		this.progress = Math.round(totalPercent / this.devices.length);

		if (isNaN(this.progress)) {
			this.progress = 0;
		}

		console.log('[Recover Progress] ' + this.progress);
		this.commonService.sendNotification(HardwareScanProgress.ScanProgress, this.progress);
		console.log('[End] Update Progress Recover');
	}

	public getItemsToRecoverBadSectors() {
		console.log('[Start] Start Get Items to Recover Bad Sectors');
		if (this.hardwareScanBridge) {
			return this.hardwareScanBridge.getItemsToRecoverBadSectors()
				.then((response) => {
					if (response) {
						console.log(response);
						return response;
					} else {
						console.log('Response to GetItemsToRecoverBadSectors is null');
					}
				});
		}
	}

	public async initLoadingModules(culture) {
		this.hasItemsToRecoverBadSectors = false;
		this.getAllItems(culture).then(() => {
			this.getItemsToRecoverBadSectors().then((response) => {
				this.devicesToRecoverBadSectors = response.categoryList[0];
				console.log('this.devicesToRecoverBadSectors', this.devicesToRecoverBadSectors);
				if (this.devicesToRecoverBadSectors.groupList.length !== 0) {
					this.hasItemsToRecoverBadSectors = true;
				}
			});
			this.isLoadingModulesDone = true;
			this.loadCustomModal();
		});
	}

	private async getAllItems(culture) {
		if (this.hardwareScanBridge) {
			await this.getItemsToScan(2, culture)
				.then((response) => {
					console.log('getAllItems(): ', response);
					this.modulesRetrieved = response;
					this.categoryInformationList = this.modulesRetrieved.categoryList;

					this.customScanRequest = this.buildScanRequest(this.modulesRetrieved, culture);
					this.quickScanRequest = this.filterQuickRequest(this.customScanRequest);
					console.log('this.customScanRequest: ', this.customScanRequest);
					console.log('this.quickScanRequest: ', this.quickScanRequest);

					this.customScanResponse = this.buildScanResponse(this.modulesRetrieved);
					this.quickScanResponse = this.filterQuickResponse(this.customScanResponse);
					console.log('this.customScanResponse: ', this.customScanResponse);
					console.log('this.quickScanResponse: ', this.quickScanResponse);
				});
		}
	}

	private filterQuickRequest(customScanRequest: any) {
		const quickScanRequest = [];
		for (const request of customScanRequest) {
			const module = JSON.parse(JSON.stringify(request)); // Deep Clone Object
			module.testRequestList = module.testRequestList.filter(x => x.testType === '1');
			quickScanRequest.push(module);

		}
		return quickScanRequest;
	}

	private filterQuickResponse(customScanResponse: any) {
		const quickScanResponse = [];
		for (const response of customScanResponse) {
			const module = JSON.parse(JSON.stringify(response)); // Deep Clone Object
			module.listTest = module.listTest.filter(x => x.testType === '1');
			quickScanResponse.push(module);
		}
		return quickScanResponse;
	}

	private checkItemsForRecoverBadSectors() {
		if (this.hardwareScanBridge) {
			return this.hardwareScanBridge.checkItemsForRecoverBadSectors()
				.then((response) => {
					console.log(response);
					return response;
				});
		}
	}

	private cleanSelectedCustomTests() {
		console.log('[START] CLEAN CUSTOM TESTS');
		for (let i = 0; i < this.customScanModules.length; i++) {
			this.customScanModules[i].selected = false;
			this.customScanModules[i].indeterminate = false;
			this.customScanModules[i].collapsed = false;
			for (let j = 0; j < this.customScanModules[i].tests.length; j++) {
				this.customScanModules[i].tests[j].selected = false;
				console.log('[TEST] ', this.customScanModules[i].tests[j]);
			}
		}
	}

	private loadCustomModal() {
		this.customScanModules = [];
		// console.log('[loadCustomModal] this.customScanRequest: ', this.customScanRequest);
		// console.log('[loadCustomModal] this.customScanResponse: ', this.customScanResponse);
		let modalModuleId = 0;
		for (let i = 0; i < this.customScanResponse.length; i++) {
			const module = {
				id: modalModuleId,
				moduleId: this.customScanResponse[i].id,
				name: this.customScanResponse[i].module,
				subname: this.customScanResponse[i].name,
				selected: false,
				collapsed: false,
				indeterminate: false,
				tests: []
			};

			for (let j = 0; j < this.customScanResponse[i].listTest.length; j++) {
				const test = {
					id: this.customScanResponse[i].listTest[j].id,
					test: undefined,
					name: this.customScanResponse[i].listTest[j].name,
					selected: false,
				};

				const currentModule = this.customScanRequest.find(x => x.moduleId === module.moduleId);
				// console.log('[loadCustomModel]: currentModule', currentModule);

				const groupId = this.customScanResponse[i].groupId;
				// console.log('[loadCustomModel]: groupId', groupId);
				test.test = currentModule.testRequestList.find(x => x.id === test.id && x.groupId === groupId);

				// console.log('[loadCustomModel]: test', test);
				module.tests.push(test);
			}

			modalModuleId++;
			this.customScanModules.push(module);
		}
	}

	private buildScanRequest(modulesRetrieved: any, culture: string) {
		console.log('[Start] Build scan request');
		const scanRequests = [];
		let testRequestList = [];

		if (modulesRetrieved !== undefined) {
			for (const categoryInfo of modulesRetrieved.categoryList) {
				for (const group of categoryInfo.groupList) {
					for (const testSummary of group.testList) {
						testRequestList.push({
							groupId: group.id,
							id: testSummary.id,
							moduleName: categoryInfo.id,
							testType: testSummary.groupId
						});
					}
				}
				scanRequests.push({
					lang: culture,
					loopCount: 0,
					loopRepeatMinutes: 0,
					testRequestList: testRequestList,
					metaData: undefined,
					moduleId: categoryInfo.id,
				});
				testRequestList = [];
			}
		}
		console.log('scanRequest: ', scanRequests);
		console.log('[End] Build scan request');
		return scanRequests;
	}

	private buildScanResponse(modulesRetrieved: any) {
		console.log('[Start] Build scan module response');
		console.log('Modules retrieved: ', modulesRetrieved);
		const moduleList = [];
		if (modulesRetrieved !== undefined) {

			for (const categoryInfo of modulesRetrieved.categoryList) {
				for (const group of categoryInfo.groupList) {
					const item = {
						id: '',
						groupId: '',
						module: '',
						name: '',
						resultCode: '',
						description: '',
						information: '',
						metaInformation: [],
						listTest: []
					};

					item.module = categoryInfo.name;
					item.id = categoryInfo.id;
					item.groupId = group.id;
					item.listTest = [];
					item.name = group.name;
					item.metaInformation = group.metaInformation;

					for (const testSummary of group.testList) {
						item.listTest.push({
							id: testSummary.id,
							name: testSummary.name,
							description: testSummary.description,
							information: testSummary.description,
							status: HardwareScanTestResult.NotStarted,
							percent: 0,
							testType: testSummary.groupId
						});
					}
					moduleList.push(item);
				}
			}
		}

		console.log('Modules retrieved: ', moduleList);
		console.log('[End] Build scan module response');
		return moduleList;
	}

	private updateCustomScanRequest(quickScanRequest: any) {
		console.log('[Start] Update custom scan request');
		if (quickScanRequest !== undefined) {
			for (let i = 0; i < quickScanRequest.length; i++) {
				const testListReverse = quickScanRequest[i].testRequestList.reverse();
				for (const test of testListReverse) {
					this.customScanRequest[i].testRequestList.unshift(test);
				}
			}
		}
		console.log('[End] Update custom scan request');
	}

	// private updateCustomScanResponse(quickScanModules: any) {
	// 	console.log('[Start] Update custom scan modules response');
	// 	if (quickScanModules !== undefined) {
	// 		for (let i = 0; i < quickScanModules.length; i++) {
	// 			const testListReverse = quickScanModules[i].listTest.reverse();
	// 			for (const test of testListReverse) {
	// 				this.customScanResponse[i].listTest.unshift(test);
	// 			}
	// 		}
	// 	}
	// 	console.log('[End] Update custom scan modules response');
	// }

	private updateProgress(response: any) {
		console.log('[Start] Update Progress');
		console.log('updateProgress: ', response.responses);
		let totalTests = 0;
		let testsCompleted = 0;

		for (const scanResp of response.responses) {
			for (const group of scanResp.groupResults) {
				for (const test of group.testResultList) {
					totalTests++;
					if (test.percentageComplete === 100) {
						testsCompleted++;
					}
				}
			}
		}

		this.progress = Math.round(100 * (testsCompleted / totalTests));

		if (isNaN(this.progress)) {
			this.progress = 0;
		}

		this.commonService.sendNotification(HardwareScanProgress.ScanProgress, this.progress);

		console.log('[End] Update Progress');
	}

	private updateScanResponse(response: any) {
		console.log('[Start] Update Modules');
		const doScanResponse = response.responses;
		console.log('[updateScanResponse] doScanResponse: ', doScanResponse);
		const groupResults = [];

		this.modules.status = true;

		for (const scanResponse of doScanResponse) {
			for (const groupResult of scanResponse.groupResults) {
				groupResults.push(groupResult);
			}
		}

		console.log('[updateScanResponse] groupResults: ', groupResults);
		console.log('[updateScanResponse] this.modules: ', this.modules);

		for (const module of this.modules) {
			const currentGroup = groupResults.find(x => x.id === module.groupId && x.moduleName === module.id);
			module.resultCode = currentGroup.resultCode;
			module.description = currentGroup.resultDescription;
			module.information = currentGroup.resultDescription;
			for (let i = 0; i < module.listTest.length; i++) {
				module.listTest[i].status = currentGroup.testResultList[i].result;
				if (module.listTest[i].status !== HardwareScanTestResult.Pass &&
					module.listTest[i].status !== HardwareScanTestResult.Na) {
					this.modules.status = false;
				}
				module.listTest[i].percent = currentGroup.testResultList[i].percentageComplete;
			}
		}

		console.log('Modules Updated: ', this.modules);
		this.commonService.sendNotification(HardwareScanProgress.ScanResponse, this.modules);
		console.log('[End] Update Modules');
	}

	public filterCustomTests(culture: string) {
		console.log('[Start] Filter custom tests');
		const customModules = this.getCustomScanModules();
		const modules = customModules.filter(i => i.selected || i.indeterminate);
		const modulesSelected = [];

		console.log('[filterCustomTests] customModules: ', customModules);
		console.log('[filterCustomTests] modules: ', modules);

		for (const module of modules) {

			if (!modulesSelected.includes(module.moduleId)) {
				// tests that were chosen by the user
				const testsSelected = module.tests.filter(i => i.selected).map(x => x.test);
				console.log('[filterCustomTests] testsSelected: ', testsSelected);

				// we can have more than one module of the same type (more than one device)
				const modulesRepeated = modules.filter(x => (x.moduleId === module.moduleId) && (x.id !== module.id));
				console.log('[filterCustomTests] modulesRepeated: ', modulesRepeated);

				for (const m of modulesRepeated) {
					for (const test of m.tests) {
						if (test.selected) {
							testsSelected.push(test.test);
						}
					}
				}

				// module already chosen
				modulesSelected.push(module.moduleId);

				// Creating request
				const scanRequest = {
					lang: culture,
					loopCount: 0,
					loopRepeatMinutes: 0,
					testRequestList: testsSelected,
					metaData: undefined,
					moduleId: module.id
				};

				console.log('[testsSelected]: ', testsSelected);
				this.filteredCustomScanRequest.push(scanRequest);

				// Creating response
				const moduleResponse = [];
				const moduleFilter = this.customScanResponse.filter(x => x.id === module.moduleId);
				for (const m of moduleFilter) {
					const obj = JSON.parse(JSON.stringify(m));
					moduleResponse.push(obj);
				}
				console.log('[moduleResponse]: ', moduleResponse);

				for (const m of moduleResponse) {
					let filteredResponseTests = [];
					for (const t of testsSelected) {
						const test = m.listTest.find(x => (x.id === t.id) && (m.groupId === t.groupId));
						if (test) {
							filteredResponseTests.push(test);
						}
					}
					m.listTest = [];
					m.listTest = filteredResponseTests;
					console.log('filteredResponseTests: ', filteredResponseTests);
					filteredResponseTests = [];
				}

				console.log('moduleResponse: ', moduleResponse.filter(x => x.listTest.length !== 0));
				this.filteredCustomScanResponse.push(...moduleResponse.filter(x => x.listTest.length !== 0));
			}
		}

		console.log('[End] Filter custom tests');
	}

	public getLastResults() {
		console.log('[Start]: getPreviousResults() on service');
		if (this.hardwareScanBridge) {
			return this.hardwareScanBridge.getPreviousResults()
				.then((response) => {
					console.log(response);
					this.buildPreviousResults(response);
				});
		}
		console.log('[End]: getPreviousResults() on service');
		return undefined;
	}

	private buildPreviousResults(response: any) {
		const previousResults = {};
		let moduleId = 0;
		let hasFailed = false;
		let hasWarning = false;
		console.log('buildPreviousResults: ', response);
		if (response.hasPreviousResults) {
			this.hasLastResults = response.hasPreviousResults;
			previousResults['finalResultCode'] = response.scanSummary.finalResultCode;
			previousResults['status'] = HardwareScanTestResult[HardwareScanTestResult.Pass];
			previousResults['statusValue'] = HardwareScanTestResult.Pass;
			previousResults['statusToken'] = this.statusToken(HardwareScanTestResult.Pass);

			console.log('date before: ', response.scanSummary.ScanDate);
			const date = response.scanSummary.ScanDate.toString().replace(/-/g, '/').split('T');
			console.log('date: ', date);
			previousResults['date'] = date[0] + ' ' + date[1].slice(0, 8);

			previousResults['information'] = response.scanSummary.finalResultCodeDescription;
			previousResults['items'] = [];

			for (const module of response.modulesResults) {
				const groupResult = module.response.groupResults;
				const groupsResultMeta = module.categoryInformation.groupList;

				for (let i = 0; i < module.response.groupResults.length; i++) {
					const item = {};
					const groupResultMeta = groupsResultMeta.find(x => x.id === groupResult[i].id);

					item['id'] = moduleId;
					item['module'] = module.categoryInformation.name;
					item['name'] = groupResultMeta.name;
					item['resultCode'] = groupResult[i].resultCode;
					item['information'] = groupResult[i].resultDescription;
					item['collapsed'] = false;
					item['details'] = [];

					for (let j = 0; j < groupResultMeta.metaInformation.length; j++) {
						const meta = groupResultMeta.metaInformation[j];
						const detail = {};
						detail[meta.name] = meta.value;
						item['details'].push(detail);
					}

					item['listTest'] = [];
					const test = groupResult[i].testResultList;
					console.log('test: ', test);
					const testMeta = groupResultMeta.testList;

					for (let j = 0; j < groupResult[i].testResultList.length; j++) {
						const testInfo = {};
						testInfo['id'] = test[j].id;
						testInfo['name'] = testMeta.find(x => x.id === test[j].id).name;
						testInfo['information'] = testMeta.find(x => x.id === test[j].id).description;
						testInfo['status'] = test[j].result;
						testInfo['statusToken'] = this.statusToken(test[j].result);

						if (testInfo['status'] === HardwareScanTestResult.NotStarted ||
							testInfo['status'] === HardwareScanTestResult.InProgress) {
							testInfo['status'] = HardwareScanOverallResult.Cancelled;
							testInfo['statusToken'] = this.statusToken(HardwareScanOverallResult.Cancelled);
						}

						if ((test[j].result === HardwareScanTestResult.Cancelled ||
							test[j].result === HardwareScanTestResult.NotStarted) && !hasFailed && !hasWarning) {
							previousResults['status'] = HardwareScanTestResult[HardwareScanTestResult.Cancelled];
							previousResults['statusValue'] = HardwareScanTestResult.Cancelled;
							previousResults['statusToken'] = this.statusToken(HardwareScanTestResult.Cancelled);
						} else if (test[j].result === HardwareScanTestResult.Fail) {
							previousResults['status'] = HardwareScanTestResult[HardwareScanTestResult.Fail];
							previousResults['statusValue'] = HardwareScanTestResult.Fail;
							previousResults['statusToken'] = this.statusToken(HardwareScanTestResult.Fail);
							hasFailed = true;
						} else if (test[j].result === HardwareScanTestResult.Warning && !hasFailed) {
							previousResults['status'] = HardwareScanTestResult[HardwareScanTestResult.Warning];
							previousResults['statusValue'] = HardwareScanTestResult.Warning;
							previousResults['statusToken'] = this.statusToken(HardwareScanTestResult.Warning);
							hasWarning = true;
						}
						item['listTest'].push(testInfo);
					}

					previousResults['items'].push(item);
				}

				moduleId++;
			}
			this.previousResults = previousResults;
			this.buildPreviousResultsWidget(this.previousResults);
		}
	}

	private buildPreviousResultsWidget(previousResults: any) {
		const previousItems = {};
		previousItems['date'] = previousResults.date;
		previousItems['modules'] = [];
		for (const item of previousResults.items) {
			const module = {};
			module['name'] = item.module;
			module['subname'] = item.name;
			module['result'] = HardwareScanTestResult[HardwareScanTestResult.Pass];
			module['resultIcon'] = HardwareScanTestResult.Pass;
			module['statusToken'] = this.statusToken(HardwareScanTestResult.Pass);

			for (const test of item.listTest) {
				if ((test.status === HardwareScanTestResult.Cancelled ||
					test.status === HardwareScanTestResult.NotStarted) &&
					module['result'] !== HardwareScanTestResult[HardwareScanTestResult.Warning]) {
					module['result'] = HardwareScanTestResult[HardwareScanTestResult.Cancelled];
					module['resultIcon'] = HardwareScanTestResult.Cancelled;
					module['statusToken'] = this.statusToken(HardwareScanTestResult.Cancelled);
				} else if (test.status === HardwareScanTestResult.Fail) {
					module['result'] = HardwareScanTestResult[HardwareScanTestResult.Fail];
					module['resultIcon'] = HardwareScanTestResult.Fail;
					module['statusToken'] = this.statusToken(HardwareScanTestResult.Fail);
					break;
				} else if (test.status === HardwareScanTestResult.Warning) {
					module['result'] = HardwareScanTestResult[HardwareScanTestResult.Warning];
					module['resultIcon'] = HardwareScanTestResult.Warning;
					module['statusToken'] = this.statusToken(HardwareScanTestResult.Warning);
				}
			}
			previousItems['modules'].push(module);
		}
		this.previousItemsWidget = previousItems;
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

	public cleanResponses() {
		for (const moduleObject of this.quickScanResponse) {
			for (const test of moduleObject.listTest) {
				test.percent = 0;
				test.status = HardwareScanTestResult.NotStarted;
			}
		}

		for (const moduleObject of this.customScanResponse) {
			for (const test of moduleObject.listTest) {
				test.percent = 0;
				test.status = HardwareScanTestResult.NotStarted;
			}
		}
	}

	public cleanUp() {
		this.filteredCustomScanRequest = [];
		this.filteredCustomScanResponse = [];
		this.cleanSelectedCustomTests();
		console.log('[CLEAN] ', this.customScanModules);
	}

	public cleanCustomTests() {
		this.filteredCustomScanRequest = [];
		this.filteredCustomScanResponse = [];
	}
}
