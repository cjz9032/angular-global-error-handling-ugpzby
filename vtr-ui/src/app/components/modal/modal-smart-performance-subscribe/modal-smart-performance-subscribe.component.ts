import {
	Component,
	OnInit,
	HostListener,
	Output,
	EventEmitter,
} from '@angular/core';
import { MatDialogRef } from '@lenovo/material/dialog';

import { CommonService } from 'src/app/services/common/common.service';
import { v4 as uuid } from 'uuid';
import { formatDate } from '@angular/common';
import { SupportService } from 'src/app/services/support/support.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { PaymentPage } from 'src/app/enums/smart-performance.enum';
import { environment } from 'src/environments/environment';
import moment from 'moment';
import { SmartPerformanceService } from 'src/app/services/smart-performance/smart-performance.service';


@Component({
	selector: 'vtr-modal-smart-performance-subscribe',
	templateUrl: './modal-smart-performance-subscribe.component.html',
	styleUrls: ['./modal-smart-performance-subscribe.component.scss'],
})
export class ModalSmartPerformanceSubscribeComponent implements OnInit {
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
			EndDate: formatDate(this.myDate.setDate(new Date().getDate() + 90), 'yyyy/MM/dd', 'en'),
		},
	];
	constructor(
		public dialogRef: MatDialogRef<ModalSmartPerformanceSubscribeComponent>,
		private commonService: CommonService,
		private smartPerformanceService: SmartPerformanceService,
		private supportService: SupportService,
		private loggerService: LoggerService
	) { }

	ngOnInit() {
		this.supportService.getMachineInfo().then(async (machineInfo) => {
			this.loggerService.info(
				'MachineInfo ====================================================== ',
				machineInfo
			);
			this.countryCode = machineInfo.country;
			this.systemSerialNumber = machineInfo.serialnumber; // 'PC0ZEPQ6';
			this.systemMT = machineInfo.mt;
			this.langCode = this.getSPSubscriptionSupportedLanguageFromCountry(this.countryCode);
			this.paymentUrl = `${environment.pcsupportApiRoot}/upgradewarranty?serial=${this.systemSerialNumber}
				&smartperformance=true&source=COMPANION`;
		});
	}

	closeModal() {
		const currentTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
		const intervalTime = moment(currentTime)
			.add(PaymentPage.ORDERWAITINGTIME, 'm')
			.format('YYYY-MM-DD HH:mm:ss');
		this.smartPerformanceService.modalStatus.initiatedTime = intervalTime;
		this.smartPerformanceService.modalStatus.isGettingStatus = true;
		this.cancelPaymentRequest.emit();
		this.dialogRef.close('close');
	}

	@HostListener('document:keydown.tab', ['$event'])
	onKeyDown(event: KeyboardEvent) {
		if (
			document.activeElement &&
			document.activeElement.id.includes('smart-performance-subscribe-dialog-close-button')
		) {
			(document.querySelector('.subscribe-modal') as HTMLElement).focus();
			event.preventDefault();
			event.stopPropagation();
		}
	}

	@HostListener('window: focus', ['$event'])
	onFocus(): void {
		if (
			!document.activeElement ||
			!document.activeElement.id.includes('smart-performance-subscribe-dialog-close-button')
		) {
			const modal = document.querySelector('.subscribe-modal') as HTMLElement;
			modal.focus();
		}
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
