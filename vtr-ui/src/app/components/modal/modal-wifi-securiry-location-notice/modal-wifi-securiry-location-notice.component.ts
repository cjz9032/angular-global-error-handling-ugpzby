import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WinRT } from '@lenovo/tan-client-bridge';

@Component({
	selector: 'vtr-modal-wifi-securiry-location-notice',
	templateUrl: './modal-wifi-securiry-location-notice.component.html',
	styleUrls: ['./modal-wifi-securiry-location-notice.component.scss']
})
export class ModalWifiSecuriryLocationNoticeComponent implements OnInit {

	@Input() header: string;
	@Input() description: string;
	@Input() url: string;
	// @Input() okHandler: Function;
	@Input() packages: string[];
	@Input() OkText = 'security.wifisecurity.locationmodal.agree';
	@Input() CancelText = 'security.wifisecurity.locationmodal.cancel';

	@Output() OkClick = new EventEmitter<any>();
	@Output() CancelClick = new EventEmitter<any>();

	constructor(public activeModal: NgbActiveModal) { }

	ngOnInit() {
	}

	// closeModal() {
	// 	this.activeModal.close('close');
	// }

	public onOkClick($event: any) {
		this.activeModal.close(true);
		WinRT.launchUri(this.url);
		// this.okHandler();
	}

	public onCancelClick($event: any) {
		this.activeModal.close(false);
	}
}

