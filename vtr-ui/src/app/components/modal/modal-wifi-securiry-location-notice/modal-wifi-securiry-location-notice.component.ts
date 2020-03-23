import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WinRT, WifiSecurity } from '@lenovo/tan-client-bridge';
import { CommonService } from 'src/app/services/common/common.service';
import { SessionStorageKey } from 'src/app/enums/session-storage-key-enum';
import { WifiHomeViewModel } from 'src/app/data-models/security-advisor/wifisecurity.model';

@Component({
	selector: 'vtr-modal-wifi-securiry-location-notice',
	templateUrl: './modal-wifi-securiry-location-notice.component.html',
	styleUrls: ['./modal-wifi-securiry-location-notice.component.scss']
})
export class ModalWifiSecuriryLocationNoticeComponent implements OnInit {

	@Input() header: string;
	@Input() description: string;
	@Input() url: string;
	@Input() wifiSecurity: WifiSecurity;
	// @Input() okHandler: Function;
	@Input() closeButtonId: string;
	@Input() agreeButtonId: string;
	@Input() cancelButtonId: string;
	@Input() packages: string[];
	@Input() OkText = 'security.wifisecurity.locationmodal.agree';
	@Input() CancelText = 'security.wifisecurity.locationmodal.cancel';

	@Output() OkClick = new EventEmitter<any>();
	@Output() CancelClick = new EventEmitter<any>();

	constructor(public activeModal: NgbActiveModal, private commonService: CommonService) { }

	ngOnInit() {
	}


	// closeModal() {
	// 	this.activeModal.close('close');
	// }

	public onOkClick($event: any) {
		this.activeModal.close(true);
		this.commonService.setSessionStorageValue(SessionStorageKey.SecurityWifiSecurityLocationFlag, 'yes');
		WinRT.launchUri(this.url);
		// this.okHandler();
	}

	public onCancelClick($event: any) {
		this.commonService.setSessionStorageValue(SessionStorageKey.SecurityWifiSecurityLocationFlag, 'no');
		this.activeModal.close('cancelClick');
		document.getElementById('main-wrapper').focus();
	}

	keydownFn(event) {
		if (event.which === 9) {
			document.getElementById('wifi-sec-modal').focus();
		}
	}

	@HostListener('window: focus')
	onFocus(): void {
		const modal = document.querySelector('.wifi-security-location-modal') as HTMLElement;
		modal.focus();
	}
}

