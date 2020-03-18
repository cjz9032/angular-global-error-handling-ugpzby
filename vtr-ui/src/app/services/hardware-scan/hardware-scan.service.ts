import { Injectable, NgZone } from '@angular/core';
import { HardwareScanProgress } from 'src/app/enums/hw-scan-progress.enum';
import { HardwareScanTestResult } from 'src/app/enums/hardware-scan-test-result.enum';
import { HardwareScanOverallResult } from 'src/app/enums/hardware-scan-overall-result.enum';
import { TranslateService } from '@ngx-translate/core';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { CommonService } from 'src/app/services/common/common.service';
import { Subject, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { TaskType, TaskStep } from 'src/app/enums/hardware-scan-metrics.enum';
import { HypothesisService } from 'src/app/services/hypothesis/hypothesis.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';

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
	private scanOrRBSFinished = false;

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
	private culture: any;
	private itemsToScanResponse: any = undefined;
	private ALL_MODULES = 2;
	private refreshingModules: boolean = false;
	private showComponentList: boolean = false;
	private previousResultsResponse: any = undefined;
	private hardwareModulesLoaded = new Subject<boolean>();
	private hypSettingsPromise: any = undefined;
	private pluginVersion: string;
	private isDesktopMachine: boolean = false;

	// Used to store information related to metrics
	private currentTaskType: TaskType;
	private currentTaskStep: TaskStep;

	private iconByModule = {
		'cpu': 'icon_hardware_processor.svg',
		'memory': 'icon_hardware_memory.svg',
		'motherboard': 'icon_hardware_motherboard.svg',
		'pci_express': 'icon_hardware_pci-desktop.svg',
		'wireless': 'icon_hardware_wireless.svg',
		'storage': 'icon_hardware_hdd.svg'
	};

	// This name must be the same used in the Hyphothesis config file (HyphotesisGroup.xml).
	private static readonly HARDWARE_SCAN_HYPHOTESIS_CONFIG_NAME: string = 'HardwareScan';

	constructor(shellService: VantageShellService, private commonService: CommonService, private ngZone: NgZone,
				private translate: TranslateService, private hypSettings: HypothesisService) {
		this.hardwareScanBridge = shellService.getHardwareScan();

		// Starts all priority requests as soon as possible when this service starts.
		this.doPriorityRequests();
	}

	/**
	 * This method sends the requests of all information which should be available
	 * when Hardware Scan starts.
	 * [NOTICE] You mustn't send more than one request which uses the CLI here, since it doesn't handle
	 *          concurrent requests.
	 */
	private doPriorityRequests() {
		// Check whether HardwareScan is available in Hypothesis Service or not
		if (this.hypSettingsPromise == undefined) {
            this.hypSettingsPromise = this.hypSettings.getFeatureSetting(HardwareScanService.HARDWARE_SCAN_HYPHOTESIS_CONFIG_NAME);

            // If HardwareScan is available, dispatch the priority requests
            this.isAvailable().then((available) => {
                if (available) {
					// Validate the type of this machine to load dynamically the icons.
					this.isDesktopMachine = this.commonService.getLocalStorageValue(LocalStorageKey.DesktopMachine);

					// Retrive the Plugin's version (it does not use the CLI)
					this.getPluginInfo().then((hwscanPluginInfo: any) => {
                        if (hwscanPluginInfo) {
                            this.pluginVersion = hwscanPluginInfo.PluginVersion;
                        }
                    });

					// Retrive the last Scan's results (it does not use the CLI)
					this.previousResultsResponse = this.hardwareScanBridge.getPreviousResults();

					// Retrive the hardware component list (it does use the CLI)
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

	public isScanOrRBSFinished() {
		return this.scanOrRBSFinished;
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

	public getViewResultItems() {
		return this.viewResultItems;
	}

	public setScanOrRBSFinished(value: boolean) {
		this.scanOrRBSFinished = value;
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

	public deleteScan(payload) {
        if (this.hardwareScanBridge) {
			return this.hardwareScanBridge.deleteScan(payload)
				.then((response) => {
					if (response) {} else {}
					return response;
				});
		}
        return undefined;
    }

	public editScheduledScan(payload) {
		if (this.hardwareScanBridge) {
			return this.hardwareScanBridge.editScan(payload)
				.then((response) => {
					if (response) {} else {}
					return response;
				});
		}
		return undefined;
	}

	public getNextScans() {
        if (this.hardwareScanBridge) {
			return this.hardwareScanBridge.getNextScans()
				.then((response) => {
					if (response) {} else {}
					return response;
				});
		}

        return undefined;
    }

	public getScheduleScan(payload) {
        if (this.hardwareScanBridge) {
			return this.hardwareScanBridge.getScheduleScan(payload)
				.then((response) => {
					if (response) {} else {}

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
            return (((result || '' ).toString() === 'true') && this.isMachineAvailable());
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

		//Variable containing machine names without HWScan enabled
		const blackList = ["thinkstationp520", "thinkstationp520c", "thinkstationp720", "thinkstationp920"]

		//Variable containing machine family name in the specific format
		const machineFamily = this.commonService
								.getLocalStorageValue(LocalStorageKey.MachineFamilyName)
								.replace(/ /g, "")
								.toString()
								.toLowerCase();

		return blackList.find(element => machineFamily.includes(element)) === undefined;
	}

	private isPluginCompatible(requiredVersion: string) {
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

	public getItemsToScan(scanType: number, culture: string) {
        if (this.hardwareScanBridge) {
			return this.hardwareScanBridge.getItemsToScan(scanType, culture)
				.then((response) => {
                return response;
            });
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
			this.scanExecution = true;
			this.disableCancel = true;
			this.workDone.next(false);
			this.setScanOrRBSFinished(false);
			this.clearLastResponse();

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
					this.lastResponse = response;
                    return response;
                } else {
                    throw new Error('Scan incompleted!');
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

				// Retrieve an updated version of Scan's last results
				this.previousResultsResponse = this.hardwareScanBridge.getPreviousResults();
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
		return this.workDone.pipe(first());
	}

	public cancelScanExecution() {
        if (this.hardwareScanBridge) {
			return this.hardwareScanBridge.cancelScan((response: any) => {})
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
        this.disableCancel = true;
        if (this.hardwareScanBridge) {
			this.clearLastResponse();
			this.cancelRequested = false;
			this.setScanOrRBSFinished(false);
			this.workDone.next(false);
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
						response.devices[i].status = HardwareScanTestResult.Warning;
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

			if (response.devices[i].status === HardwareScanTestResult.InProgress && response.devices[i].deviceName !== '') {
				this.deviceInRecover = response.devices[i].deviceName;
			}
		}

        const payload = {
			devices: this.devices,
			deviceInRecover: this.deviceInRecover,
			status: statusRecover
		};

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
                    } else {}
				});
		}
    }

	public async initLoadingModules(culture) {
		this.hasItemsToRecoverBadSectors = false;
		this.getAllItems(culture).then(() => {
			this.getItemsToRecoverBadSectors().then((response) => {
                this.devicesToRecoverBadSectors = response.categoryList[0];
                if (this.devicesToRecoverBadSectors.groupList.length !== 0) {
					this.hasItemsToRecoverBadSectors = true;
				}

				// Signalizes that the hardware list has been retrieved
				this.hardwareModulesLoaded.next(true);
            });
			this.isLoadingModulesDone = true;
			this.loadCustomModal();
		});
	}

	private async getAllItems(culture) {
		if (this.hardwareScanBridge) {
			await this.itemsToScanResponse
				.then((response) => {
                this.modulesRetrieved = response;
                this.categoryInformationList = this.modulesRetrieved.categoryList;

                this.customScanRequest = this.buildScanRequest(this.modulesRetrieved, culture);
                this.quickScanRequest = this.filterQuickRequest(this.customScanRequest);

                this.customScanResponse = this.buildScanResponse(this.modulesRetrieved);
                this.quickScanResponse = this.filterQuickResponse(this.customScanResponse);

                this.refreshingModules = false;
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
                return response;
            });
		}
	}

	private cleanSelectedCustomTests() {
        for (let i = 0; i < this.customScanModules.length; i++) {
			this.customScanModules[i].selected = false;
			this.customScanModules[i].indeterminate = false;
			this.customScanModules[i].collapsed = false;
			for (let j = 0; j < this.customScanModules[i].tests.length; j++) {
                this.customScanModules[i].tests[j].selected = false;
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
						listTest: []
					};

					item.module = categoryInfo.name;
					item.id = categoryInfo.id;
					item.groupId = group.id;
					item.listTest = [];
					item.name = group.name;
					item.icon = item.id;
					if (!this.isDesktopMachine) {
						if (item.icon === 'pci_express') {
							item.icon += "_laptop";
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

	private updateCustomScanRequest(quickScanRequest: any) {
        if (quickScanRequest !== undefined) {
			for (let i = 0; i < quickScanRequest.length; i++) {
				const testListReverse = quickScanRequest[i].testRequestList.reverse();
				for (const test of testListReverse) {
					this.customScanRequest[i].testRequestList.unshift(test);
				}
			}
		}
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

	public getLastResults() {
        if (this.hardwareScanBridge) {
			return this.previousResultsResponse
				.then((response) => {
                this.buildPreviousResults(response);
            });
		}
        return undefined;
    }

	private buildPreviousResults(response: any) {
        const previousResults: any = {};
        let moduleId = 0;
        let hasFailed = false;
        let hasWarning = false;
        if (response.hasPreviousResults) {
            this.hasLastResults = response.hasPreviousResults;
            previousResults.finalResultCode = response.scanSummary.finalResultCode;
            previousResults.status = HardwareScanTestResult[HardwareScanTestResult.Pass];
            previousResults.statusValue = HardwareScanTestResult.Pass;
            previousResults.statusToken = this.statusToken(HardwareScanTestResult.Pass);

            const date = response.scanSummary.ScanDate.toString().replace(/-/g, '/').split('T');
            previousResults.date = date[0] + ' ' + date[1].slice(0, 8);

            previousResults.information = response.scanSummary.finalResultCodeDescription;
            previousResults.items = [];

            for (const module of response.modulesResults) {
				const groupResult = module.response.groupResults;
				const groupsResultMeta = module.categoryInformation.groupList;

				for (let i = 0; i < module.response.groupResults.length; i++) {
					const item: any = {};
					const groupResultMeta = groupsResultMeta.find(x => x.id === groupResult[i].id);
					const moduleName = groupResult[i].moduleName;

					item.id = moduleId;
					item.module = module.categoryInformation.name;
					item.name = groupResultMeta.name;
					item.resultCode = groupResult[i].resultCode;
					item.information = groupResult[i].resultDescription;
					item.collapsed = false;
					item.icon = moduleName;
					if (!this.isDesktopMachine) {
						if (item.icon === 'pci_express') {
							item.icon += "_laptop";
						}
					}
					item.details = [];

					for (let j = 0; j < groupResultMeta.metaInformation.length; j++) {
						const meta = groupResultMeta.metaInformation[j];
						const detail = {};
						detail[meta.name] = meta.value;
						item.details.push(detail);
					}

                    item.listTest = [];
                    const test = groupResult[i].testResultList;
                    const testMeta = groupResultMeta.testList;

                    for (let j = 0; j < groupResult[i].testResultList.length; j++) {
						const testInfo: any = {};
						testInfo.id = test[j].id;
						testInfo.name = testMeta.find(x => x.id === test[j].id).name;
						testInfo.information = testMeta.find(x => x.id === test[j].id).description;
						testInfo.status = test[j].result;
						testInfo.statusToken = this.statusToken(test[j].result);

						if (testInfo.status === HardwareScanTestResult.NotStarted ||
							testInfo.status === HardwareScanTestResult.InProgress) {
							testInfo.status = HardwareScanOverallResult.Cancelled;
							testInfo.statusToken = this.statusToken(HardwareScanOverallResult.Cancelled);
						}

						if ((test[j].result === HardwareScanTestResult.Cancelled ||
							test[j].result === HardwareScanTestResult.NotStarted) && !hasFailed && !hasWarning) {
							previousResults.status = HardwareScanTestResult[HardwareScanTestResult.Cancelled];
							previousResults.statusValue = HardwareScanTestResult.Cancelled;
							previousResults.statusToken = this.statusToken(HardwareScanTestResult.Cancelled);
						} else if (test[j].result === HardwareScanTestResult.Fail) {
							previousResults.status = HardwareScanTestResult[HardwareScanTestResult.Fail];
							previousResults.statusValue = HardwareScanTestResult.Fail;
							previousResults.statusToken = this.statusToken(HardwareScanTestResult.Fail);
							hasFailed = true;
						} else if (test[j].result === HardwareScanTestResult.Warning && !hasFailed) {
							previousResults.status = HardwareScanTestResult[HardwareScanTestResult.Warning];
							previousResults.statusValue = HardwareScanTestResult.Warning;
							previousResults.statusToken = this.statusToken(HardwareScanTestResult.Warning);
							hasWarning = true;
						}
						item.listTest.push(testInfo);
					}

                    previousResults.items.push(item);
                }

				moduleId++;
			}
            this.previousResults = previousResults;
            this.buildPreviousResultsWidget(this.previousResults);
        }
    }

	private buildPreviousResultsWidget(previousResults: any) {
		const previousItems: any = {};
		previousItems.date = previousResults.date;
		previousItems.modules = [];
		for (const item of previousResults.items) {
			const module: any = {};
			module.name = item.module;
			module.subname = item.name;
			module.result = HardwareScanTestResult[HardwareScanTestResult.Pass];
			module.resultIcon = HardwareScanTestResult.Pass;
			module.statusToken = this.statusToken(HardwareScanTestResult.Pass);

			for (const test of item.listTest) {
				if ((test.status === HardwareScanTestResult.Cancelled ||
					test.status === HardwareScanTestResult.NotStarted) &&
					module.result !== HardwareScanTestResult[HardwareScanTestResult.Warning]) {
					module.result = HardwareScanTestResult[HardwareScanTestResult.Cancelled];
					module.resultIcon = HardwareScanTestResult.Cancelled;
					module.statusToken = this.statusToken(HardwareScanTestResult.Cancelled);
				} else if (test.status === HardwareScanTestResult.Fail) {
					module.result = HardwareScanTestResult[HardwareScanTestResult.Fail];
					module.resultIcon = HardwareScanTestResult.Fail;
					module.statusToken = this.statusToken(HardwareScanTestResult.Fail);
					break;
				} else if (test.status === HardwareScanTestResult.Warning) {
					module.result = HardwareScanTestResult[HardwareScanTestResult.Warning];
					module.resultIcon = HardwareScanTestResult.Warning;
					module.statusToken = this.statusToken(HardwareScanTestResult.Warning);
				}
			}
			previousItems.modules.push(module);
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
				test.status = HardwareScanTestResult.NotStarted;
			}
			moduleObject.resultCode = '';
		}

		for (const moduleObject of this.customScanResponse) {
			for (const test of moduleObject.listTest) {
				test.percent = 0;
				test.status = HardwareScanTestResult.NotStarted;
			}
			moduleObject.resultCode = '';
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

		for (const module in this.iconByModule) {
			let module_type = module;
			if (!this.isDesktopMachine) {
				if (module === 'pci_express') {
					module_type = module + "_laptop";
				}
			}
			result.push({
				name: this.translate.instant('hardwareScan.pluginTokens.' + module),
				subname: '',
				icon: module_type
			});
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
	 * This can be observed to know when the hardware component list is retrived
	 */
	public isHardwareModulesLoaded(): Observable<boolean> {
		return this.hardwareModulesLoaded.pipe(first())
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
}
