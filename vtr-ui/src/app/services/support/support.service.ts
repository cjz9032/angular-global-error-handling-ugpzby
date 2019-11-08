import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalFindUsComponent } from '../../components/modal/modal-find-us/modal-find-us.component';
import { ModalAboutComponent } from 'src/app/components/modal/modal-about/modal-about.component';
import { CommonService } from '../common/common.service';
import { SessionStorageKey } from 'src/app/enums/session-storage-key-enum';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { DeviceService } from '../device/device.service';

@Injectable({
	providedIn: 'root'
})
export class SupportService {
	private sysinfo: any;
	private warranty: any;
	metrics: any;
	userGuide: any;
	sn: string;
	metricsDatas = {
		viewOrder: 1,
		pageNumber: 1,
	};
	warrantyData: { info: any, cache: boolean };
	warrantyNormalUrl = 'https://pcsupport.lenovo.com/us/en/warrantylookup';
	warrantyDataCache: { info: any, cache: boolean };

	constructor(
		private shellService: VantageShellService,
		private commonService: CommonService,
		private modalService: NgbModal,
		private deviceService: DeviceService
	) {
		this.sysinfo = shellService.getSysinfo();
		this.warranty = shellService.getWarranty();
		this.metrics = shellService.getMetrics();
		this.userGuide = shellService.getUserGuide();
		this.commonService = commonService;
		this.warrantyDataCache = this.commonService.getSessionStorageValue(SessionStorageKey.WarrantyDataCache, undefined);
		if (this.warrantyDataCache) {
			this.warrantyData = commonService.cloneObj(this.warrantyDataCache);
		} else {
			this.warrantyData = {
				info: {
					status: -1,
					url: this.warrantyNormalUrl
				},
				cache: false
			};
			this.commonService.setSessionStorageValue(SessionStorageKey.WarrantyDataCache, this.warrantyData);
		}
		if (this.userGuide) {
			this.userGuide.refresh();
		}
		this.getWarrantyInfo(this.commonService.isOnline);
	}

	public getMachineInfo(): Promise<any> {
		return this.deviceService.getMachineInfo();
	}

	async getSerialnumber(): Promise<any> {
		if (!this.sn) {
			const machineInfo = await this.getMachineInfo();
			this.sn = machineInfo.serialnumber;
		}
		return this.sn;
	}

	public getWarranty(serialnumber: string): Promise<any> {
		if (this.warranty) {
			return this.warranty.getWarrantyInformation(serialnumber);
		}
	}

	getWarrantyInfo(online: boolean) {
		if (this.shellService) {
			const defaultWarranty = {
				status: 2,
				url: this.warrantyNormalUrl
			};

			// if (this.getMachineInfo() === undefined) { return; } // duplicate MachineInfo call

			this.getMachineInfo().then((machineInfo) => {
				if (machineInfo) {
					// machineInfo.serialnumber = 'R90HTPEU';
					// 'PC0G9X77' 'R9T6M3E' 'R90HTPEU' machineInfo.serialnumber
					if (machineInfo.serialnumber) { this.sn = machineInfo.serialnumber; }
					this.getWarranty(machineInfo.serialnumber).then((result) => {
						if (result) {
							this.warrantyData.info = result;
							if (online) { this.warrantyData.cache = true; }
							if (machineInfo.serialnumber) {
								this.warrantyData.info.url = this.getWarrantyUrl(machineInfo.serialnumber);
							} else {
								this.warrantyData.info.url = this.warrantyNormalUrl;
							}
						} else {
							this.warrantyData.info = defaultWarranty;
						}
						this.warrantyDataCache = this.commonService.cloneObj(this.warrantyData);
						this.warrantyDataCache.info.url = this.warrantyNormalUrl;
						this.commonService.setSessionStorageValue(SessionStorageKey.WarrantyDataCache, this.warrantyDataCache);
					}).catch((err) => {
						console.log(err);
						this.warrantyData.info = defaultWarranty;
						this.commonService.setSessionStorageValue(SessionStorageKey.WarrantyDataCache, this.warrantyData);
					});
				} else {
					this.warrantyData.info = defaultWarranty;
					this.commonService.setSessionStorageValue(SessionStorageKey.WarrantyDataCache, this.warrantyData);
				}
			}).catch((err) => {
				console.log(err);
				this.warrantyData.info = defaultWarranty;
				this.commonService.setSessionStorageValue(SessionStorageKey.WarrantyDataCache, this.warrantyData);
			});
		}
	}

	sendMetricsAsync(data: any) {
		if (this.metrics && this.metrics.sendAsync) {
			console.log('metrics ready!');
			this.metrics.sendAsync(data);
		} else {
			console.log('can not find metrics');
		}
	}

	widgetItemClick(clickItem: string) {
		switch (clickItem) {
			case 'findUs':
				this.showFindUsPop();
				break;
			case 'about':
				this.showAboutPop();
				break;
			case 'userGuide':
				this.launchUserGuide(false);
				break;
			default:
				break;
		}
	}

	showFindUsPop() {
		const findUsModal: NgbModalRef = this.modalService.open(ModalFindUsComponent, {
			backdrop: true,
			centered: true,
			windowClass: 'Find-Us-Modal'
		});
	}
	showAboutPop() {
		const aboutModal: NgbModalRef = this.modalService.open(ModalAboutComponent, {
			backdrop: true,
			centered: true,
			windowClass: 'About-Modal'
		});
	}

	launchUserGuide(launchPDF?: boolean) {
		if (this.userGuide) {
			this.userGuide.launchUg(this.commonService.isOnline, launchPDF);
		}
	}

	public getWarrantyUrl(serialNumber: string): string {
		if (serialNumber && serialNumber.length > 0) {
			return `https://www.lenovo.com/us/en/warrantyApos?serialNumber=${serialNumber}&cid=ww:apps:pikjhe&utm_source=Companion&utm_medium=Native&utm_campaign=Warranty`;
		}
		return this.warrantyNormalUrl;
	}
}
