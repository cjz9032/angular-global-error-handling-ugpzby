import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonService } from 'src/app/services/common/common.service';
import { CMSService } from 'src/app/services/cms/cms.service';
import { Subscription } from 'rxjs';
import { HardwareScanProgress } from 'src/app/beta/hardware-scan/enums/hw-scan-progress.enum';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { DeviceService } from 'src/app/services/device/device.service';
import { TranslateService } from '@ngx-translate/core';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { Router } from '@angular/router';
import { HardwareScanService } from '../services/hardware-scan/hardware-scan.service';

@Component({
	selector: 'vtr-page-hardware-scan',
	templateUrl: './page-hardware-scan.component.html',
	styleUrls: ['./page-hardware-scan.component.scss'],
	providers: [NgbModalConfig, NgbModal]
})

export class PageHardwareScanComponent implements OnInit, OnDestroy {

	backarrow = '< ';
	cardContentPositionA: any;
	notificationSubscription: Subscription;
	supportTitle = this.translate.instant('hardwareScan.support.title');
	routeSubscription: Subscription;
	currentRouter: any;
	hidePreviousResult = false;
	hideRecover = false;


	constructor(
		public deviceService: DeviceService,
		private commonService: CommonService,
		private cmsService: CMSService,
		private hardwareScanService: HardwareScanService,
		config: NgbModalConfig,
		private translate: TranslateService,
		private router: Router,
	) {
		// this.fetchCMSArticles();
		if (!this.commonService.isOnline) {
			this.supportTitle = this.translate.instant('hardwareScan.offline');
		}
	}

	ngOnInit() {
		this.notificationSubscription = this.commonService.notification.subscribe((response: AppNotification) => {
			this.onNotification(response);
		});
		this.routeSubscription = this.router.events.subscribe(() => this.observerURL());

	}

	ngOnDestroy() {
		if (this.notificationSubscription) {
			this.notificationSubscription.unsubscribe();
		}
		if (this.routeSubscription) {
			this.routeSubscription.unsubscribe();
		}

	}

	private observerURL() {
		const currentPath = this.router.url;
		const page = currentPath.split('/').pop();
		switch (page) {
			case 'recover-bad-sectors':
				this.hidePreviousResult = false;
				this.hideRecover = true;
				break;
			case 'view-results':
				this.hidePreviousResult = true;
				this.hideRecover = false;
				break;
			default:
				this.hidePreviousResult = false;
				this.hideRecover = false;
				break;
		}
	}


	public onGetSupportClick($event: any) {

	}

	public isLoadingDone() {
		if (this.hardwareScanService) {
			return this.hardwareScanService.isLoadingDone();
		}
	}

	public isScanDoneExecuting() {
		if (this.hardwareScanService) {
			return this.hardwareScanService.isScanDoneExecuting();
		}
	}

	public isScanExecuting() {
		if (this.hardwareScanService) {
			return this.hardwareScanService.isScanExecuting();
		}
	}

	public getIsViewingRecoverLog() {
		if (this.hardwareScanService) {
			return this.hardwareScanService.getIsViewingRecoverLog();
		}
	}

	public isRecoverExecuting() {
		if (this.hardwareScanService) {
			return this.hardwareScanService.isRecoverExecuting();
		}
	}

	public isRecoverInProgress() {
		if (this.hardwareScanService) {
			return this.hardwareScanService.isRecoverInProgress();
		}
	}

	public getProgress() {
		if (this.hardwareScanService) {
			return this.hardwareScanService.getProgress();
		}
	}

	public setTitle() {
		if (this.hardwareScanService) {
			if (this.hideRecover || this.isRecoverExecuting() || this.isRecoverInProgress() || this.getIsViewingRecoverLog()) {
				return this.translate.instant('hardwareScan.recoverBadSectors.title');
			} else {
				return this.translate.instant('hardwareScan.name');
			}
		}
	}

	public hasDevicesToRecoverBadSectors() {
		if (this.hardwareScanService) {
			if (!this.hardwareScanService.isRecoverExecuting()) {
				return this.hardwareScanService.getHasItemsToRecoverBadSectors();
			}
			return false;
		}
	}

	public disable() {
		const isExecuting = !this.hardwareScanService.isScanDoneExecuting() && (this.hardwareScanService.isScanExecuting() || this.hardwareScanService.isRecoverExecuting());
		return isExecuting;
	}

	public redirectBack() {
		// Clearing the last response received from Scan/RBS to ensure that
		// the Hardware Components page will be shown, since user just clicked
		// in the back button.
		this.hardwareScanService.clearLastResponse();
		this.commonService.sendNotification(HardwareScanProgress.BackEvent);
	}

	private onNotification(notification: AppNotification) {
		if (notification) {
			const { type, payload } = notification;
			switch (type) {
				case NetworkStatus.Online:
					this.supportTitle = this.translate.instant('hardwareScan.support.title');
					break;
				case NetworkStatus.Offline:
					this.supportTitle = this.translate.instant('hardwareScan.offline');
					break;
				default:
					break;
			}
		}
	}
}
