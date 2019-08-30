import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { CommonService } from 'src/app/services/common/common.service';
import { Subscription } from 'rxjs';
import { HardwareScanProgress } from 'src/app/beta/hardware-scan/enums/hw-scan-progress.enum';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { NgbModal, NgbModalRef, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { HardwareScanTestResult } from 'src/app/beta/hardware-scan/enums/hardware-scan-test-result.enum';
import { DeviceService } from 'src/app/services/device/device.service';
import { MyDevice } from 'src/app/data-models/device/my-device.model';
import { TranslateService } from '@ngx-translate/core';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { ModalHardwareScanCustomizeComponent } from '../../../modal/modal-hardware-scan-customize/modal-hardware-scan-customize.component';
import { ModalCancelComponent } from '../../../modal/modal-cancel/modal-cancel.component';
import { ModalEticketComponent } from '../../../modal/modal-eticket/modal-eticket.component';
import { ModalScheduleScanCollisionComponent } from '../../../modal/modal-schedule-scan-collision/modal-schedule-scan-collision.component';
import { HardwareScanService } from '../../../services/hardware-scan/hardware-scan.service';

@Component({
	selector: 'vtr-hardware-components',
	templateUrl: './hardware-components.component.html',
	styleUrls: ['./hardware-components.component.scss']
})
export class HardwareComponentsComponent implements OnInit, OnDestroy {

	public enableViewResults = false;
	public viewResultsText = this.translate.instant('hardwareScan.viewResults');
	public refreshText = this.translate.instant('hardwareScan.refreshModule');
	public viewResultsPath = '';
	public resultItems: any;
	public hardwareTitle = '';
	public isScanDone = false;
	public finalResultCode: string;
	public modules: any;
	public progress = 0;
	public myDevice: MyDevice;
	public tooltipInformation: any;

	public isRecoverBadSectorsInProgress = false;
	public devicesRecoverBadSectors: any[];
	public deviceInRecover: any; // Current device in Recover Bad Sectors

	private notificationSubscription: Subscription;
	private customizeModal = ModalHardwareScanCustomizeComponent;
	private finalResponse: any;
	private startDate: any;
	public itemsNextScan: any = [];
	private cancelHandler = {
		'cancel': undefined
	};
	private cancelRequested = false;
	private batteryMessage: string;
	private culture: any;
	private showETicket = false;
	private modalCancelRef: any;

	public isOnline = true;
	completeStatusToken: string;

	constructor(
		public deviceService: DeviceService,
		private commonService: CommonService,
		private hardwareScanService: HardwareScanService,
		private ngZone: NgZone,
		private modalService: NgbModal,
		config: NgbModalConfig,
		private translate: TranslateService,
	) {
		this.viewResultsPath = '/beta/hardware-scan/view-results';
		this.isOnline = this.commonService.isOnline;
	}

	ngOnInit() {
		this.culture = window.navigator.languages[0];

		this.notificationSubscription = this.commonService.notification.subscribe((response: AppNotification) => {
			this.onNotification(response);
		});

		this.initComponent();
	}

	ngOnDestroy() {
		if (this.notificationSubscription) {
			this.notificationSubscription.unsubscribe();
		}
	}

	public initComponent() {
		this.setPageTitle();

		if (this.hardwareScanService) {
			if (this.hardwareScanService.isScanDoneExecuting()) {
				this.hardwareScanService.setIsScanDone(false);
				this.hardwareScanService.setScanExecutionStatus(false);
				this.hardwareScanService.setRecoverExecutionStatus(false);
			}

			if (this.hardwareScanService.isRecoverInit()) {
				this.doRecoverBadSectors();
				this.hardwareScanService.setRecoverInit(false);
			}

			if (!this.hardwareScanService.isScanExecuting() && !this.hardwareScanService.isRecoverExecuting() && !this.hardwareScanService.isLoadingDone()) {
				this.hardwareScanService.initLoadingModules(this.culture);
			}
		}
		this.enableViewResults = false;
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

	public getComponentsTitle() {
		if (this.hardwareScanService) {
			if (this.hardwareScanService.isRecoverExecuting()) {
				return this.translate.instant('hardwareScan.recoverBadSectors.localDevices');
			} else if (this.hardwareScanService.isLoadingDone()) {
				return this.translate.instant('hardwareScan.hardwareComponents');
			} else {
				return this.translate.instant('hardwareScan.loadingComponents');
			}
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
		if (this.isRecoverExecuting()) {
			if (this.hardwareScanService  && !this.isDisableCancel()) {
				console.log('[onCancelScan] Start');
				this.hardwareScanService.cancelScanExecution()
					.then((response) => {
					});
			}
		} else {
			this.modalCancelRef = this.modalService.open(ModalCancelComponent, {
				backdrop: 'static',
				size: 'lg',
				centered: true,
			});

			this.modalCancelRef.componentInstance.cancelRequested.subscribe(() => {
				if (this.hardwareScanService) {
					console.log('[onCancelScan] Start');
					this.cancelRequested = true;
					//this.cancelHandler.cancel();
					this.hardwareScanService.cancelScanExecution()
						.then((response) => {
							console.log('response: ', response);
						});
				}
			});
		}
	}

	public refreshModules() {
		this.hardwareScanService.setLoadingStatus(false);
		this.hardwareScanService.initLoadingModules(this.culture);
	}

	getItemToDisplay() {
		const devices = [];
		const modules = this.hardwareScanService.getModulesRetrieved();
		if (modules !== undefined) {
			for (const categoryInfo of modules.categoryList) {
				for (let i = 0; i < categoryInfo.groupList.length; i++) {
					const group = categoryInfo.groupList[i];
					const info = categoryInfo.name + ' - ';

					devices.push({
						name: info,
						subname: group.name,
						status: HardwareScanTestResult.Pass,
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
		console.log('[Start]: getDoScan()');
		this.finalResponse = null;
		this.finalResultCode = '';
		this.tooltipInformation = '';
		this.startDate = new Date();
		this.progress = 0;
		this.cancelRequested = false;

		const payload = {
			'requests': requests,
			'categories': [],
			'localizedItems': []
		};

		console.log('[getDoScan] - payload: ' + JSON.stringify(payload));
		if (this.hardwareScanService) {
			this.hardwareScanService.getDoScan(payload, this.modules, this.cancelHandler)
				.then((response) => {
					this.cleaningUpScan(response);
					if (!this.showETicket) {
						this.checkETicket();
					}
					console.log('[End]: getDoScan()');
					console.log(this.finalResponse);
				})
				.finally(() => {
					this.cleaningUpScan(undefined);
				});
		}
	}

	private cleaningUpScan(response: any) {
		if (response) {
			this.finalResponse = response;
			this.finalResultCode = response.finalResultCode;
			this.tooltipInformation = response.resultDescription;
		}

		if (this.modalCancelRef) {
			this.modalCancelRef.close();
		}

		if (this.cancelRequested === false) {
			this.enableViewResults = true;
		} else {
			this.initComponent();
		}
	}

	public async checkETicket() {
		let brokenModules = '';
		const categoryInfoList = this.hardwareScanService.getCategoryInformation();
		for (const scanRequest of this.finalResponse.responses) { // For each module
			for (const groupResult of scanRequest.groupResults) { // For each device
				let broken = false;
				for (const testResult of groupResult.testResultList) { // For each test
					// console.log("[TEST] " + testResult.result);
					if (testResult.result === 3) { // TestResultType.Fail
						if (brokenModules !== '') {
							brokenModules += '; ';
						}

						for (const category of categoryInfoList) {
							if (category.id === groupResult.moduleName) {
								brokenModules += category.name;
							}
						}
						broken = true;
						break;
					}
				}
				if (broken === true) {
					break;
				}
			}
		}

		if (brokenModules !== '') {
			const dd = String(this.startDate.getDate()).padStart(2, '0');
			const mm = String(this.startDate.getMonth() + 1).padStart(2, '0');
			const yyyy = String(this.startDate.getFullYear());

			const stringDate = yyyy + mm + dd;

			await this.getDeviceInfo();
			let serial = '';

			if (this.myDevice) {
				serial = this.myDevice.sn;
			}
			const ticketUrl = 'SerialNumber=' + serial + '&DiagCode=' + this.finalResultCode + '&Channel=vantage&TestDate=' + stringDate;

			console.log('[URL] ' + ticketUrl);

			const base64Url = btoa(ticketUrl);
			const fullUrl = 'https://pcsupport.lenovo.com/eticketwithservice?data=' + base64Url;

			const modalRef = this.modalService.open(ModalEticketComponent, {
				backdrop: 'static',
				size: 'lg',
				centered: true,
				windowClass: 'schedule-new-modal-size'
			});
			modalRef.componentInstance.moduleNames = brokenModules;
			modalRef.componentInstance.setUrl(fullUrl);
		}

		console.log('[BROKEN] ' + brokenModules);
	}

	private getDeviceInfo() {
		if (this.deviceService.isShellAvailable) {
			return this.deviceService.getDeviceInfo()
				.then((value: any) => {
					this.myDevice = value;
					console.log('getDeviceInfo.then', value);
				}).catch(error => {
					console.error('getDeviceInfo', error);
				});
		}
	}

	private doRecoverBadSectors() {
		console.log('[Start] Recover Bad Sectors');
		this.progress = 0;

		const devicesId = [];

		this.devicesRecoverBadSectors = this.hardwareScanService.getDevicesRecover();
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
			this.hardwareScanService.getRecoverBadSectors(payload)
				.then((response) => {
					console.log('[Last Response] doRecoverBadSectors');
					console.log(response);
					console.log('[End] Recover Bad Sectors');
					this.enableViewResults = true;
				});
		}
	}

	public onCustomizeScan() {
		if (this.isLoadingDone()) {
			const modalRef = this.modalService.open(this.customizeModal, {
				size: 'lg',
				centered: true,
				windowClass: 'custom-modal-size'
			});
			modalRef.componentInstance.items = this.hardwareScanService.getCustomScanModules();
			console.log('[MODAL] ', modalRef.componentInstance.items);
			modalRef.componentInstance.passEntry.subscribe(() => {
				this.hardwareScanService.filterCustomTests(this.culture);
				this.checkPreScanInfo(1); // custom scan
			});
		}
	}

	public checkPreScanInfo(scanType: number) {
		this.hardwareScanService.cleanResponses();
		let requests;
		if (scanType === 0) { // quick
			this.modules = this.hardwareScanService.getQuickScanResponse();
			requests = this.hardwareScanService.getQuickScanRequest();

		} else if (scanType === 1) { // custom
			this.modules = this.hardwareScanService.getFilteredCustomScanResponse();
			requests = this.hardwareScanService.getFilteredCustomScanRequest();
		}
		const testList = [];
		for (const scanRequest of requests) {
			for (const test of scanRequest.testRequestList) {
				testList.push(test);
			}
		}

		console.log('[PRE SCAN TEST LIST]', testList);

		const preScanInformationRequest = {
			lang: this.culture,
			tests: testList
		};

		this.batteryMessage = '';

		this.hardwareScanService.getPreScanInfo(preScanInformationRequest).then((response) => {
			for (const message of response.MessageList) {
				if (message.id === 'connect-power') {
					this.batteryMessage = message.description;
					break;
				}
			}

			if (this.batteryMessage !== '') {
				const modal: NgbModalRef = this.modalService.open(ModalScheduleScanCollisionComponent, {
					backdrop: 'static',
					size: 'lg',
					centered: true,
					windowClass: 'schedule-new-modal-size'
				});

				(<ModalScheduleScanCollisionComponent>modal.componentInstance).error = this.translate.instant('hardwareScan.warning');
				(<ModalScheduleScanCollisionComponent>modal.componentInstance).description = this.batteryMessage;

				modal.result.then((result) => {
					this.getDoScan(scanType, requests);
				}, (reason) => {
					this.hardwareScanService.cleanCustomTests();
				});
			} else {
				this.getDoScan(scanType, requests);
			}
		});
	}

	public onViewResults() {
		const date = new Date();
		const day = date.getDate().toString();
		const month = date.getMonth() + 1;
		const monthString = month.toString();
		const year = date.getFullYear().toString();
		const time = date.toTimeString().split(' ');
		const dateString = year + '/' + monthString + '/' + day + ' ' + time[0];

		const results = {
			finalResultCode: this.finalResponse.finalResultCode,
			status: HardwareScanTestResult[HardwareScanTestResult.Pass],
			statusValue: HardwareScanTestResult.Pass,
			statusToken: this.statusToken(HardwareScanTestResult.Pass),
			date: this.finalResponse.startDate,
			information: this.finalResponse.resultDescription,
			items: []
		};

		for (const module of this.modules) {

			const item = {
				id: module.id,
				module: module.module,
				name: module.name,
				resultCode: module.resultCode,
				information: module.description,
				collapsed: false,
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

		this.hardwareScanService.setIsViewingRecoverLog(false);
		this.hardwareScanService.setViewResultItems(results);
		this.hardwareScanService.setScanExecutionStatus(false);
		this.hardwareScanService.setIsScanDone(false);
		this.isScanDone = true;
	}

	public onViewResultsRecover() {
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
				module: this.translate.instant('hardwareScan.recoverBadSectors.localDevices'),
				name: '',
				collapsed: false,
				details: [],
				listTest: []
			};

			item.details = [
				{ [this.translate.instant('hardwareScan.recoverBadSectors.numberSectors')]: device.numberOfSectors },
				{ [this.translate.instant('hardwareScan.recoverBadSectors.numberBadSectors')]: device.numberOfBadSectors },
				{ [this.translate.instant('hardwareScan.recoverBadSectors.numberFixedSectors')]: device.numberOfFixedSectors },
				{ [this.translate.instant('hardwareScan.recoverBadSectors.numberNonFixedSectors')]: device.numberOfNonFixedSectors },
				{ [this.translate.instant('hardwareScan.recoverBadSectors.elapsedTime')]: device.elapsedTime }
			];

			item.listTest.push({
				id: '',
				name: device.name,
				status: device.status,
			});

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

		this.hardwareScanService.setIsViewingRecoverLog(true);
		this.hardwareScanService.setViewResultItems(results);
		this.hardwareScanService.setRecoverExecutionStatus(false);
		this.hardwareScanService.setIsScanDone(false);
		this.isScanDone = true;
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
						this.progress = payload;
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
				case HardwareScanProgress.RecoverResponse:
					this.devicesRecoverBadSectors = payload.devices;
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
}
