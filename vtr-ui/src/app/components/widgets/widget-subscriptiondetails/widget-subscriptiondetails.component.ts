import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { CommonService } from 'src/app/services/common/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalSmartPerformanceSubscribeComponent } from '../../modal/modal-smart-performance-subscribe/modal-smart-performance-subscribe.component';
import { v4 as uuid } from 'uuid';
import { formatDate } from '@angular/common';
import { enumSmartPerformance, PaymentPage } from 'src/app/enums/smart-performance.enum';
import { FormatLocaleDatePipe } from 'src/app/pipe/format-locale-date/format-locale-date.pipe';
import moment from 'moment';
import { SmartPerformanceService } from 'src/app/services/smart-performance/smart-performance.service';
import { SupportService } from 'src/app/services/support/support.service';
import * as CryptoJS from 'crypto-js';
@Component({
	selector: 'vtr-widget-subscriptiondetails',
	templateUrl: './widget-subscriptiondetails.component.html',
	styleUrls: ['./widget-subscriptiondetails.component.scss']
})
export class WidgetSubscriptiondetailsComponent implements OnInit {
	@Output() subScribeEvent = new EventEmitter<boolean>();
	isSubscribed: any;
	subscriptionDetails: any = {startDate: '', endDate: '', status: ''};
	startDate: any;
	endDate: any;
	status: any;
	strStatus: any;
	givenDate: Date;
	public today = new Date();
	myDate = new Date();
	spEnum:any = enumSmartPerformance;
	public subscriptionDate: any;
	public modalStatus: any = {intervalTime: '', isOpened: false};ciphertext: any;
	public partNumbersList: any = [];
	public systemSerialNumber: any;
	currentTime: string;
	intervalTime: string;

  constructor(
	  private translate: TranslateService,
	  private modalService: NgbModal,
	  private commonService: CommonService,
	  private formatLocaleDate: FormatLocaleDatePipe,
	  private smartPerformanceService: SmartPerformanceService,
	  private supportService: SupportService,

	  ) {
	}
	public localSubscriptionDetails = {
			UUID: uuid(),
			startDate: formatDate(new Date(), 'yyyy/MM/dd', 'en'),
			endDate: formatDate(this.spEnum.SCHEDULESCANENDDATE, 'yyyy/MM/dd', 'en')
		}
	ngOnInit() {
		this.supportService.getMachineInfo().then(async (machineInfo) => {
			this.systemSerialNumber = machineInfo.serialnumber;
		});
		this.isSubscribed = this.commonService.getLocalStorageValue(LocalStorageKey.IsFreeFullFeatureEnabled);
		this.decryptPNListData();
		this.initSubscripionDetails();
	}
	decryptPNListData() {
		const bytes  = CryptoJS.AES.decrypt(PaymentPage.PNLIST, 'secret key 123');
		this.partNumbersList = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
	  }

	initSubscripionDetails() {
		let subScriptionDates: any = {startDate: '', endDate: '', status: ''};
		if (this.isSubscribed) {
			subScriptionDates = this.commonService.getLocalStorageValue(LocalStorageKey.SmartPerformanceSubscriptionDetails);
			this.subscriptionDetails.startDate = this.formatLocaleDate.transform(subScriptionDates.startDate);
			this.subscriptionDetails.endDate = this.formatLocaleDate.transform(subScriptionDates.endDate);

			if (this.subscriptionDetails.endDate < this.today) {
				this.subscriptionDetails.status = 'smartPerformance.subscriptionDetails.inactiveStatus';
				this.strStatus = 'INACTIVE';
			}
			this.subscriptionDetails.status = 'smartPerformance.subscriptionDetails.activeStatus';
			this.strStatus = 'ACTIVE';
		}
		else {
			this.subscriptionDetails.startDate = '---';
			this.subscriptionDetails.endDate = '---';
			this.subscriptionDetails.status = 'smartPerformance.subscriptionDetails.inactiveStatus';
			this.strStatus = 'INACTIVE';
		}
		const currentTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
		this.modalStatus = this.commonService.getLocalStorageValue(LocalStorageKey.SmartPerformanceSubscriptionModalStatus);
		if(this.modalStatus && this.modalStatus.isOpened){
			this.getSubscriptionDetails();
			this.subscriptionDetails.status = 'smartPerformance.subscriptionDetails.processStatus';
			this.strStatus = 'PROCESSING';
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
		const currentTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
		this.intervalTime = moment(currentTime).add(PaymentPage.ORDERWAITINGTIME, 'm').format('YYYY-MM-DD HH:mm:ss');
		this.modalStatus = {
			initiatedTime: this.intervalTime,
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
			this.getSubscriptionDetails();
		});
	}

	async getSubscriptionDetails() {
		this.modalStatus = this.commonService.getLocalStorageValue(LocalStorageKey.SmartPerformanceSubscriptionModalStatus);
		let subscriptionDetails: any;
		let subscriptionData = []
		// const subscriptionDetails = await this.smartPerformanceService.getPaymentDetails(serialNumber);
		this.smartPerformanceService.getPaymentDetails(this.systemSerialNumber).then(res =>{
			subscriptionDetails = res;
		})
		if(subscriptionDetails){
			subscriptionData = subscriptionDetails.data? subscriptionDetails.data : [];
		} else {
			subscriptionData = [];
		}
		if (subscriptionData && subscriptionData.length > 0) {
			const releaseDate = new Date(subscriptionData[0].releaseDate);
			releaseDate.setMonth(releaseDate.getMonth() + +subscriptionData[0].products[0].unitTerm);
			releaseDate.setDate(releaseDate.getDate() - 1);
			this.subscriptionDetails = {
				startDate: this.formatLocaleDate.transform(subscriptionData[0].releaseDate),
				endDate: this.formatLocaleDate.transform(releaseDate.toLocaleDateString()),
				productNumber: subscriptionData[0].products[0].productCode || ''
			}
			this.commonService.setLocalStorageValue(LocalStorageKey.SmartPerformanceSubscriptionDetails, this.subscriptionDetails);
			this.subscriptionDetails.status = 'smartPerformance.subscriptionDetails.activeStatus';
			this.strStatus = 'ACTIVE';
			this.commonService.setLocalStorageValue(LocalStorageKey.IsFreeFullFeatureEnabled, true);
			this.modalStatus.isOpened = false;
			this.commonService.setLocalStorageValue(LocalStorageKey.SmartPerformanceSubscriptionModalStatus, this.modalStatus);
			this.isSubscribed = true;
			this.subScribeEvent.emit(this.isSubscribed);

		} else {
			const currentTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
				this.subscriptionDetails.status = 'smartPerformance.subscriptionDetails.processStatus';
				this.strStatus = 'PROCESSING';
				setTimeout(() => {
					if (this.intervalTime < currentTime) {
						this.getSubscriptionDetails()
					} else {
						this.subscriptionDetails.status = 'smartPerformance.subscriptionDetails.inactiveStatus';
						this.strStatus = 'INACTIVE';
						this.modalStatus.isOpened = false;
						this.commonService.setLocalStorageValue(LocalStorageKey.SmartPerformanceSubscriptionModalStatus, this.modalStatus);
					}
				}, 30000);
		}

	}

}
