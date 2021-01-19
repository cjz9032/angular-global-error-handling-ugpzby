import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@lenovo/material/dialog';

@Component({
	selector: 'vtr-download-failed-modal',
	templateUrl: './download-failed-modal.component.html',
	styleUrls: ['./download-failed-modal.component.scss'],
})
export class DownloadFailedModalComponent implements OnInit {
	constructor(
		public dialogRef: MatDialogRef<DownloadFailedModalComponent>
	) { }
	ngOnInit() { }

	closeModal() {
		this.dialogRef.close('close');
	}
}
