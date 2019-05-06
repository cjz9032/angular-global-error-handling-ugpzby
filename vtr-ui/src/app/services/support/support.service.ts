// below line is needed for js intellisense
/// <reference path='../../../../node_modules/@lenovo/tan-client-bridge/src/features/dashboard-feature.js' />

import { Injectable } from '@angular/core';

import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalSupportWechatComponent } from '../../components/modal/modal-support-wechat/modal-support-wechat.component';
import { ModalAboutComponent } from 'src/app/components/modal/modal-about/modal-about.component';

@Injectable({
	providedIn: 'root'
})
export class SupportService {
	private sysinfo: any;
	private warranty: any;
	metrics: any;
	metricsDatas = {
		viewOrder: 1,
		pageNumber: 1,
	};

	// public isShellAvailable = false;
	constructor(
		private shellService: VantageShellService,
		private modalService: NgbModal,
	) {
		this.sysinfo = shellService.getSysinfo();
		this.warranty = shellService.getWarranty();
		this.metrics = shellService.getMetrics();
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

	sendMetricsAsync(data: any) {
		if (this.metrics && this.metrics.sendAsync) {
			console.log('metrics ready!');
			this.metrics.sendAsync(data);
		} else {
			console.log('can not find metrics');
		}
	}

	widgetItemClick(clickItem: string) {
		if (clickItem === 'qrCode') {
			this.showQRCodePop();
		} else if (clickItem === 'about') {
			this.showAboutPop();
		}
	}

	showQRCodePop() {
		const weChatModal: NgbModalRef = this.modalService.open(ModalSupportWechatComponent, {
			centered: true,
			windowClass: 'weChat-Modal'
		});
	}
	showAboutPop() {
		const aboutModal: NgbModalRef = this.modalService.open(ModalAboutComponent, {
			centered: true,
			windowClass: 'weChat-Modal'
		});
	}
}
