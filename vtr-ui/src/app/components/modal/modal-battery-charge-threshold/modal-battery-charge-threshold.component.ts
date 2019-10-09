import { Component, OnInit, HostListener } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'vtr-modal-battery-charge-threshold',
	templateUrl: './modal-battery-charge-threshold.component.html',
	styleUrls: ['./modal-battery-charge-threshold.component.scss']
})
export class ModalBatteryChargeThresholdComponent implements OnInit {

	constructor(public activeModal: NgbActiveModal) { }

	ngOnInit() {
	}

	enableBatteryChargeThreshold() {
		this.activeModal.close('enable');
	}

	closeModal() {
		this.activeModal.close('close');
	}

	@HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
		this.closeModal();
	}
}
