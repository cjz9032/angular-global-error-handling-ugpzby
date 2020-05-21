import { Component, OnInit, HostListener } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'vtr-modal-battery-charge-threshold',
	templateUrl: './modal-battery-charge-threshold.component.html',
	styleUrls: ['./modal-battery-charge-threshold.component.scss']
})
export class ModalBatteryChargeThresholdComponent implements OnInit {
	title: string;
	id: string;
	description1: string;
	description2: string;
	positiveResponseText: string;
	negativeResponseText: string;
	buttonId: string;
	constructor(public activeModal: NgbActiveModal, public translate: TranslateService) { }

	ngOnInit() {
		this.buttonId = this.translate.instant(this.positiveResponseText);
		const modal = document.querySelector('.close-btn') as HTMLElement;
		modal.focus();
	}

	enableBatteryChargeThreshold() {
		this.activeModal.close('positive');
	}

	closeModal() {
		this.activeModal.close('negative');
	}

	@HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
		this.closeModal();
	}

}
