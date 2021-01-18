import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { MatDialogRef } from '@lenovo/material/dialog';
import {
	disableBackgroundNavigation,
	reEnableBackgroundNavigation,
} from '../../../services/utils/ModalBackgroundNavigationUtils';

@Component({
	selector: 'vtr-modal-recover-confirm',
	templateUrl: './modal-recover-confirm.component.html',
	styleUrls: ['./modal-recover-confirm.component.scss'],
})
export class ModalRecoverConfirmComponent implements OnInit, OnDestroy {
	@Output() confirmClicked: EventEmitter<any> = new EventEmitter();

	constructor(private dialogRef: MatDialogRef<ModalRecoverConfirmComponent>) { }

	ngOnInit() {
		disableBackgroundNavigation(document);
	}

	ngOnDestroy() {
		reEnableBackgroundNavigation(document);
	}

	public onClosing() {
		this.dialogRef.close();
	}

	public confirmClick() {
		this.confirmClicked.emit();
		this.onClosing();
	}
}
