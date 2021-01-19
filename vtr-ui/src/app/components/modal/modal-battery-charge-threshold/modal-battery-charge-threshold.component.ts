import { Component, OnInit, HostListener } from '@angular/core';
import { MatDialogRef } from '@lenovo/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { BatteryDetailService } from 'src/app/services/battery-detail/battery-detail.service';

@Component({
	selector: 'vtr-modal-battery-charge-threshold',
	templateUrl: './modal-battery-charge-threshold.component.html',
	styleUrls: ['./modal-battery-charge-threshold.component.scss'],
})
export class ModalBatteryChargeThresholdComponent implements OnInit {
	title: string;
	id: string;
	description1: string;
	description2: string;
	positiveResponseText: string;
	negativeResponseText: string;
	buttonId: string;

	constructor(
		public dialogRef: MatDialogRef<ModalBatteryChargeThresholdComponent>,
		public translate: TranslateService,
		public batteryService: BatteryDetailService
	) { }

	ngOnInit() {
		this.batteryService.currentOpenModal = this.id;
		this.buttonId = this.translate.instant(this.positiveResponseText);
	}

	onPositiveButtonClick() {
		this.dialogRef.close('positive');
	}

	closeModal() {
		this.dialogRef.close('negative');
	}

	@HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
		this.closeModal();
	}
}
