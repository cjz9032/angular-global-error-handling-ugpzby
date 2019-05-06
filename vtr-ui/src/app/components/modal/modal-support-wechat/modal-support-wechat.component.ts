import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WinRT } from '@lenovo/tan-client-bridge';

@Component({
	selector: 'vtr-modal-support-wechat',
	templateUrl: './modal-support-wechat.component.html',
	styleUrls: ['./modal-support-wechat.component.scss']
})
export class ModalSupportWechatComponent implements OnInit {

	@Input() header: string;
	@Input() description: string;
	@Input() url: string;
	// @Input() okHandler: Function;
	@Input() packages: string[];
	@Input() OkText = 'Okay';
	@Input() CancelText = 'Cancel';

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
		if (this.url && this.url.trim().length > 0) {
			WinRT.launchUri(this.url);
		}
		// this.okHandler();
	}

	public onCancelClick($event: any) {
		this.activeModal.close(false);
	}
}
