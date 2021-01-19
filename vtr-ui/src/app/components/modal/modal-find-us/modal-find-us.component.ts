import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@lenovo/material/dialog';
import { LocalInfoService } from 'src/app/services/local-info/local-info.service';

@Component({
	selector: 'vtr-modal-find-us',
	templateUrl: './modal-find-us.component.html',
	styleUrls: ['./modal-find-us.component.scss'],
})
export class ModalFindUsComponent implements OnInit {
	region: string;

	constructor(
		public dialogRef: MatDialogRef<ModalFindUsComponent>,
		private localInfoService: LocalInfoService
	) {
		localInfoService
			.getLocalInfo()
			.then((result) => {
				this.region = result.GEO;
			})
			.catch((e) => {
				this.region = 'us';
			});
	}

	ngOnInit() { }

	closeModal() {
		this.dialogRef.close(false);
	}
}
