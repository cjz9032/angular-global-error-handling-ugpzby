import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { MatDialogRef } from '@lenovo/material/dialog';

@Component({
	selector: 'vtr-modal-recover-confirm',
	templateUrl: './modal-recover-confirm.component.html',
	styleUrls: ['./modal-recover-confirm.component.scss'],
})
export class ModalRecoverConfirmComponent {
	@Output() confirmClicked: EventEmitter<any> = new EventEmitter();

	constructor(private dialogRef: MatDialogRef<ModalRecoverConfirmComponent>) {}

	public onClosing() {
		this.dialogRef.close();
	}

	public confirmClick() {
		this.confirmClicked.emit();
		this.onClosing();
	}
}
