import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { CommonService } from 'src/app/services/common/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalSmartPerformanceSubscribeComponent } from '../../modal/modal-smart-performance-subscribe/modal-smart-performance-subscribe.component';
import { v4 as uuid } from 'uuid';
import { formatDate } from '@angular/common';
import { enumSmartPerformance } from 'src/app/enums/smart-performance.enum';
import { FormatLocaleDatePipe } from 'src/app/pipe/format-locale-date/format-locale-date.pipe';
import moment from 'moment';
@Component({
	selector: 'vtr-widget-subscriptiondetails',
	templateUrl: './widget-subscriptiondetails.component.html',
	styleUrls: ['./widget-subscriptiondetails.component.scss']
})
export class WidgetSubscriptiondetailsComponent implements OnInit {
	@Output() subScribeEvent = new EventEmitter<boolean>();
	isSubscribed: any;
	subscriptionDetails: any;
	startDate: any;
	endDate: any;
	status: any;
	strStatus: any;
	givenDate: Date;
	public today = new Date();
	myDate = new Date();
	spEnum:any = enumSmartPerformance;
	public subscriptionDate: any;
	public modalStatus: any = {};
	currentTime: string;
	intervalTime: string;

  constructor(
	  private translate: TranslateService,
	  private modalService: NgbModal,
	  private commonService: CommonService,
	  private formatLocaleDate: FormatLocaleDatePipe
	  ) {
	}
	public localSubscriptionDetails = {
			UUID: uuid(),
			startDate: formatDate(new Date(), 'yyyy/MM/dd', 'en'),
			endDate: formatDate(this.spEnum.SCHEDULESCANENDDATE, 'yyyy/MM/dd', 'en')
		}
	ngOnInit() {
		this.isSubscribed = this.commonService.getLocalStorageValue(LocalStorageKey.IsFreeFullFeatureEnabled);
		this.initSubscripionDetails();
		this.modalStatus = this.commonService.getLocalStorageValue(LocalStorageKey.SmartPerformanceSubscriptionModalStatus);
		if(this.modalStatus && this.modalStatus.isOpened && this.modalStatus.initiatedTime < this.intervalTime){
			this.getAccessToken();
			this.subscriptionDetails.status = 'smartPerformance.subscriptionDetails.processStatus';
			this.strStatus = 'PROCESSING';
		}
	}
	initSubscripionDetails() {
		let subScriptionDates: any = {};
		if (this.isSubscribed) {
			subScriptionDates = this.commonService.getLocalStorageValue(LocalStorageKey.SmartPerformanceSubscriptionDetails);
			this.subscriptionDetails.startDate = this.formatLocaleDate.transform(subScriptionDates.startDate);
			this.subscriptionDetails.endDate = this.formatLocaleDate.transform(subScriptionDates.endDate);

			if (this.subscriptionDetails.endDate > this.today) {
				this.subscriptionDetails.status = 'smartPerformance.subscriptionDetails.activeStatus';
				this.strStatus = 'ACTIVE';
			}
			else {
				this.subscriptionDetails.status = 'smartPerformance.subscriptionDetails.inactiveStatus';
				this.strStatus = 'INACTIVE';
			}
		}
		else {
			this.subscriptionDetails.startDate = '---';
			this.subscriptionDetails.endDate = '---';
			this.subscriptionDetails.status = 'smartPerformance.subscriptionDetails.inactiveStatus';
			this.strStatus = 'INACTIVE';
		}
	}

	enableFullFeature(event) {
		if (this.isSubscribed === false) {
			const scanEnabled = this.commonService.getLocalStorageValue(LocalStorageKey.IsSPScheduleScanEnabled);
			this.commonService.setLocalStorageValue(LocalStorageKey.IsFreeFullFeatureEnabled, true);
			this.commonService.setLocalStorageValue(LocalStorageKey.SmartPerformanceSubscriptionDetails, this.localSubscriptionDetails);
			this.commonService.setLocalStorageValue(LocalStorageKey.IsSmartPerformanceFirstRun, true);
			this.commonService.setLocalStorageValue(LocalStorageKey.SPScheduleScanFrequency, 'Once a week')
			if(!scanEnabled) {
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
		this.subScribeEvent.emit(event)

		// this.modalService.open(ModalSmartPerformanceSubscribeComponent, {
		//     backdrop: 'static',
		//     size: 'lg',
		//     centered: true,
		//     windowClass: 'subscribe-modal',

		// });

	}
	openSubscribeModal() {
		this.currentTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
		this.intervalTime = moment(this.currentTime).add(10, 'm').format('YYYY-MM-DD HH:mm:ss');
		this.modalStatus = {
			initiatedTime: this.currentTime,
			isOpened: true
		}
		this.commonService.setLocalStorageValue(LocalStorageKey.SmartPerformanceSubscriptionModalStatus, this.modalStatus);
		const modalCancel = this.modalService.open(ModalSmartPerformanceSubscribeComponent, {
			backdrop: 'static',
			size: 'lg',
			centered: true,
			windowClass: 'subscribe-modal',

		});

		modalCancel.componentInstance.cancelPaymentRequest.subscribe(() => {
			this.subscriptionDetails.status = 'smartPerformance.subscriptionDetails.processStatus';
			this.strStatus = 'PROCESSING';
			this.getAccessToken();
		});
	}

	async getAccessToken() {
		const url = 'https://rsgw-eservice-uat.motorola.com/auth/oauth/v2/token';
		const body = {
			client_id: 'l764087a49cc4641668079e49d0320ef17',
			client_secret: 'ca49aace91a1419a825cbe7562cdc027',
			grant_type: 'client_credentials'
		}
		this.getSubscriptionDetails()
		// const accessToken = this.smartPerformanceService.getAccessToken(url, body);
	}

	async getSubscriptionDetails() {
		const url = 'https://rsgw-eservice-uat.motorola.com/main.upsell.dit/smart/getorders';
		const obj = {
			serialNumber: 'PC0ZEPQ6'
		}
		// const subscriptionDetails = await this.smartPerformanceService.getPaymentnDetails(url, obj);
		const subscriptionData = [
			{
				releaseDate: '2020-06-11T08:25:10.528+0000',
				createTime: '2020-06-11T08:20:02.323+0000',
				status: 'COMPLETED',
				products: [
					{
						productCode: '5WS0X58670',
						productName: 'Smart Performance',
						productType: 'SmartPerformance',
						unitTerm: 24
					}
				]
			}
		]
		if (subscriptionData && subscriptionData.length > 0) {
			const releaseDate = moment(subscriptionData[0].releaseDate);
			const addUnitTerm = moment(releaseDate).add(subscriptionData[0].products[0].unitTerm, 'M');
			const expiredDate = moment(addUnitTerm).endOf('month');
			this.subscriptionDetails = {
				startDate: moment(releaseDate).format('YYYY-MM-DD HH:mm:ss'),
				endDate: moment(expiredDate).format('YYYY-MM-DD HH:mm:ss'),
				productNumber: subscriptionData[0].products[0].productCode || ''
			}
			this.commonService.setLocalStorageValue(LocalStorageKey.SmartPerformanceSubscriptionDetails, this.subscriptionDetails);
			this.modalStatus.isOpened = false;
			this.commonService.setLocalStorageValue(LocalStorageKey.SmartPerformanceSubscriptionModalStatus, this.modalStatus);
		} else {
			setTimeout(() => {
				if (this.intervalTime < this.currentTime) {
					this.getSubscriptionDetails()
				}
			}, 3000);
		}
	}
}
