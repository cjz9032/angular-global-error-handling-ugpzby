import { formatDate } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import * as CryptoJS from 'crypto-js';
import moment from 'moment';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { enumSmartPerformance, PaymentPage, SpSubscriptionDetails } from 'src/app/enums/smart-performance.enum';
import { FormatLocaleDatePipe } from 'src/app/pipe/format-locale-date/format-locale-date.pipe';
import { CommonService } from 'src/app/services/common/common.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { SmartPerformanceService } from 'src/app/services/smart-performance/smart-performance.service';
import { SupportService } from 'src/app/services/support/support.service';
import { environment } from 'src/environments/environment';
import { v4 as uuid } from 'uuid';
import { ModalSmartPerformanceSubscribeComponent } from '../../modal/modal-smart-performance-subscribe/modal-smart-performance-subscribe.component';
@Component({
	selector: 'vtr-widget-subscriptiondetails',
	templateUrl: './widget-subscriptiondetails.component.html',
	styleUrls: ['./widget-subscriptiondetails.component.scss']
})
export class WidgetSubscriptiondetailsComponent implements OnInit {
	@Output() subScribeEvent = new EventEmitter<boolean>();
	@Output() expiredStatusEvent = new EventEmitter<boolean>();
	@Input() isOnline = true;
	isSubscribed: any;
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
	public modalStatus: any = { initiatedTime: '', isOpened: false };
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
	public isExpired = false;
	public expiredDaysCount: any;
	constructor(
		private translate: TranslateService,
		private modalService: NgbModal,
		private commonService: CommonService,
		private formatLocaleDate: FormatLocaleDatePipe,
		private smartPerformanceService: SmartPerformanceService,
		private supportService: SupportService,
		private logger: LoggerService) {

	}
	public localSubscriptionDetails = {
		UUID: uuid(),
		startDate: formatDate(new Date(), 'yyyy/MM/dd', 'en'),
		endDate: formatDate(this.spEnum.SCHEDULESCANENDDATE, 'yyyy/MM/dd', 'en')
	};
	ngOnInit() {
		this.isFirstLoad = true;
		this.spProcessStatus = this.commonService.getLocalStorageValue(LocalStorageKey.SPProcessStatus);
		this.spFrstRunStatus = this.commonService.getLocalStorageValue(LocalStorageKey.IsSmartPerformanceFirstRun);

		this.decryptPNListData();
		if (this.spFrstRunStatus) {
			this.getSubscriptionDetails();
		} else {
			this.initSubscripionDetails();
		}
		this.isSubscribed = this.commonService.getLocalStorageValue(LocalStorageKey.IsFreeFullFeatureEnabled);
	}
	decryptPNListData() {
		this.partNumbersList = JSON.parse(atob(environment.spPnListKey.concat('CIsIjVXUzBYNTg2NzIiLCI1V1MwWDU4NjY5Il0=')));
	}

	initSubscripionDetails() {
		let subScriptionDates: any = { startDate: '', endDate: '', status: '' };
		if (this.isSubscribed) {
			subScriptionDates = this.commonService.getLocalStorageValue(LocalStorageKey.SmartPerformanceSubscriptionDetails);
			if (subScriptionDates && subScriptionDates.startDate && subScriptionDates.endDate) {
				this.subscriptionDetails.startDate = this.formatLocaleDate.transform(subScriptionDates.startDate);
				this.subscriptionDetails.endDate = this.formatLocaleDate.transform(subScriptionDates.endDate);
				this.subscriptionDetails.status = subScriptionDates.status;
				this.subscriptionDetails.status = 'smartPerformance.subscriptionDetails.activeStatus';
				this.strStatus = 'ACTIVE';
			} else {
				this.getSubscriptionDetails();
			}
		}
		else {
			this.resetSubscriptionDetails();
			this.isLoading = false;
		}
		const currentTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
		this.modalStatus = this.commonService.getLocalStorageValue(LocalStorageKey.SmartPerformanceSubscriptionModalStatus);
		if (this.modalStatus && this.modalStatus.initiatedTime) {
			this.intervalTime = this.modalStatus.initiatedTime;
		} else {
			this.intervalTime = currentTime;
		}
		this.subscriptionDetails.status = 'smartPerformance.subscriptionDetails.processStatus';
		this.strStatus = 'PROCESSING';
		this.getSubscriptionDetails();

	}

	enableFullFeature(event) {
		if (this.isSubscribed === false) {
			const scanEnabled = this.commonService.getLocalStorageValue(LocalStorageKey.IsSPScheduleScanEnabled);
			this.commonService.setLocalStorageValue(LocalStorageKey.IsFreeFullFeatureEnabled, true);
			// this.commonService.setLocalStorageValue(LocalStorageKey.SmartPerformanceSubscriptionDetails, this.localSubscriptionDetails);
			this.commonService.setLocalStorageValue(LocalStorageKey.IsSmartPerformanceFirstRun, true);
			this.commonService.setLocalStorageValue(LocalStorageKey.SPScheduleScanFrequency, 'Once a week');
			if (!scanEnabled) {
				this.commonService.setLocalStorageValue(LocalStorageKey.IsSPScheduleScanEnabled, true);
			}
			// location.reload();
			// this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
			// 	this.router.navigate(['WidgetSubscriptiondetailsComponent']);
			// });
		}
		else {
			// this.commonService.removeLocalStorageValue(LocalStorageKey.IsFreeFullFeatureEnabled);
			// this.commonService.setLocalStorageValue(LocalStorageKey.IsSmartPerformanceFirstRun, true);
			// this.commonService.removeLocalStorageValue(LocalStorageKey.SmartPerformanceSubscriptionDetails);
			// // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
			// 	this.router.navigate(['WidgetSubscriptiondetailsComponent']);
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
		this.intervalTime = moment(currentTime).add(PaymentPage.ORDERWAITINGTIME, 'm').format('YYYY-MM-DD HH:mm:ss');
		this.modalStatus = {
			initiatedTime: this.intervalTime,
			isOpened: true
		};

		this.commonService.setLocalStorageValue(LocalStorageKey.SmartPerformanceSubscriptionModalStatus, this.modalStatus);
		const modalCancel = this.modalService.open(ModalSmartPerformanceSubscribeComponent, {
			backdrop: true,
			size: 'md',
			centered: true,
			windowClass: 'subscribe-modal',

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
		let machineInfo;
		machineInfo = await this.supportService.getMachineInfo();
		this.isLoading = true;
		this.modalStatus = this.commonService.getLocalStorageValue(LocalStorageKey.SmartPerformanceSubscriptionModalStatus) || { initiatedTime: '', isOpened: false };
		let subscriptionData = [];
		const subscriptionDetails = await this.smartPerformanceService.getPaymentDetails(machineInfo.serialnumber);
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
				const scanEnabled = this.commonService.getLocalStorageValue(LocalStorageKey.IsSPScheduleScanEnabled);
				this.commonService.setLocalStorageValue(LocalStorageKey.IsFreeFullFeatureEnabled, true);
				// this.commonService.setLocalStorageValue(LocalStorageKey.SmartPerformanceSubscriptionDetails, this.localSubscriptionDetails);
				this.commonService.setLocalStorageValue(LocalStorageKey.IsSmartPerformanceFirstRun, true);

				this.commonService.setLocalStorageValue(LocalStorageKey.SPScheduleScanFrequency, 'Once a week');
				if (!scanEnabled) {
					this.commonService.setLocalStorageValue(LocalStorageKey.IsSPScheduleScanEnabled, true);
				}
				this.commonService.setLocalStorageValue(LocalStorageKey.SPProcessStatus, false);
			}

			const lastItem = subscriptionData[subscriptionData.length - 1];
			const releaseDate = new Date(lastItem.releaseDate);
			releaseDate.setMonth(releaseDate.getMonth() + +lastItem.products[0].unitTerm);
			releaseDate.setDate(releaseDate.getDate() - 1);
			if (lastItem && lastItem.status.toUpperCase() === 'COMPLETED') {
				this.getExpiredStatus(releaseDate, lastItem);
			} else {
				this.commonService.setLocalStorageValue(LocalStorageKey.IsFreeFullFeatureEnabled, false);
				this.isSubscribed = false;
				this.subScribeEvent.emit(this.isSubscribed);
				this.resetSubscriptionDetails();
			}
		} else {

			if (this.modalStatus.isOpened) {
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
					this.subscriptionDetails.status = 'smartPerformance.subscriptionDetails.inactiveStatus';
					this.strStatus = 'INACTIVE';
					this.isLoading = false;
					this.isRefreshEnabled = true;
					this.modalStatus.isOpened = false;
					this.tempHide = true;
					this.commonService.setLocalStorageValue(LocalStorageKey.SmartPerformanceSubscriptionModalStatus, this.modalStatus);
				}
			}, 30000);
		}
	}

	getExpiredStatus(releaseDate, lastItem) {
		let expiredDate;
		let expiryRemainDays: number;
		const nextText = this.translate.instant('smartPerformance.subscriptionDetails.next');
		const currentDate: any = new Date(lastItem.currentTime);
		expiredDate = new Date(releaseDate);
		this.subscriptionDetails = {
			startDate: this.formatLocaleDate.transform(lastItem.releaseDate),
			endDate: this.formatLocaleDate.transform(releaseDate),
			productNumber: lastItem.products[0].productCode || '',
			status: 'smartPerformance.subscriptionDetails.activeStatus'
		};
		const oneDay = 24 * 60 * 60 * 1000;
		expiryRemainDays = (expiredDate - currentDate) / oneDay;
		const monthDeff = expiredDate.getMonth() - currentDate.getMonth();
		this.commonService.setLocalStorageValue(LocalStorageKey.SmartPerformanceSubscriptionDetails, this.subscriptionDetails);
		if (expiryRemainDays < 0) {
			this.isExpired = true;
			this.subscriptionDetails.status = 'smartPerformance.subscriptionDetails.expiredStatus';
			this.strStatus = 'EXPIRED';
			this.commonService.setLocalStorageValue(LocalStorageKey.IsFreeFullFeatureEnabled, false);
			// this.commonService.setLocalStorageValue(LocalStorageKey.IsSmartPerformanceFirstRun, true);
			this.isSubscribed = false;
			this.subScribeEvent.emit(this.isSubscribed);
			this.expiredStatusEvent.emit(this.isExpired);
		}
		else {
			this.subscriptionDetails.status = 'smartPerformance.subscriptionDetails.activeStatus';
			this.strStatus = 'ACTIVE';
			this.commonService.setLocalStorageValue(LocalStorageKey.IsFreeFullFeatureEnabled, true);
			this.isSubscribed = true;
			this.subScribeEvent.emit(this.isSubscribed);
		}
		if (!this.isExpired) {
			if (expiryRemainDays > 1 && expiryRemainDays <= 31) {
				this.expiredDaysCount = Math.ceil(expiryRemainDays) + ' ' + this.translate.instant('smartPerformance.subscriptionDetails.days');

			} else {
				if (expiryRemainDays >= 0 && expiryRemainDays <= 1) {
					this.expiredDaysCount = this.translate.instant('smartPerformance.subscriptionDetails.today');
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
