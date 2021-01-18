import { formatDate } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@lenovo/material/dialog';

import moment from 'moment';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { enumSmartPerformance, PaymentPage } from 'src/app/enums/smart-performance.enum';
import { FormatLocaleDatePipe } from 'src/app/pipe/format-locale-date/format-locale-date.pipe';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { SmartPerformanceService } from 'src/app/services/smart-performance/smart-performance.service';
import { SupportService } from 'src/app/services/support/support.service';
import { v4 as uuid } from 'uuid';
import { ModalSmartPerformanceSubscribeComponent } from 'src/app/components/modal/modal-smart-performance-subscribe/modal-smart-performance-subscribe.component';

@Component({
	selector: 'vtr-widget-subscriptiondetails',
	templateUrl: './widget-subscriptiondetails.component.html',
	styleUrls: ['./widget-subscriptiondetails.component.scss'],
})
export class WidgetSubscriptionDetailsComponent implements OnInit {
	@Output() subScribeEvent = new EventEmitter<boolean>();
	@Output() expiredStatusEvent = new EventEmitter<boolean>();
	@Input() isOnline = true;
	@Input() isClickDisabled = false;
	subscriptionDetails: any = { startDate: '', endDate: '', status: '' };
	startDate: any;
	endDate: any;
	status: any;
	strStatus: any;
	givenDate: Date;
	public today = new Date();
	myDate = new Date();
	spEnum: any = enumSmartPerformance;
	public subscriptionDate: any;
	public partNumbersList: any = [];
	public systemSerialNumber: any;
	currentTime: string;
	intervalTime: string;
	spFrstRunStatus: boolean;
	public isLoading = false;
	public isFirstLoad = false;
	public isRefreshEnabled = false;
	tempHide = false;
	spProcessStatus: any;
	public expiredDaysCount: any;
	constructor(
		private translate: TranslateService,
		private dialog: MatDialog,
		private formatLocaleDate: FormatLocaleDatePipe,
		public smartPerformanceService: SmartPerformanceService,
		private supportService: SupportService,
		private localCacheService: LocalCacheService,
		private logger: LoggerService
	) { }
	public localSubscriptionDetails = {
		UUID: uuid(),
		startDate: formatDate(new Date(), 'yyyy/MM/dd', 'en'),
		endDate: formatDate(this.spEnum.SCHEDULESCANENDDATE, 'yyyy/MM/dd', 'en'),
	};
	ngOnInit() {
		this.isFirstLoad = true;
		this.spProcessStatus = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.SPProcessStatus
		);
		this.spFrstRunStatus = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.IsSmartPerformanceFirstRun
		);

		if (this.spFrstRunStatus) {
			this.getSubscriptionDetails();
		} else {
			this.initSubscripionDetails();
		}
		this.smartPerformanceService.isSubscribed = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.IsFreeFullFeatureEnabled
		);
	}

	initSubscripionDetails() {
		let subScriptionDates: any = { startDate: '', endDate: '', status: '' };
		if (this.smartPerformanceService.isSubscribed) {
			subScriptionDates = this.localCacheService.getLocalCacheValue(
				LocalStorageKey.SmartPerformanceSubscriptionDetails
			);
			if (subScriptionDates && subScriptionDates.startDate && subScriptionDates.endDate) {
				this.subscriptionDetails.startDate = this.formatLocaleDate.transform(
					subScriptionDates.startDate
				);
				this.subscriptionDetails.endDate = this.formatLocaleDate.transform(
					subScriptionDates.endDate
				);
				this.subscriptionDetails.status = subScriptionDates.status;
				this.subscriptionDetails.status =
					'smartPerformance.subscriptionDetails.activeStatus';
				this.strStatus = 'ACTIVE';
			} else {
				this.getSubscriptionDetails();
			}
		} else {
			this.resetSubscriptionDetails();
			this.isLoading = false;
		}
		const currentTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
		if (
			this.smartPerformanceService.modalStatus &&
			this.smartPerformanceService.modalStatus.initiatedTime
		) {
			this.intervalTime = this.smartPerformanceService.modalStatus.initiatedTime;
		} else {
			this.intervalTime = currentTime;
		}
		this.subscriptionDetails.status = 'smartPerformance.subscriptionDetails.processStatus';
		this.strStatus = 'PROCESSING';
		this.getSubscriptionDetails();
	}

	enableFullFeature(event) {
		if (this.smartPerformanceService.isSubscribed === false) {
			const scanEnabled = this.localCacheService.getLocalCacheValue(
				LocalStorageKey.IsSPScheduleScanEnabled
			);
			this.localCacheService.setLocalCacheValue(
				LocalStorageKey.IsFreeFullFeatureEnabled,
				true
			);
			// this.localCacheService.setLocalCacheValue(LocalStorageKey.SmartPerformanceSubscriptionDetails, this.localSubscriptionDetails);
			this.localCacheService.setLocalCacheValue(
				LocalStorageKey.IsSmartPerformanceFirstRun,
				true
			);
			this.localCacheService.setLocalCacheValue(
				LocalStorageKey.SPScheduleScanFrequency,
				'Once a week'
			);
			if (!scanEnabled) {
				this.localCacheService.setLocalCacheValue(
					LocalStorageKey.IsSPScheduleScanEnabled,
					true
				);
			}
			// location.reload();
			// this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
			// 	this.router.navigate(['WidgetSubscriptionDetailsComponent']);
			// });
		} else {
			// this.localCacheService.removeLocalCacheValue(LocalStorageKey.IsFreeFullFeatureEnabled);
			// this.localCacheService.setLocalCacheValue(LocalStorageKey.IsSmartPerformanceFirstRun, true);
			// this.localCacheService.removeLocalCacheValue(LocalStorageKey.SmartPerformanceSubscriptionDetails);
			// // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
			// 	this.router.navigate(['WidgetSubscriptionDetailsComponent']);
			// });
			// location.reload();
		}
		this.subScribeEvent.emit(event);

		// this.modalService.open(ModalSmartPerformanceSubscribeComponent, {
		//     backdrop: 'static',
		//     size: 'lg',
		//     centered: true,
		//     windowClass: 'subscribe-modal',

		// });
	}
	openSubscribeModal() {
		this.isFirstLoad = false;
		const currentTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
		this.intervalTime = moment(currentTime)
			.add(PaymentPage.ORDERWAITINGTIME, 'm')
			.format('YYYY-MM-DD HH:mm:ss');
		const modalCancel = this.dialog.open(ModalSmartPerformanceSubscribeComponent, {
			autoFocus: true,
			hasBackdrop: true,
			disableClose: true,
			panelClass: 'subscribe-modal',
		});
		this.spFrstRunStatus = false;
		modalCancel.componentInstance.cancelPaymentRequest.subscribe(() => {
			this.subscriptionDetails.status = 'smartPerformance.subscriptionDetails.processStatus';
			this.strStatus = 'PROCESSING';
			this.spFrstRunStatus = false;
			this.getSubscriptionDetails();
		});
	}

	async getSubscriptionDetails() {
		const machineInfo = await this.supportService.getMachineInfo();
		this.isLoading = true;
		let subscriptionData = [];
		const subscriptionDetails = await this.smartPerformanceService.getPaymentDetails(
			machineInfo.serialnumber
		);
		this.logger.info('Subscription Details', subscriptionDetails);
		if (subscriptionDetails && subscriptionDetails.data) {
			subscriptionData = subscriptionDetails.data;
		} else {
			subscriptionData = [];
		}
		this.subscriptionDataProcess(subscriptionData);
	}

	subscriptionDataProcess(subscriptionData) {
		if (subscriptionData && subscriptionData.length > 0) {
			this.isLoading = false;
			if (this.spProcessStatus === undefined || this.spProcessStatus === true) {
				const scanEnabled = this.localCacheService.getLocalCacheValue(
					LocalStorageKey.IsSPScheduleScanEnabled
				);
				this.localCacheService.setLocalCacheValue(
					LocalStorageKey.IsFreeFullFeatureEnabled,
					true
				);
				// this.localCacheService.setLocalCacheValue(LocalStorageKey.SmartPerformanceSubscriptionDetails, this.localSubscriptionDetails);
				this.localCacheService.setLocalCacheValue(
					LocalStorageKey.IsSmartPerformanceFirstRun,
					true
				);

				this.localCacheService.setLocalCacheValue(
					LocalStorageKey.SPScheduleScanFrequency,
					'Once a week'
				);
				if (!scanEnabled) {
					this.localCacheService.setLocalCacheValue(
						LocalStorageKey.IsSPScheduleScanEnabled,
						true
					);
				}
				this.localCacheService.setLocalCacheValue(LocalStorageKey.SPProcessStatus, false);
			}

			const lastItem = subscriptionData[subscriptionData.length - 1];
			const releaseDate = new Date(lastItem.releaseDate);
			releaseDate.setMonth(releaseDate.getMonth() + +lastItem.products[0].unitTerm);
			releaseDate.setDate(releaseDate.getDate() - 1);
			if (lastItem && lastItem.status.toUpperCase() === 'COMPLETED') {
				this.getExpiredStatus(releaseDate, lastItem);
			} else {
				this.localCacheService.setLocalCacheValue(
					LocalStorageKey.IsFreeFullFeatureEnabled,
					false
				);
				this.smartPerformanceService.isSubscribed = false;
				this.subScribeEvent.emit(this.smartPerformanceService.isSubscribed);
				this.resetSubscriptionDetails();
			}
		} else {
			if (this.smartPerformanceService.modalStatus.isGettingStatus) {
				this.setTimeOutCallForSubDetails();
			} else {
				this.resetSubscriptionDetails();
				this.isLoading = false;
				this.isRefreshEnabled = false;
				this.tempHide = false;
			}
		}
	}
	setTimeOutCallForSubDetails() {
		if (this.spFrstRunStatus) {
			this.isLoading = false;
			this.resetSubscriptionDetails();
		} else {
			const currentTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
			this.subscriptionDetails.status = 'smartPerformance.subscriptionDetails.processStatus';
			this.strStatus = 'PROCESSING';
			setTimeout(() => {
				if (this.intervalTime && this.intervalTime > currentTime) {
					this.getSubscriptionDetails();
				} else {
					this.subscriptionDetails.status =
						'smartPerformance.subscriptionDetails.inactiveStatus';
					this.strStatus = 'INACTIVE';
					this.isLoading = false;
					this.isFirstLoad = true;
					this.smartPerformanceService.modalStatus.isGettingStatus = false;
					this.tempHide = true;
					this.getSubscriptionDetails();
				}
			}, 30000);
		}
	}

	getExpiredStatus(releaseDate, lastItem) {
		const nextText = this.translate.instant('smartPerformance.subscriptionDetails.next');
		const currentDate: any = new Date(lastItem.currentTime);
		const expiredDate: any = new Date(releaseDate);
		this.subscriptionDetails = {
			startDate: this.formatLocaleDate.transform(lastItem.releaseDate),
			endDate: this.formatLocaleDate.transform(releaseDate),
			productNumber: lastItem.products[0].productCode || '',
			status: 'smartPerformance.subscriptionDetails.activeStatus',
		};
		const oneDay = 24 * 60 * 60 * 1000;
		const expiryRemainDays = (expiredDate - currentDate) / oneDay;
		const monthDeff = expiredDate.getMonth() - currentDate.getMonth();
		this.localCacheService.setLocalCacheValue(
			LocalStorageKey.SmartPerformanceSubscriptionDetails,
			this.subscriptionDetails
		);
		if (expiryRemainDays < 0) {
			this.smartPerformanceService.isExpired = true;
			this.subscriptionDetails.status = 'smartPerformance.subscriptionDetails.expiredStatus';
			this.strStatus = 'EXPIRED';
			this.localCacheService.setLocalCacheValue(
				LocalStorageKey.IsFreeFullFeatureEnabled,
				false
			);
			// this.localCacheService.setLocalCacheValue(LocalStorageKey.IsSmartPerformanceFirstRun, true);
			this.smartPerformanceService.isSubscribed = false;
			this.subScribeEvent.emit(this.smartPerformanceService.isSubscribed);
			this.expiredStatusEvent.emit(this.smartPerformanceService.isExpired);
		} else {
			this.subscriptionDetails.status = 'smartPerformance.subscriptionDetails.activeStatus';
			this.strStatus = 'ACTIVE';
			this.localCacheService.setLocalCacheValue(
				LocalStorageKey.IsFreeFullFeatureEnabled,
				true
			);
			this.smartPerformanceService.isSubscribed = true;
			this.smartPerformanceService.unregisterScanSchedule(enumSmartPerformance.SCHEDULESCAN);
			this.subScribeEvent.emit(this.smartPerformanceService.isSubscribed);
		}
		if (!this.smartPerformanceService.isExpired) {
			if (expiryRemainDays > 1 && expiryRemainDays <= 31) {
				this.expiredDaysCount =
					Math.ceil(expiryRemainDays) +
					' ' +
					this.translate.instant('smartPerformance.subscriptionDetails.days');
			} else {
				if (expiryRemainDays >= 0 && expiryRemainDays <= 1) {
					this.expiredDaysCount = this.translate.instant(
						'smartPerformance.subscriptionDetails.today'
					);
				}
			}
			// switch (true) {
			// 	case (+monthDeff === 1 && expiredDate.getFullYear() === currentDate.getFullYear()): {
			// 		this.expiredDaysCount = nextText + ' ' + this.translate.instant('smartPerformance.subscriptionDetails.month');
			// 		break;
			// 	}
			// 	case (expiryRemainDays >= 14 && expiryRemainDays < 15): {
			// 		this.expiredDaysCount = nextText + ' ' + Math.floor(expiryRemainDays / 7) + ' ' + this.translate.instant('smartPerformance.subscriptionDetails.weeks');
			// 		break;
			// 	}
			// 	case (expiryRemainDays >= 7 && expiryRemainDays < 8): {
			// 		this.expiredDaysCount = this.translate.instant('smartPerformance.subscriptionDetails.week');
			// 		break;
			// 	}
			// 	case (expiryRemainDays >= 3 && expiryRemainDays < 4): {
			// 		this.expiredDaysCount = Math.floor(expiryRemainDays)  + ' ' + this.translate.instant('smartPerformance.subscriptionDetails.days');
			// 		break;
			// 	}
			// 	case (expiryRemainDays >= 0 && expiryRemainDays < 1): {
			// 		this.expiredDaysCount = this.translate.instant('smartPerformance.subscriptionDetails.today');
			// 		break;
			// 	}
			// 	default: {
			// 		this.expiredDaysCount = '';
			// 		break;
			// 	}
			// }
		}
	}
	resetSubscriptionDetails() {
		this.subscriptionDetails.startDate = '---';
		this.subscriptionDetails.endDate = '---';
		this.subscriptionDetails.status = 'smartPerformance.subscriptionDetails.inactiveStatus';
		this.strStatus = 'INACTIVE';
	}
}
