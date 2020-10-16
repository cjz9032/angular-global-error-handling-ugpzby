import { Injectable, NgZone, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { PreviousResultService } from 'src/app/modules/hardware-scan/services/previous-result.service';
import { HardwareScanResultService } from 'src/app/modules/hardware-scan/services/hardware-scan-result.service';
import { CommonService } from 'src/app/services/common/common.service';
import { Subject, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { TaskType, TaskStep, HardwareScanTestResult, HardwareScanFinishedHeaderType, HardwareScanProgress } from 'src/app/modules/hardware-scan/enums/hardware-scan.enum';
import { HypothesisService } from 'src/app/services/hypothesis/hypothesis.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { LoggerService } from '../../../services/logger/logger.service';
import { LocalCacheService } from '../../../services/local-cache/local-cache.service';
import { SessionStorageKey } from 'src/app/enums/session-storage-key-enum';

@Injectable({
	providedIn: 'root'
})
export class HardwareScanService {

	constructor(
		shellService: VantageShellService, private commonService: CommonService, private ngZone: NgZone,
		private translate: TranslateService, private hypSettings: HypothesisService,
		private hardwareScanResultService: HardwareScanResultService,
		private previousResultService: PreviousResultService,
		private localCacheService: LocalCacheService,
		private logger: LoggerService) {
		this.hardwareScanBridge = shellService.getHardwareScan();

		// Starts all priority requests as soon as possible when this service starts.
		this.doPriorityRequests();
	}

	// This name must be the same used in the Hypothesis config file (HypothesisGroup.xml).
	private static readonly HARDWARE_SCAN_HYPOTHESIS_CONFIG_NAME: string = 'HardwareScan';

	private hardwareScanBridge: any;
	private modulesRetrieved: any; // modules retrieve from get items [object from ItemToScanResponse]
	private isLoadingModulesDone = false;
	private isScanDone = false;
	private scanExecution = false;
	private hasItemsToRecoverBadSectors = false;
	private devicesToRecoverBadSectors;
	private progress = 0;
	private modules: any; // modules displayed on screen
	private devices: any[];
	private recoverExecution = false;
	private recoverInit = false;
	private deviceInRecover: string;
	private hasDevicesToRecover = false;
	private scanOrRBSFinished = false;
	private scanHeaderTypeFinished: HardwareScanFinishedHeaderType;
	private isDesktopMachine = false;

	private quickScanRequest: any = []; // request modules
	private quickScanResponse: any = []; // response modules
	private customScanRequest: any = []; // request modules
	private customScanResponse: any = []; // response modules
	private customScanModules: any = []; // modules to display on custom modal
	private categoryInformationList: any = []; // List of categoryInformation
	private filteredCustomScanRequest = [];
	private filteredCustomScanResponse = [];
	private cancelRequested: boolean;
	private disableCancel = false;
	private finalResponse: any;
	private enableViewResults = false;
	private lastResponse: any;
	private workDone = new Subject<boolean>();
	private culture: any;
	private itemsToScanResponse: any = undefined;
	private ALL_MODULES = 2;
	private refreshingModules = false;
	private showComponentList = false;
	private hardwareModulesLoaded = new Subject<boolean>();
	private hypSettingsPromise: any = undefined;
	private pluginVersion: string;
	private executingModule: string;
	private lastTaskType: TaskType;
	private lastFilteredCustomScanRequest = [];
	private lastFilteredCustomScanResponse = [];

	// Used to store information related to metrics
	private currentTaskType: TaskType;
	private currentTaskStep: TaskStep;

	public startRecover: EventEmitter<any> = new EventEmitter();

	private completedStatus: boolean | undefined = undefined;
	private scanResult: string;

	private iconByModule = {
		cpu: 'icon_hardware_processor.svg',
		memory: 'icon_hardware_memory.svg',
		motherboard: 'icon_hardware_motherboard.svg',
		pci_express: 'icon_hardware_pci-desktop.svg',
		wireless: 'icon_hardware_wireless.svg',
		storage: 'icon_hardware_hdd.svg'
	};

	// Temporary workarounds for BSOD issue (VAN-21285)
	private blackListModules = [
		'motherboard',
		'pci_express',
	];
	private blackListTests = [
		'TEST_LINEAR_READ_TEST',
		'TEST_CONTROLLER_STATUS_TEST'
	];

	/**
	 * This method sends the requests of all information which should be available
	 * when Hardware Scan starts.
	 * [NOTICE] You mustn't send more than one request which uses the CLI here, since it doesn't handle
	 *          concurrent requests.
	 */
	private doPriorityRequests() {
		// Check whether HardwareScan is available in Hypothesis Service or not
		if (this.hypSettingsPromise === undefined) {
			this.hypSettingsPromise = this.hypSettings.getFeatureSetting(HardwareScanService.HARDWARE_SCAN_HYPOTHESIS_CONFIG_NAME);

			// If HardwareScan is available, dispatch the priority requests
			this.isAvailable().then(async (available) => {
				if (available) {
					// Validate the type of this machine to load dynamically the icons.
					this.isDesktopMachine = this.localCacheService.getLocalCacheValue(LocalStorageKey.DesktopMachine);

					// Retrieve the Plugin's version (it does not use the CLI)
					this.getPluginInfo().then((hwscanPluginInfo: any) => {
						if (hwscanPluginInfo) {
							this.pluginVersion = hwscanPluginInfo.PluginVersion;
						}
					});

					// Retrieve an updated the last Scan's results (it does not use the CLI)
					this.previousResultService.updatePreviousResultsResponse();

					// Retrieve the hardware component list (it does use the CLI)
					this.culture = window.navigator.languages[0];
					this.reloadItemsToScan(false);
				}
			});
		}
	}

	public reloadItemsToScan(refreshing: boolean) {
		this.hardwareModulesLoaded.next(false);
		this.itemsToScanResponse = this.getItemsToScan(this.ALL_MODULES, this.culture);
		this.refreshingModules = refreshing;
		this.showComponentList = refreshing;
	}

	public isScanOrRBSExecuting() {
		return this.isScanExecuting() || this.isRecoverExecuting()
	}

	public isScanOrRBSFinished() {
		return this.scanOrRBSFinished;
	}

	public getScanFinishedHeaderType() {
		return this.scanHeaderTypeFinished;
	}

	public getCulture() {
		return this.culture;
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

	public getIsDesktopMachine() {
		return this.isDesktopMachine;
	}

	public setScanOrRBSFinished(value: boolean) {
		this.scanOrRBSFinished = value;
	}

	public setScanFinishedHeaderType(value: any) {
		this.scanHeaderTypeFinished = value;
	}

	public getDevicesRecover() {
		return this.devices;
	}

	public setDevicesRecover(items: any[]) {
		this.devices = items;
	}

	public getHasDevicesToRecover() {
		return this.hasDevicesToRecover;
	}

	public isScanExecuting() {
		return this.scanExecution;
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

	public isRecoverInit() {
		return this.recoverInit;
	}

	public setRecoverInit(status: boolean) {
		this.recoverInit = status;
	}

	public getDeviceInRecover() {
		return this.deviceInRecover;
	}

	public setDeviceInRecover(value: string) {
		this.deviceInRecover = value;
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

	public deleteScan(payload) {
		if (this.hardwareScanBridge) {
			return this.hardwareScanBridge.deleteScan(payload)
				.then((response) => {
					return response;
				});
		}
		return undefined;
	}

	public editScheduledScan(payload) {
		if (this.hardwareScanBridge) {
			return this.hardwareScanBridge.editScan(payload)
				.then((response) => {
					return response;
				});
		}
		return undefined;
	}

	public getNextScans() {
		if (this.hardwareScanBridge) {
			return this.hardwareScanBridge.getNextScans()
				.then((response) => {
					return response;
				});
		}

		return undefined;
	}

	public getScheduleScan(payload) {
		if (this.hardwareScanBridge) {
			return this.hardwareScanBridge.getScheduleScan(payload)
				.then((response) => {
					return response;
				});
		}
		return undefined;
	}

	public getPluginInfo() {
		if (this.hardwareScanBridge) {
			return this.hardwareScanBridge.getPluginInformation()
				.then((response) => {
					return response;
				});
		}
		return undefined;
	}

	public isAvailable() {
		return this.hypSettingsPromise
			.then((result: any) => {
				const isMachineAvailable = this.isMachineAvailable();
				return (((result || '').toString() === 'true') && isMachineAvailable);
			})
			.catch((error) => {
				return false;
			});
	}

	/**
	 * This method validate if the machine family name is in the blacklist
	 * If yes, the HWScan menu not appear.
	 */
	public isMachineAvailable() {

		// Variable containing machine names without HWScan enabled
		const blackList = ['thinkstationp520', 'thinkstationp520c', 'thinkstationp720', 'thinkstationp920'];

		// Variable containing machine family name in the specific format
		const originalMachineFamilyName = this.localCacheService.getLocalCacheValue(LocalStorageKey.MachineFamilyName);
		const machineFamily = originalMachineFamilyName
			.replace(/ /g, '')
			.toString()
			.toLowerCase();

		return blackList.find(element => machineFamily.includes(element)) === undefined;
	}

	public isPluginCompatible(requiredVersion: string) {
		return this.compareVersion(requiredVersion, this.pluginVersion) <= 0;
	}

	// This is version compare function which takes version numbers of any length and any number size per segment.
	// Return values:
	// - negative number if v1 < v2
	// - positive number if v1 > v2
	// - zero if v1 = v2
	private compareVersion(v1: string, v2: string) {
		const regExStrip0 = '/(\.0+)+$/';
		const segmentsA = v1.replace(regExStrip0, '').split('.');
		const segmentsB = v2.replace(regExStrip0, '').split('.');
		const min = Math.min(segmentsA.length, segmentsB.length);
		for (let i = 0; i < min; i++) {
			const diff = parseInt(segmentsA[i], 10) - parseInt(segmentsB[i], 10);
			if (diff) {
				return diff;
			}
		}
		return segmentsA.length - segmentsB.length;
	}

	// Filters the response from GetItemsToScan according to blacklist of modules and tests
	// This is replicated from Plugin, for cases that a user's Plugin isn't up to date
	private filterItemsResponse(response: any) {
		response.categoryList = response.categoryList.filter((value) => !this.blackListModules.includes(value.id));
		response.mapContractNameList = response.mapContractNameList.filter((value) => !this.blackListModules.includes(value.Key));

		const storageComponents = response.categoryList.filter((value) => value.id === 'storage');
		if (storageComponents !== undefined) {
			storageComponents.forEach(component => {
				component.groupList.forEach(group => {
					group.testList = group.testList.filter((t) => this.blackListTests.filter((bl) => t.id.includes(bl)).length === 0);
				});
			});
		}
	}

	public getItemsToScan(scanType: number, culture: string) {
		if (this.hardwareScanBridge) {
			return this.hardwareScanBridge.getItemsToScan(scanType, culture)
				.then((response) => {
					this.filterItemsResponse(response);
					return response;
				})
				.catch((error) => {
					this.logger.error('[GET ITEMS TO SCAN] ' + error);
				});
		} else {
			this.logger.error('[GET ITEMS TO SCAN] Hardware Scan Bridge not available');
		}
		return undefined;
	}

	public getPreScanInfo(payload) {
		if (this.hardwareScanBridge) {
			return this.hardwareScanBridge.getPreScanInformation(payload)
				.then((response) => {
					return response;
				});
		}
		return undefined;
	}

	public getDoScan(payload, modules, cancelHandler) {
		if (this.hardwareScanBridge) {
			this.cancelRequested = false;
			this.modules = modules;
			this.executingModule = modules[0].module;
			this.hardwareScanResultService.clearFailedTests();
			this.scanExecution = true;
			this.disableCancel = true;
			this.workDone.next(false);
			this.setScanOrRBSFinished(false);
			this.setScanFinishedHeaderType(HardwareScanFinishedHeaderType.None);
			this.clearLastResponse();
			this.completedStatus = undefined;

			// As user has started either a Quick or Custom Scan, it means that the actual
			// hardware component list is already been retrieved, so let's show it in the
			// next times the Main page is shown.
			this.showComponentList = true;

			return this.hardwareScanBridge.getDoScan(payload, (response: any) => {
				// Keeping track of the latest response allows the right render when user
				// navigates to another page and then come back to the Hardware Scan page
				this.lastResponse = response;
				this.updateProgress(response);
				this.updateScanResponse(response);
				this.disableCancel = false;
			}, cancelHandler)
				.then((response) => {
					if (response !== null && response.finalResultCode !== null) {
						this.commonService.setSessionStorageValue(SessionStorageKey.HwScanHasExportLogData, true);
						this.executingModule = undefined;
						this.lastResponse = response;
						return response;
					} else {
						throw new Error('Scan incomplete!');
					}
				}).catch((ex: any) => {
					if (ex !== null) {
						this.cancelRequested = true;
					}
					throw ex;
				}).finally(() => {
					this.setIsScanDone(true);
					this.cleanUp();

					if (this.cancelRequested === true) {
						this.scanExecution = false;
					}

					this.workDone.next(true);
					this.setScanOrRBSFinished(true);
					this.setScanFinishedHeaderType(HardwareScanFinishedHeaderType.Scan);

					// Retrieve an updated version of Scan's last results
					this.previousResultService.updatePreviousResultsResponse();

					// Scan is finished, so we'll show its result instead of the running state
					this.clearLastResponse();
				});
		}
		return undefined;
	}

	public hasLastResponse() {
		return this.lastResponse !== undefined;
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
			this.lastResponse.devices[0].numberOfSectors !== undefined;

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
		return this.workDone.pipe(first());
	}

	public cancelScanExecution() {
		if (this.hardwareScanBridge) {
			return this.hardwareScanBridge.cancelScan((response: any) => { })
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

	public getRecoverBadSectors(payload) {
		this.disableCancel = true;
		if (this.hardwareScanBridge) {
			this.clearLastResponse();
			this.cancelRequested = false;
			this.setScanOrRBSFinished(false);
			this.setScanFinishedHeaderType(HardwareScanFinishedHeaderType.None);
			this.workDone.next(false);
			this.completedStatus = undefined;

			return this.hardwareScanBridge.getRecoverBadSectors(payload, (response: any) => {
				// Keeping track of the latest response allows the right render when user
				// navigates to another page and then come back to the Hardware Scan page
				this.lastResponse = response;
				this.updateRecover(response);
				this.updateProgressRecover(response);
				this.disableCancel = false;
			}).then((response) => {
				for (let i = 0; i < this.devices.length; i++) {
					if (Number(response.devices[i].numberOfNonFixedSectors) > 0) {
						response.devices[i].status = HardwareScanTestResult.Attention;
					}
				}

				// Keeping track of the latest response allows the right render when user
				// navigates to another page and then come back to the Hardware Scan page
				this.lastResponse = response;
				this.updateRecover(response);
				this.updateProgressRecover(response);
				return response;
			}).finally(() => {
				this.setIsScanDone(true);
				this.cleanUp();
				this.workDone.next(true);
				this.setScanOrRBSFinished(true);
				this.setScanFinishedHeaderType(HardwareScanFinishedHeaderType.RecoverBadSectors);

				// RBS is finished, so we'll show its result instead of the running state
				this.clearLastResponse();
			});
		}
	}

	public updateRecover(response: any) {
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

			if (response.devices[i].status === HardwareScanTestResult.InProgress && response.devices[i].name) {
				this.setDeviceInRecover(response.devices[i].name);
			}
		}

		const payload = {
			devices: this.devices,
			deviceInRecover: this.deviceInRecover,
			status: statusRecover
		};

		this.completedStatus = statusRecover;
		this.commonService.sendNotification(HardwareScanProgress.RecoverResponse, payload);
	}

	public updateProgressRecover(response: any) {
		let totalPercent = 0;

		for (let i = 0; i < this.devices.length; i++) {
			totalPercent += response.devices[i].percentageComplete;
		}

		this.progress = Math.floor(totalPercent / this.devices.length);

		if (isNaN(this.progress)) {
			this.progress = 0;
		}

		this.commonService.sendNotification(HardwareScanProgress.RecoverProgress, this.progress);
	}

	public getItemsToRecoverBadSectors() {
		if (this.hardwareScanBridge) {
			return this.hardwareScanBridge.getItemsToRecoverBadSectors()
				.then((response) => {
					if (response) {
						return response;
					} else { }
				});
		}
	}

	public async initLoadingModules(culture) {
		this.hasItemsToRecoverBadSectors = false;

		this.getAllItems(culture)
			.then(() => {
				this.isLoadingModulesDone = true;
				this.loadCustomModal();
				return this.getItemsToRecoverBadSectors();
			})
			.then((response) => {
				if (response && response.categoryList && response.categoryList.length > 0) {
					this.devicesToRecoverBadSectors = response.categoryList[0];
					if (this.devicesToRecoverBadSectors.groupList.length !== 0) {
						this.hasItemsToRecoverBadSectors = true;
					}
				} else {
					this.logger.error('[INIT LOADING MODULES] Incorrect response received', response);
				}
			})
			.catch((error) => {
				this.logger.error('[INIT LOADING MODULES] ' + error);
			})
			.finally(() => {
				// Signalizes that the hardware list has been retrieved
				this.hardwareModulesLoaded.next(true);
				this.refreshingModules = false;
			});
	}

	private async getAllItems(culture) {
		if (this.hardwareScanBridge) {
			await this.itemsToScanResponse
				.then((response) => {
					if (response) {
						this.modulesRetrieved = response;
						this.categoryInformationList = this.modulesRetrieved.categoryList;

						this.customScanRequest = this.buildScanRequest(this.modulesRetrieved, culture);
						this.quickScanRequest = this.filterQuickRequest(this.customScanRequest);

						this.customScanResponse = this.buildScanResponse(this.modulesRetrieved);
						this.quickScanResponse = this.filterQuickResponse(this.customScanResponse);
					} else {
						this.logger.error('[GET ALL ITEMS] Incorrect response received');
					}
				})
				.catch((error) => {
					this.logger.error('[GET ALL ITEMS] ' + error);
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

	private cleanSelectedCustomTests() {
		for (const customScanModulesItem of this.customScanModules) {
			customScanModulesItem.selected = false;
			customScanModulesItem.indeterminate = false;
			customScanModulesItem.collapsed = false;
			for (const customScanModulesTestItem of customScanModulesItem.tests) {
				customScanModulesTestItem.selected = false;
			}
		}
	}

	private loadCustomModal() {
		this.customScanModules = [];
		let modalModuleId = 0;

		for (const customScanResponseItem of this.customScanResponse) {
			const module = {
				id: modalModuleId,
				moduleId: customScanResponseItem.id,
				name: customScanResponseItem.module,
				subname: customScanResponseItem.name,
				selected: false,
				collapsed: false,
				indeterminate: false,
				tests: []
			};

			for (const customScanResponseTestItem of customScanResponseItem.listTest) {
				const test = {
					id: customScanResponseTestItem.id,
					test: undefined,
					name: customScanResponseTestItem.name,
					selected: false,
				};

				const currentModule = this.customScanRequest.find(x => x.moduleId === module.moduleId);

				const groupId = customScanResponseItem.groupId;
				test.test = currentModule.testRequestList.find(x => x.id === test.id && x.groupId === groupId);

				module.tests.push(test);
			}

			modalModuleId++;
			this.customScanModules.push(module);
		}
	}

	private buildScanRequest(modulesRetrieved: any, culture: string) {
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
					testRequestList,
					metaData: undefined,
					moduleId: categoryInfo.id,
				});
				testRequestList = [];
			}
		}
		return scanRequests;
	}

	private buildScanResponse(modulesRetrieved: any) {
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
						icon: '',
						metaInformation: [],
						listTest: [],
						expanded: false,
						expandedStatusChangedByUser: false,
						detailsExpanded: false
					};

					item.module = categoryInfo.name;
					item.id = categoryInfo.id;
					item.groupId = group.id;
					item.listTest = [];
					item.name = group.name;
					item.icon = item.id;
					if (!this.isDesktopMachine) {
						if (item.icon === 'pci_express') {
							item.icon += '_laptop';
						}
					}
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

		return moduleList;
	}

	private updateProgress(response: any) {
		let totalTests = 0;
		let testsCompleted = 0;

		this.hardwareScanResultService.clearFailedTests();
		for (const scanResp of response.responses) {
			for (const group of scanResp.groupResults) {
				for (const test of group.testResultList) {
					totalTests++;
					if (test.percentageComplete === 100) {
						testsCompleted++;
					}
				}

				// Calculate Failed Tests
				this.hardwareScanResultService.countFailedTests(group.testResultList);
			}
		}

		this.progress = Math.round(100 * (testsCompleted / totalTests));

		if (isNaN(this.progress)) {
			this.progress = 0;
		}

		this.commonService.sendNotification(HardwareScanProgress.ScanProgress, this.progress);
	}

	private updateScanResponse(response: any) {
		const doScanResponse = response.responses;
		const groupResults = [];

		this.modules.status = true;

		for (const scanResponse of doScanResponse) {
			for (const groupResult of scanResponse.groupResults) {
				groupResults.push(groupResult);
			}
		}

		this.executingModule = this.getCurrentModule();
		// Finds the first model without result code
		const currentModuleToExpand =
			this.modules.find(module => !module.resultCode);

		// Validates if currentModuleToExpand returns a value doesn't modify by user
		// and expand it to show the current test in execution
		if (!currentModuleToExpand.expandedStatusChangedByUser) {
			currentModuleToExpand.expanded = true;
		}

		// Finds the first module with result code and the user doesn't modify the expanded status.
		const currentModuleToCollapse =
			this.modules.find(module => !module.expandedStatusChangedByUser && module.expanded && module.resultCode);

		// Validates if currentModuleToCollapse returns a valid value and
		// collapse the test list of this module
		if (currentModuleToCollapse) {
			currentModuleToCollapse.expanded = false;
		}

		for (const module of this.modules) {
			const currentGroup = groupResults.find(x => x.id === module.groupId && x.moduleName === module.id);
			module.resultCode = currentGroup.resultCode;
			module.description = currentGroup.resultDescription;
			module.information = currentGroup.resultDescription;
			for (let i = 0; i < module.listTest.length; i++) {
				module.listTest[i].statusTest = currentGroup.testResultList[i].result;
				if (module.listTest[i].statusTest !== HardwareScanTestResult.Pass &&
					module.listTest[i].statusTest !== HardwareScanTestResult.Na) {
					this.modules.status = false;
				}
				module.listTest[i].percent = currentGroup.testResultList[i].percentageComplete;
			}
			module.resultModule = this.hardwareScanResultService.consolidateResults(module.listTest.map(item => item.statusTest));
		}

		this.completedStatus = this.modules.status;
		this.scanResult = HardwareScanTestResult[this.hardwareScanResultService.consolidateResults(this.modules.map(module => module.resultModule))];
		this.commonService.sendNotification(HardwareScanProgress.ScanResponse, this.modules);
	}

	public filterCustomTests(culture: string) {
		const customModules = this.getCustomScanModules();
		const modules = customModules.filter(i => i.selected || i.indeterminate);
		const modulesSelected = [];
		this.filteredCustomScanRequest = [];
		this.filteredCustomScanResponse = [];

		for (const module of modules) {

			if (!modulesSelected.includes(module.moduleId)) {
				// tests that were chosen by the user
				const testsSelected = module.tests.filter(i => i.selected).map(x => x.test);

				// we can have more than one module of the same type (more than one device)
				const modulesRepeated = modules.filter(x => (x.moduleId === module.moduleId) && (x.id !== module.id));

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

				this.filteredCustomScanRequest.push(scanRequest);

				// Creating response
				const moduleResponse = [];
				const moduleFilter = this.customScanResponse.filter(x => x.id === module.moduleId);
				for (const m of moduleFilter) {
					const obj = JSON.parse(JSON.stringify(m));
					moduleResponse.push(obj);
				}

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
					filteredResponseTests = [];
				}

				this.filteredCustomScanResponse.push(...moduleResponse.filter(x => x.listTest.length !== 0));
			}
		}
	}

	public getStatus() {
		return new Promise((resolve, reject) => {
			if (!this.isPluginCompatible('1.0.42')) {
				reject('GetStatus is not implemented on plugin ' + this.pluginVersion);
			}

			if (this.hardwareScanBridge) {
				return this.hardwareScanBridge.getStatus()
					.then((response) => {
						if (response) {
							resolve(response);
						} else {
							reject('[GET STATUS] getStatus returned empty response');
						}
					})
					.catch((error) => {
						reject('[GET STATUS] ' + error);
					});
			} else {
				reject('Invalid hardwareScanBridge');
			}
		});
	}

	public cleanResponses() {
		for (const moduleObject of this.quickScanResponse) {
			for (const test of moduleObject.listTest) {
				test.percent = 0;
				test.statusTest = '';
				test.status = HardwareScanTestResult.NotStarted;
			}
			moduleObject.resultCode = '';
			moduleObject.resultModule = '';
		}

		for (const moduleObject of this.customScanResponse) {
			for (const test of moduleObject.listTest) {
				test.percent = 0;
				test.statusTest = '';
				test.status = HardwareScanTestResult.NotStarted;
			}
			moduleObject.resultCode = '';
			moduleObject.resultModule = '';
		}
	}

	public cleanUp() {
		this.filteredCustomScanRequest = [];
		this.filteredCustomScanResponse = [];
		this.cleanSelectedCustomTests();
	}

	public cleanCustomTests() {
		this.filteredCustomScanRequest = [];
		this.filteredCustomScanResponse = [];
	}

	public getHardwareComponentIcon(moduleName: string) {
		const iconsBasePath = 'assets/icons/hardware-scan/';

		if (moduleName in this.iconByModule) {
			return iconsBasePath + this.iconByModule[moduleName];
		}

		return undefined;
	}

	/**
	 * This method is responsible for provide the default hardware component list
	 * which will be displayed in the Hardware Scan's home page until the real
	 * one is retrieved through either a Quick/Custom Scan or refreshing modules.
	 */
	public getInitialHardwareComponentList() {
		const result = [];

		for (const module of Object.keys(this.iconByModule)) {
			if (!this.blackListModules.includes(module)) {
				let moduleType = module;
				if (!this.isDesktopMachine) {
					if (module === 'pci_express') {
						moduleType = module + '_laptop';
					}
				}
				result.push({
					module: module.toUpperCase(),
					name: '',
					icon: moduleType
				});
			}
		}

		return result;
	}

	public isRefreshingModules() {
		return this.refreshingModules;
	}

	public isShowComponentList() {
		return this.showComponentList;
	}

	/**
	 * This can be observed to know when the hardware component list is retrieved
	 */
	public isHardwareModulesLoaded(): Observable<boolean> {
		return this.hardwareModulesLoaded.pipe(first());
	}

	public getCurrentTaskType() {
		return this.currentTaskType;
	}

	public setCurrentTaskType(taskType: TaskType) {
		this.currentTaskType = taskType;
	}

	public getCurrentTaskStep() {
		return this.currentTaskStep;
	}

	public setCurrentTaskStep(taskStep: TaskStep) {
		this.currentTaskStep = taskStep;
	}

	public getPluginVersion(): string {
		return this.pluginVersion;
	}

	public getCompletedStatus(): boolean | undefined {
		return this.completedStatus;
	}

	public getScanResult(): string | undefined {
		return this.scanResult;
	}

	public getExecutingModule() {
		return this.executingModule;
	}

	public getLastTaskType() {
		return this.lastTaskType;
	}

	public setLastTaskType(taskType: TaskType) {
		this.lastTaskType = taskType;
	}

	public getLastFilteredCustomScanRequest() {
		return this.lastFilteredCustomScanRequest;
	}

	public setLastFilteredCustomScanRequest(lastFilteredCustomScanRequest) {
		this.lastFilteredCustomScanRequest = JSON.parse(JSON.stringify(lastFilteredCustomScanRequest));
	}

	public getLastFilteredCustomScanResponse() {
		return this.lastFilteredCustomScanResponse;
	}

	public setLastFilteredCustomScanResponse(lastFilteredCustomScanResponse) {
		this.lastFilteredCustomScanResponse = JSON.parse(JSON.stringify(lastFilteredCustomScanResponse));
	}

	public getCurrentModule(): string {
		for (const module of this.modules) {
			if (module.resultCode == null) {
				return module.module;
			}
		}
	}
}
