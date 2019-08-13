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
		this.notificationSubscription.unsubscribe();
		this.routeSubscription.unsubscribe();

	}

	private observerURL() {
		const currentPath = this.router.url;
		const page = currentPath.split('/').pop();
		switch (page) {
			case 'recover-bad-sectors':
				this.hidePreviousResult = false;
				break;
			case 'view-results':
				this.hidePreviousResult = true;
				break;
			default:
				this.hidePreviousResult = false;
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
