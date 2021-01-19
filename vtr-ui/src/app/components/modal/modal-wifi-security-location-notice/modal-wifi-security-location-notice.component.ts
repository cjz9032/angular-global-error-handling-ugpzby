import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { WinRT, WifiSecurity } from '@lenovo/tan-client-bridge';
import { CommonService } from 'src/app/services/common/common.service';
import { SessionStorageKey } from 'src/app/enums/session-storage-key-enum';
import { MatDialogRef } from '@lenovo/material/dialog';

@Component({
	selector: 'vtr-modal-wifi-security-location-notice',
	templateUrl: './modal-wifi-security-location-notice.component.html',
	styleUrls: ['./modal-wifi-security-location-notice.component.scss'],
})
export class ModalWifiSecurityLocationNoticeComponent implements OnInit {
	@Input() header: string;
	@Input() description: string;
	@Input() url: string;
	@Input() wifiSecurity: WifiSecurity;
	@Input() closeButtonId: string;
	@Input() agreeButtonId: string;
	@Input() cancelButtonId: string;
	@Input() packages: string[];
	@Input() OkText = 'security.wifisecurity.locationmodal.agree';
	@Input() CancelText = 'security.wifisecurity.locationmodal.cancel';

	@Output() OkClick = new EventEmitter<any>();
	@Output() CancelClick = new EventEmitter<any>();

	constructor(
		private commonService: CommonService,
		private dialogRef: MatDialogRef<ModalWifiSecurityLocationNoticeComponent>,
	) { }

	ngOnInit() { }

	public onOkClick() {
		this.dialogRef.close();
		this.commonService.setSessionStorageValue(
			SessionStorageKey.SecurityWifiSecurityLocationFlag,
			'yes'
		);
		WinRT.launchUri(this.url);
	}

	public onCancelClick() {
		this.commonService.setSessionStorageValue(
			SessionStorageKey.SecurityWifiSecurityLocationFlag,
			'no'
		);
		this.dialogRef.close('cancelClick');
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
