import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'vtr-download-failed-modal',
	templateUrl: './download-failed-modal.component.html',
	styleUrls: ['./download-failed-modal.component.scss'],
})
export class DownloadFailedModalComponent implements OnInit {
	constructor(public activeModal: NgbActiveModal) {}
	ngOnInit() {}

	closeModal() {
		this.activeModal.close('close');
	}
}
