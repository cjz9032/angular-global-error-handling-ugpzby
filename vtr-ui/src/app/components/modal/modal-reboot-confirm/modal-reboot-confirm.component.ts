import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@lenovo/material/dialog';

@Component({
	selector: 'vtr-modal-reboot-confirm',
	templateUrl: './modal-reboot-confirm.component.html',
	styleUrls: ['./modal-reboot-confirm.component.scss'],
})
export class ModalRebootConfirmComponent implements OnInit {
	public description: string;
	@ViewChild('btnClose', { static: true }) set btnClose(element: ElementRef) {
		if (element) {
			if (element.nativeElement) {
				element.nativeElement.focus();
			}
		}
	}

	constructor(public dialogRef: MatDialogRef<ModalRebootConfirmComponent>) { }

	ngOnInit() {
		this.btnClose.nativeElement.focus();
	}

	proceedToReboot() {
		this.dialogRef.close('enable');
	}

	closeModal() {
		this.dialogRef.close('close');
	}

	@HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
		this.closeModal();
	}
}
