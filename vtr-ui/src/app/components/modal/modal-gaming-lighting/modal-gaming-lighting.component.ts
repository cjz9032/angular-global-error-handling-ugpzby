import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@lenovo/material/dialog';

@Component({
	selector: 'vtr-modal-gaming-lighting',
	templateUrl: './modal-gaming-lighting.component.html',
	styleUrls: ['./modal-gaming-lighting.component.scss'],
})
export class ModalGamingLightingComponent implements OnInit {
	constructor(public dialogRef: MatDialogRef<ModalGamingLightingComponent>) { }

	ngOnInit() { }

	closeModal() {
		this.dialogRef.close('close');
	}
}
