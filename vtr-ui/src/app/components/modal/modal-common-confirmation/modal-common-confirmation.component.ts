import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { WinRT } from '@lenovo/tan-client-bridge';
import { MatDialogRef } from '@lenovo/material/dialog';


@Component({
	selector: 'vtr-modal-common-confirmation',
	templateUrl: './modal-common-confirmation.component.html',
	styleUrls: ['./modal-common-confirmation.component.scss'],
})
export class ModalCommonConfirmationComponent implements OnInit {
	@Input() header: string;
	@Input() description: string;
	@Input() url: string;
	// @Input() okHandler: Function;
	@Input() packages: string[];
	@Input() OkText = 'systemUpdates.popup.okayButton';
	@Input() CancelText = 'systemUpdates.popup.cancelButton';

	@Input() metricsParent;

	@Output() OkClick = new EventEmitter<any>();
	@Output() CancelClick = new EventEmitter<any>();
	okButtonId: string;

	constructor(
		public dialogRef: MatDialogRef<ModalCommonConfirmationComponent>
	) { }

	ngOnInit() {
		this.okButtonId = this.OkText.replace(/\./g, '_');
	}

	public onOkClick($event: any) {
		this.dialogRef.close(true);
		if (this.url && this.url.trim().length > 0) {
			WinRT.launchUri(this.url);
		}
		// this.okHandler();
	}

	public onCancelClick($event: any) {
		this.dialogRef.close(false);
	}
}
