import { Component, OnInit, HostListener } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { Router } from '@angular/router';
import { v4 as uuid } from 'uuid';
import { formatDate } from '@angular/common';
import { SupportService } from 'src/app/services/support/support.service';
import { LoggerService } from 'src/app/services/logger/logger.service';

@Component({
	selector: 'vtr-modal-smart-performance-subscribe',
	templateUrl: './modal-smart-performance-subscribe.component.html',
	styleUrls: [ './modal-smart-performance-subscribe.component.scss' ]
})
export class ModalSmartPerformanceSubscribeComponent implements OnInit {
	
	myDate = new Date();
	machineType: any;
	systemSerialNumber: any;
	systemMT: any;
	countryCode: any;
	langCode: any;
	paymenturl: string;

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
		
	}
	closeModal() {
		this.activeModal.close('close');
	}
	selectBilledMonthly() {
	
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
