import { Component, OnInit, HostListener } from '@angular/core';
import { MatDialogRef } from '@lenovo/material/dialog';

@Component({
	selector: 'vtr-modal-ai-meeting-manager',
	templateUrl: './modal-ai-meeting-manager.component.html',
	styleUrls: ['./modal-ai-meeting-manager.component.scss'],
})
export class ModalAiMeetingManagerComponent implements OnInit {
	constructor(public dialogRef: MatDialogRef<ModalAiMeetingManagerComponent>) {}
	value: any;
	metricsParent: any;
	serialNumbers: number[];
	ngOnInit() {
		switch (this.value) {
			case 'translation':
				this.serialNumbers = [1, 2, 3, 4, 5];
				break;
			case 'voiceToText':
				this.serialNumbers = [1, 2, 3, 4, 5];
				break;
			case 'noteEditor':
				this.serialNumbers = [1, 2, 3, 4];
				break;
			default:
				break;
		}
	}

	closeModal() {
		this.dialogRef.close('close');
	}

	@HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
		this.closeModal();
	}
}
