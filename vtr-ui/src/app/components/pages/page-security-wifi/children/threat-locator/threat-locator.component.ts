import { Component, OnInit } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalThreatLocatorComponent } from 'src/app/components/modal/modal-threat-locator/modal-threat-locator.component';

@Component({
	selector: 'vtr-threat-locator',
	templateUrl: './threat-locator.component.html',
	styleUrls: ['./threat-locator.component.scss']
})
export class ThreatLocatorComponent implements OnInit {
	locatorButtonDisable = false;
	constructor(
		public modalService: NgbModal
	) {}

	ngOnInit() {	}

	openThreatLocator() {
		if (this.modalService.hasOpenModals()) {
			return;
		}
		this.locatorButtonDisable = true;
		const threatLocatorModal: NgbModalRef = this.modalService.open(ModalThreatLocatorComponent, {
			backdrop: true,
			size: 'lg',
			centered: true,
			windowClass: 'Threat-Locator-Modal'
		});
		setTimeout(() => {
			document.getElementById('modal-threat-locator').parentElement.parentElement.parentElement.parentElement.focus();
		}, 0);
		threatLocatorModal.result.then(() => {
			this.locatorButtonDisable = false;
		}).catch(() => {
			this.locatorButtonDisable = false;
		});
	}
}
