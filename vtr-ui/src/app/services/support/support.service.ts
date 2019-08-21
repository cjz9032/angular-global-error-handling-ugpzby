import { Injectable } from '@angular/core';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalFindUsComponent } from '../../components/modal/modal-find-us/modal-find-us.component';
import { ModalAboutComponent } from 'src/app/components/modal/modal-about/modal-about.component';

@Injectable({
	providedIn: 'root'
})
export class SupportService {
	private sysinfo: any;
	private warranty: any;
	metrics: any;
	userGuide: any;
	metricsDatas = {
		viewOrder: 1,
		pageNumber: 1,
	};
	warrantyData: { info: any, cache: boolean };
	warrantyNormalUrl = 'https://pcsupport.lenovo.com/us/en/warrantylookup';

	constructor(
		private shellService: VantageShellService,
		private modalService: NgbModal,
	) {
		this.sysinfo = shellService.getSysinfo();
		this.warranty = shellService.getWarranty();
		this.metrics = shellService.getMetrics();
		this.userGuide = shellService.getUserGuide();
		this.warrantyData = {
			info: {
				status: -1,
				url: this.warrantyNormalUrl
			},
			cache: false
		};
		if (this.userGuide) {
			this.userGuide.refresh();
		}
	}

	public getMachineInfo(): Promise<any> {
		if (this.sysinfo) {
			return this.sysinfo.getMachineInfo();
		}
		return undefined;
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

			this.getMachineInfo().then((machineInfo) => {
				if (machineInfo) {
					// machineInfo.serialnumber = 'R90HTPEU';
					// 'PC0G9X77' 'R9T6M3E' 'R90HTPEU' machineInfo.serialnumber
					this.getWarranty(machineInfo.serialnumber).then((result) => {
						if (result) {
							this.warrantyData.info = result;
							if (online) { this.warrantyData.cache = true; }
							if (machineInfo.serialnumber) {
								this.warrantyData.info.url =
									`https://www.lenovo.com/us/en/warrantyApos?serialNumber=${machineInfo.serialnumber}&cid=ww:apps:pikjhe&utm_source=Companion&utm_medium=Native&utm_campaign=Warranty`;
							} else {
								this.warrantyData.info.url = this.warrantyNormalUrl;
							}
						} else {
							this.warrantyData.info = defaultWarranty;
						}
					}).catch((err) => {
						console.log(err);
						this.warrantyData.info = defaultWarranty;
					});
				} else {
					this.warrantyData.info = defaultWarranty;
				}
			}).catch((err) => {
				console.log(err);
				this.warrantyData.info = defaultWarranty;
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
			windowClass: 'About-Modal'
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
			this.userGuide.launch(launchPDF);
		}
	}
}
