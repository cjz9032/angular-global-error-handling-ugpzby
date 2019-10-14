import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'vtr-modal-battery-charge-threshold',
	templateUrl: './modal-battery-charge-threshold.component.html',
	styleUrls: ['./modal-battery-charge-threshold.component.scss']
})
export class ModalBatteryChargeThresholdComponent implements OnInit {
	title: string;
	description1: string;
	description2: string;
	positiveResponseText: string;
	negativeResponseText: string;

	constructor(public activeModal: NgbActiveModal) { }

	ngOnInit() {
	}

	enableBatteryChargeThreshold() {
		this.activeModal.close('positive');
	}

	closeModal() {
		this.activeModal.close('negative');
	}
}
