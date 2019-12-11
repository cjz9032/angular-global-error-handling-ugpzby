import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WinRT, WifiSecurity } from '@lenovo/tan-client-bridge';

@Component({
	selector: 'vtr-modal-home-protection-location-notice',
	templateUrl: './modal-home-protection-location-notice.component.html',
	styleUrls: ['./modal-home-protection-location-notice.component.scss']
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

	constructor(public activeModal: NgbActiveModal) { }

	ngOnInit() {
	}

	public onOkClick($event: any) {
		this.activeModal.close(true);
		WinRT.launchUri(this.url);
	}

	public onCancelClick($event: any) {
		this.activeModal.close(false);
	}

	@HostListener('window: focus')
	onFocus(): void {
		const modal = document.querySelector('.wifi-security-location-modal') as HTMLElement;
		modal.focus();
	}
}

