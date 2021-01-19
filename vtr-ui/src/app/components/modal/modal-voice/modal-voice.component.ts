import { Component, OnInit, HostListener } from '@angular/core';
import { MatDialogRef } from '@lenovo/material/dialog';

@Component({
	selector: 'vtr-modal-voice',
	templateUrl: './modal-voice.component.html',
	styleUrls: ['./modal-voice.component.scss'],
})
export class ModalVoiceComponent implements OnInit {
	constructor(public dialogRef: MatDialogRef<ModalVoiceComponent>) { }
	value: any;
	lowerCaseValue;
	metricsParent: any;
	ngOnInit() {
		this.lowerCaseValue = this.value.toLowerCase();
	}

	closeModal() {
		this.dialogRef.close('close');
	}

	@HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
		this.closeModal();
	}

	@HostListener('window: focus')
	onFocus(): void {
		const modal = document.querySelector('.Voice-Modal') as HTMLElement;
		modal.focus();
	}
}
