import { Injectable } from '@angular/core';

import { MatDialog } from '@lenovo/material/dialog';

import { ModalFindUsComponent } from '../../components/modal/modal-find-us/modal-find-us.component';
import { ModalAboutComponent } from 'src/app/components/modal/modal-about/modal-about.component';
import { CommonService } from '../common/common.service';
import { SessionStorageKey } from 'src/app/enums/session-storage-key-enum';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { DeviceService } from '../device/device.service';

@Injectable({
	providedIn: 'root',
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
	warrantyData: { info: any; cache: boolean };
	warrantyNormalUrl = 'https://pcsupport.lenovo.com/us/en/warrantylookup';
	warrantyDataCache: { info: any; cache: boolean };
	supportDatas: any;

	constructor(
		private shellService: VantageShellService,
		private commonService: CommonService,
		private dialog: MatDialog,
		private deviceService: DeviceService
	) {
		this.sysinfo = shellService.getSysinfo();
		this.warranty = shellService.getWarranty();
		this.metrics = shellService.getMetrics();
		this.userGuide = shellService.getUserGuide();
		this.commonService = commonService;
		this.warrantyDataCache = this.commonService.getSessionStorageValue(
			SessionStorageKey.WarrantyDataCache,
			undefined
		);
		if (this.warrantyDataCache) {
			this.warrantyData = commonService.cloneObj(this.warrantyDataCache);
		} else {
			this.warrantyData = {
				info: {
					status: -1,
					url: this.warrantyNormalUrl,
				},
				cache: false,
			};
			this.commonService.setSessionStorageValue(
				SessionStorageKey.WarrantyDataCache,
				this.warrantyData
			);
		}
		if (this.userGuide) {
			this.userGuide.refresh();
		}
	}

	public getMachineInfo(): Promise<any> {
		return this.deviceService.getMachineInfo();
	}

	async getSerialnumber(): Promise<any> {
		if (!this.sn) {
			const machineInfo = await this.getMachineInfo();
			if (machineInfo) {
				this.sn = machineInfo.serialnumber;
			}
		}
		return this.sn;
	}

	sendMetricsAsync(data: any) {
		if (this.metrics && this.metrics.sendAsync) {
			this.metrics.sendAsync(data);
		} else {
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
		const findUsModal = this.dialog.open(ModalFindUsComponent, {
			maxWidth: '50rem',
			autoFocus: false,
			hasBackdrop: true,
			panelClass: 'Find-Us-Modal',
			ariaLabelledBy: 'find-us-modal-basic-title',
		});
	}
	showAboutPop() {
		const aboutModal = this.dialog.open(ModalAboutComponent, {
			maxWidth: '50rem',
			autoFocus: false,
			hasBackdrop: true,
			panelClass: 'About-Modal',
			ariaLabelledBy: 'about-modal-basic-title',
		});
	}

	launchUserGuide(launchPDF?: boolean) {
		if (this.userGuide) {
			this.userGuide.launchUg(this.commonService.isOnline, launchPDF);
		}
	}
}
