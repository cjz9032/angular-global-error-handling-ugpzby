import { Component, OnInit, HostListener, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { Router } from '@angular/router';
import { v4 as uuid } from 'uuid';
import { formatDate } from '@angular/common';
import { SupportService } from 'src/app/services/support/support.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { PaymentPage } from 'src/app/enums/smart-performance.enum';
import { environment } from 'src/environments/environment';
import moment from 'moment';
@Component({
	selector: 'vtr-modal-smart-performance-subscribe',
	templateUrl: './modal-smart-performance-subscribe.component.html',
	styleUrls: ['./modal-smart-performance-subscribe.component.scss']
})
export class ModalSmartPerformanceSubscribeComponent implements OnInit {
	public spPaymentPageEnum: any;
	myDate = new Date();
	machineType: any;
	systemSerialNumber: any;
	systemMT: any;
	countryCode: any;
	langCode: any;
	paymentUrl: string;
	@Output() cancelPaymentRequest: EventEmitter<any> = new EventEmitter();
	public subscriptionDetails = [
		{
			UUID: uuid(),
			StartDate: formatDate(new Date(), 'yyyy/MM/dd', 'en'),
			EndDate: formatDate(this.myDate.setDate(new Date().getDate() + 90), 'yyyy/MM/dd', 'en')
		}
	];
	constructor(
		public activeModal: NgbActiveModal,
		private commonService: CommonService,
		private supportService: SupportService,
		private loggerService: LoggerService
	) {
	}

	ngOnInit() {
		this.spPaymentPageEnum = PaymentPage;
		this.supportService.getMachineInfo().then(async (machineInfo) => {
			this.loggerService.info('MachineInfo ====================================================== ', machineInfo);
			this.countryCode = machineInfo.country;
			this.systemSerialNumber = machineInfo.serialnumber; // 'PC0ZEPQ6';
			this.systemMT = machineInfo.mt;
			this.langCode = this.getSPSubscriptionSupportedLanguageFromCountry(this.countryCode);
			this.paymentUrl =
				environment.spPaymentProcessApiRoot +
				// this.countryCode +
				// this.spPaymentPageEnum.SLASH +
				// this.langCode +
				// this.spPaymentPageEnum.SLASH +
				this.spPaymentPageEnum.SERIALQUERYPARAMETER +
				this.systemSerialNumber +
				this.spPaymentPageEnum.SMARTPERFORMANCE +
				this.spPaymentPageEnum.TRUE +
				this.spPaymentPageEnum.SOURCEQUERYPARAMETER +
				this.spPaymentPageEnum.APPLICATIONNAME;

		});
	}
	confirmProcess() {
		window.open(this.paymentUrl);
		this.cancelPaymentRequest.emit();
		this.activeModal.close(true);
		const currentTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
		const intervalTime = moment(currentTime).add(PaymentPage.ORDERWAITINGTIME, 'm').format('YYYY-MM-DD HH:mm:ss');
		const modalStatus = {
			initiatedTime: intervalTime,
			isOpened: true
		};
		this.commonService.setLocalStorageValue(LocalStorageKey.SmartPerformanceSubscriptionModalStatus, modalStatus);
	}
	closeModal() {
		const modalStatus = {
			isOpened: false
		};
		this.commonService.setLocalStorageValue(LocalStorageKey.SmartPerformanceSubscriptionModalStatus, modalStatus);
		this.activeModal.close('close');
	}


	@HostListener('window: focus')
	onFocus(): void {
		const modal = document.querySelector('.subscribe-modal') as HTMLElement;
		modal.focus();
	}

	getSPSubscriptionSupportedLanguageFromCountry(countrycode) {
		let lang = 'en';
		switch (countrycode) {
			case 'zh-hans':
				lang = 'zh_CN';
				break;
			case 'zh-hant':
				lang = 'zh_HANT';
				break;
			case 'da':
				lang = 'da_DK';
				break;
			case 'de':
				lang = 'de_DE';
				break;
			case 'en':
				lang = 'en_US';
				break;
			case 'fr':
				lang = 'fr_FR';
				break;
			case 'it':
				lang = 'it_IT';
				break;
			case 'ja':
				lang = 'ja_JP';
				break;
			case 'ko':
				lang = 'ko_KR';
				break;
			case 'nb':
				lang = 'no_NO';
				break;
			case 'nl':
				lang = 'nl_NL';
				break;
			case 'pt-br':
				lang = 'pt_BR';
				break;
			case 'fi':
				lang = 'fi_FI';
				break;
			case 'es':
				lang = 'es_ES';
				break;
			case 'sv':
				lang = 'sv_SE';
				break;
			case 'ru':
				lang = 'ru_RU';
				break;
			default:
				lang = 'en';
				break;
		}
		return lang;
	}
}
