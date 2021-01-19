import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialogRef } from '@lenovo/material/dialog';

@Component({
	selector: 'vtr-modal-intelligent-cooling-modes',
	templateUrl: './modal-intelligent-cooling-modes.component.html',
	styleUrls: ['./modal-intelligent-cooling-modes.component.scss'],
})
export class ModalIntelligentCoolingModesComponent implements OnInit {
	constructor(public dialogRef: MatDialogRef<ModalIntelligentCoolingModesComponent>) { }

	ngOnInit() { }

	closeModal() {
		this.dialogRef.close('close');
	}
	@HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
		this.closeModal();
	}

	@HostListener('document:keydown.enter', ['$event']) onKeydownEnterHandler(
		event: KeyboardEvent
	) {
		this.closeModal();
	}
}
