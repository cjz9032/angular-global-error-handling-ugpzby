import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbModalRef, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ModalHardwareScanCustomizeComponent } from '../../../../../modal/modal-hardware-scan-customize/modal-hardware-scan-customize.component';
import { ModalWaitComponent } from '../../../../../modal/modal-wait/modal-wait.component';
import { TranslateService } from '@ngx-translate/core';
import { TaskType, TaskStep } from 'src/app/enums/hardware-scan-metrics.enum';
import { ModalScheduleScanCollisionComponent } from '../../../../../modal/modal-schedule-scan-collision/modal-schedule-scan-collision.component';
import { TimerService } from 'src/app/services/timer/timer.service';

import { ExecuteHardwareScanService } from '../../../../../../services/hardware-scan/execute-hardware-scan/execute-hardware-scan.service';
import { HardwareScanService } from '../../../../../../services/hardware-scan/hardware-scan.service';

@Component({
  selector: 'vtr-hardware-scan-wait-select-header',
  templateUrl: './hardware-scan-wait-select-header.component.html',
  styleUrls: ['./hardware-scan-wait-select-header.component.scss']
})

export class HardwareScanWaitSelectHeaderComponent implements OnInit {


	@Input() culture;
	@Input() metrics;

	private batteryMessage: string;
	public modules: any;
	public progress;
	public startDate;
	public itemsToDisplay: any;

	private cancelHandler = {
		cancel: undefined
	};

	// "Wrapper" value to be accessed from the HTML
	public taskTypeEnum = TaskType;
	private customizeModal = ModalHardwareScanCustomizeComponent;

	constructor(
		private modalService: NgbModal,
		private translate: TranslateService,
		private timerService: TimerService,
		private hardwareScanService: HardwareScanService,
		private executeScanService : ExecuteHardwareScanService,
		) { }

	ngOnInit() { }

	//Return the status of the quick and custom button
	public isButtonDisable() {
		if (this.executeScanService){
			return this.executeScanService.getIsButtonDisable();
		}
	}

	//Verfy if all modules is load before a scan
	public startScanWaitingModules(taskType: TaskType) {
		this.executeScanService.setIsButtonDisable(true); // Disable button, preventing multiple clicks by the user

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
				this.executeScanService.setIsButtonDisable(false);
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
				this.executeScanService.setIsButtonDisable(false);
			}
		});
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
				//( modal.componentInstance as ModalScheduleScanCollisionComponent).ItemParent = this.getMetricsParentValue();
				//( modal.componentInstance as ModalScheduleScanCollisionComponent).CancelItemName = this.getMetricsItemNameClose();
				//( modal.componentInstance as ModalScheduleScanCollisionComponent).ConfirmItemName = this.getMetricsItemNameConfirm();

				modal.result.then((result) => {
					this.getDoScan(taskType, requests);

					// User has clicked in the OK button, so we need to re-enable the Quick/Custom scan button here
					this.executeScanService.setIsButtonDisable(false);
				}, (reason) => {
					this.hardwareScanService.cleanCustomTests();

					// User has clicked in the 'X' button, so we also need to re-enable the Quick/Custom scan button here.
					this.executeScanService.setIsButtonDisable(false);
				});
			} else {
				this.getDoScan(taskType, requests);
			}
		});
	}

	/*
	* Used to start a scan, 0 is a quick scan, and 1 is a custom scan
	*/
	public getDoScan(scanType: number, requests: any) {
		this.startDate = new Date();
		this.progress = 0;

		this.hardwareScanService.setCurrentTaskStep(TaskStep.Run);

		const payload = {
			requests: requests,
			categories: [],
			localizedItems: []
		};

		if (this.hardwareScanService) {

			//this.itemParentCancelScan = this.getMetricsParentValue();
			//this.itemNameCancelScan = this.getMetricsItemNameCancel();

			this.hardwareScanService.setFinalResponse(null);

			this.hardwareScanService.setFinalResponse(null);
			this.hardwareScanService.getDoScan(payload, this.modules, this.cancelHandler)
				.then((response) => {
				//this.cleaningUpScan(response);
				//if (!this.showETicket) {
				//	this.checkETicket();
				//}
			})
				.catch((ex: any) => {
				//this.initComponent();
			})
				.finally(() => {
					//const metricsResult = this.getMetricsTaskResult();
					//this.sendTaskActionMetrics(this.hardwareScanService.getCurrentTaskType(), metricsResult.countSuccesses,
					//	'', metricsResult.scanResultJson, this.timerService.stop());
					//this.cleaningUpScan(undefined);
					this.itemsToDisplay = this.getItemToDisplay();
				});
		}
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
						name: info,
						subname: group.name,
						icon: categoryInfo.id,
					});
				}
			}
		}
		return devices;
	}
}
