import { formatDate } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@lenovo/material/dialog';

import moment from 'moment';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { EnumSmartPerformance, PaymentPage, SubscriptionState } from 'src/app/enums/smart-performance.enum';
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
	@Output() subScribeEvent = new EventEmitter<SubscriptionState>();
	@Input() isOnline = true;
	@Input() isClickDisabled = false;
	SubscriptionState = SubscriptionState;
	subscriptionDetails: any = { startDate: '', endDate: '', status: '' };
	startDate: any;
	endDate: any;
	status: any;
	strStatus: any;
	givenDate: Date;
	public today = new Date();
	myDate = new Date();
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
	expiredMessage: any;
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
		endDate: formatDate(EnumSmartPerformance.SCHEDULESCANENDDATE, 'yyyy/MM/dd', 'en'),
	};

	ngOnInit() {
		this.isFirstLoad = true;
		this.spFrstRunStatus = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.IsSmartPerformanceFirstRun
		);

		this.smartPerformanceService.scanningStopped.subscribe(() => {
			this.subscriptionDetails.status = 'smartPerformance.subscriptionDetails.processStatus';
			this.strStatus = 'PROCESSING';
			this.spFrstRunStatus = false;
			this.getSubscriptionDetails();
		});

		if (this.spFrstRunStatus) {
			this.getSubscriptionDetails();
		} else {
			this.initSubscripionDetails();
		}
	}

	initSubscripionDetails() {
		let subScriptionDates: any = { startDate: '', endDate: '', status: '' };
		if (this.smartPerformanceService.subscriptionState === SubscriptionState.Active) {
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
		const subscriptionData = await this.smartPerformanceService.getSubscriptionDataDetail((state) => {
			if (state === SubscriptionState.Inactive) {
				this.subScribeEvent.emit(this.smartPerformanceService.subscriptionState);
				this.resetSubscriptionDetails();
			} else if (state === SubscriptionState.Active) {
				this.subscriptionDetails.status = 'smartPerformance.subscriptionDetails.activeStatus';
				this.strStatus = 'ACTIVE';
				this.smartPerformanceService.unregisterScanSchedule(EnumSmartPerformance.SCHEDULESCAN);
				this.subScribeEvent.emit(this.smartPerformanceService.subscriptionState);
			} else if (state === SubscriptionState.Expired) {
				this.subscriptionDetails.status = 'smartPerformance.subscriptionDetails.expiredStatus';
				this.strStatus = 'EXPIRED';
				this.subScribeEvent.emit(this.smartPerformanceService.subscriptionState);
			}
		});
		if (this.smartPerformanceService.subscriptionState !== SubscriptionState.Inactive) {
			this.showSubscriptionInfo(subscriptionData);
		}
		this.subscriptionDataProcess(subscriptionData);
	}

	subscriptionDataProcess(subscriptionData) {
		if (subscriptionData) {
			this.isLoading = false;
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

	showSubscriptionInfo(subscriptionData) {
		if (subscriptionData) {
			const currentDate: any = new Date(subscriptionData.currentTime);
			const expiredDate: any = new Date(subscriptionData.expiredTime);
			this.subscriptionDetails.startDate = this.formatLocaleDate.transform(subscriptionData.releaseDate);
			this.subscriptionDetails.endDate = this.formatLocaleDate.transform(expiredDate);
			this.subscriptionDetails.productNumber = subscriptionData.products[0].productCode || '';
			const oneDay = 24 * 60 * 60 * 1000;
			const expiryRemainDays = Math.floor((expiredDate - currentDate) / oneDay);
			this.localCacheService.setLocalCacheValue(
				LocalStorageKey.SmartPerformanceSubscriptionDetails,
				this.subscriptionDetails
			);

			if (this.smartPerformanceService.subscriptionState === SubscriptionState.Active) {
				if (expiryRemainDays > 28 && expiryRemainDays <= 31) {
					this.expiredMessage = this.translate.instant('smartPerformance.subscriptionDetails.expireInNextMonth');
				}
				else if (expiryRemainDays > 7 && expiryRemainDays <= 28) {
					const remainWeeks = Math.ceil(expiryRemainDays / 7);
					this.expiredMessage = this.translate.instant('smartPerformance.subscriptionDetails.expireInNextXWeeks', { weeks: remainWeeks });
				} else if (expiryRemainDays === 7) {
					this.expiredMessage = this.translate.instant('smartPerformance.subscriptionDetails.expireInNextWeek');
				}
				else if (expiryRemainDays > 1 && expiryRemainDays < 7) {
					this.expiredMessage = this.translate.instant('smartPerformance.subscriptionDetails.expireInNextXDays', { days: expiryRemainDays });
				}
				else if (expiryRemainDays >= 0 && expiryRemainDays <= 1) {
					this.expiredMessage = this.translate.instant('smartPerformance.subscriptionDetails.expireInToday');
				} else {
					this.expiredMessage = undefined;
				}
			}
		}
	}

	resetSubscriptionDetails() {
		this.subscriptionDetails.startDate = '---';
		this.subscriptionDetails.endDate = '---';
		this.subscriptionDetails.status = 'smartPerformance.subscriptionDetails.inactiveStatus';
		this.strStatus = 'INACTIVE';
	}
}
