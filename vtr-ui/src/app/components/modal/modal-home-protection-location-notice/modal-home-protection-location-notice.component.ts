import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { WinRT, WifiSecurity } from '@lenovo/tan-client-bridge';

@Component({
	selector: 'vtr-modal-home-protection-location-notice',
	templateUrl: './modal-home-protection-location-notice.component.html',
	styleUrls: ['./modal-home-protection-location-notice.component.scss'],
})
export class ModalHomeProtectionLocationNoticeComponent implements OnInit {
	@Input() header: string;
	@Input() description: string;
	@Input() url: string;
	@Input() wifiSecurity: WifiSecurity;
	@Input() packages: string[];
	@Input() OkText = 'security.wifisecurity.locationmodal.agree';
	@Input() CancelText = 'security.wifisecurity.locationmodal.cancel';

	@Output() OkClick = new EventEmitter<any>();
	@Output() CancelClick = new EventEmitter<any>();

	constructor() { }

	ngOnInit() { }

	public onOkClick($event: any) {
		WinRT.launchUri(this.url);
	}
}
