import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WinRT } from '@lenovo/tan-client-bridge';

@Component({
	selector: 'vtr-modal-common-confirmation',
	templateUrl: './modal-common-confirmation.component.html',
	styleUrls: ['./modal-common-confirmation.component.scss']
})
export class ModalCommonConfirmationComponent implements OnInit {
	@Input() header: string;
	@Input() description: string;
	@Input() url: string;
	// @Input() okHandler: Function;
	@Input() packages: string[];
	@Input() OkText = 'Okay';
	@Input() CancelText = 'Cancel';

	@Input() metricsParent;

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
