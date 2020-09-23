import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonService } from 'src/app/services/common/common.service';
import { Subscription } from 'rxjs';
import { HardwareScanProgress } from 'src/app/enums/hw-scan-progress.enum';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { DeviceService } from 'src/app/services/device/device.service';
import { TranslateService } from '@ngx-translate/core';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { Router } from '@angular/router';
import { HardwareScanService } from '../../../services/hardware-scan/hardware-scan.service';
import { FeatureContent } from 'src/app/data-models/common/feature-content.model';
import { ContentActionType } from 'src/app/enums/content.enum';
import { ModalHardwareScanRbsComponent } from '../../modal/modal-hardware-scan-rbs/modal-hardware-scan-rbs.component';

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
	hardwareScanSupportCard: FeatureContent = new FeatureContent();
	routeSubscription: Subscription;
	currentRouter: any;
	hidePreviousResult = false;
	isRBSDeviceSelectionPage = false;
	private rbsModal = ModalHardwareScanRbsComponent;

	constructor(
		public deviceService: DeviceService,
		private commonService: CommonService,
		private hardwareScanService: HardwareScanService,
		private translate: TranslateService,
		private router: Router,
		private modalService: NgbModal,
	) { }

	ngOnInit() {
		this.notificationSubscription = this.commonService.notification.subscribe((response: AppNotification) => {
			this.onNotification(response);
		});
		this.hardwareScanService.startRecoverFromFailed.subscribe((failedDevices) => {
			this.onRecoverBadSectors(failedDevices);
		});
		this.routeSubscription = this.router.events.subscribe(() => this.observerURL());
		this.initSupportCard();
	}

	ngOnDestroy() {
		if (this.notificationSubscription) {
			this.notificationSubscription.unsubscribe();
		}
		if (this.routeSubscription) {
			this.routeSubscription.unsubscribe();
		}

	}

	private initSupportCard() {
		Object.assign(this.hardwareScanSupportCard, {
			Id: 'HardwareScan.DiagnosticsTools',
			Title: this.translate.instant('hardwareScan.support.title'),
			FeatureImage: 'assets/images/support.jpg',
			Action: 'Read More',
			ActionType: ContentActionType.External,
			ActionLink: 'https://pcsupport.lenovo.com/lenovodiagnosticsolutions/downloads',
			isLocal: true
		});
		if (!this.commonService.isOnline) {
			this.hardwareScanSupportCard.Title = this.translate.instant('hardwareScan.offline');
		}
	}

	private observerURL() {
		const currentPath = this.router.url;
		const page = currentPath.split('/').pop();
		switch (page) {
			case 'view-results':
				this.hidePreviousResult = true;
				this.isRBSDeviceSelectionPage = false;
				break;
			default:
				this.hidePreviousResult = false;
				this.isRBSDeviceSelectionPage = false;
				break;
		}
	}

	public onRecoverBadSectors(failedDevices = null) {
		const modalRef = this.modalService.open(this.rbsModal, {
			size: 'lg',
			centered: true,
		});

		if (failedDevices !== null) {
			modalRef.componentInstance.failedDevicesList = failedDevices;
		}

		modalRef.componentInstance.recoverStart.subscribe((devices) => {
			this.startRecover(devices);
		});
	}

	private startRecover(devices) {
		if (this.hardwareScanService) {
			this.hardwareScanService.setDevicesRecover(devices);
			this.hardwareScanService.setRecoverInit(true);
			this.hardwareScanService.setRecoverExecutionStatus(true);
			this.hardwareScanService.setIsScanDone(false);
			this.hardwareScanService.startRecover.emit();
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

	public getProgress() {
		if (this.hardwareScanService) {
			return this.hardwareScanService.getProgress();
		}
	}

	public setTitle() {
		if (this.hardwareScanService) {
			if (this.isRBSDeviceSelectionPage || this.isRecoverExecuting()) {
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
			const { type } = notification;
			switch (type) {
				case NetworkStatus.Online:
					this.hardwareScanSupportCard.Title = this.translate.instant('hardwareScan.support.title');
					break;
				case NetworkStatus.Offline:
					this.hardwareScanSupportCard.Title = this.translate.instant('hardwareScan.offline');
					break;
				default:
					break;
			}
		}
	}
}
