import { Component, OnInit, HostListener } from '@angular/core';
import { MatDialogRef } from '@lenovo/material/dialog';

@Component({
	selector: 'vtr-modal-app-update-available',
	templateUrl: './modal-app-update-available.component.html',
	styleUrls: ['./modal-app-update-available.component.scss'],
})
export class ModalAppUpdateAvailableComponent implements OnInit {
	constructor(
		public dialogRef: MatDialogRef<ModalAppUpdateAvailableComponent>
	) { }

	ngOnInit() { }

	public onUpdateClick() {
		this.dialogRef.close(true);
	}

	public onCancelClick() {
		this.dialogRef.close(false);
	}

	@HostListener('window: focus')
	onFocus(): void {
		const modal = document.querySelector('.confirmation-modal') as HTMLElement;
		modal.focus();
	}
}
