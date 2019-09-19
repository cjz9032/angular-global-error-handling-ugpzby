import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'vtr-modal-app-update-available',
	templateUrl: './modal-app-update-available.component.html',
	styleUrls: ['./modal-app-update-available.component.scss']
})
export class ModalAppUpdateAvailableComponent implements OnInit {

	constructor(public activeModal: NgbActiveModal) { }

	ngOnInit() {
	}

	public onUpdateClick() {
		this.activeModal.close(true);
	}

	public onCancelClick() {
		this.activeModal.close(false);
	}

}
