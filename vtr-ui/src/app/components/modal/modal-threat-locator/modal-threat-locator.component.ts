import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'vtr-modal-threat-locator',
	templateUrl: './modal-threat-locator.component.html',
	styleUrls: ['./modal-threat-locator.component.scss']
})
export class ModalThreatLocatorComponent implements OnInit {
	constructor(
		public activeModal: NgbActiveModal
	) { }

	ngOnInit() {
	}

	closeModal() {
		this.activeModal.close('close');
	}
}
