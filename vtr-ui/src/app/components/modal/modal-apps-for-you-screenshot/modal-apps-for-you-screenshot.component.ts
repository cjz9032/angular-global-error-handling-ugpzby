import { Component, OnInit, OnDestroy, AfterViewInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'vtr-modal-apps-for-you-screenshot',
	templateUrl: './modal-apps-for-you-screenshot.component.html',
	styleUrls: ['./modal-apps-for-you-screenshot.component.scss']
})
export class ModalAppsForYouScreenshotComponent implements OnInit, OnDestroy, AfterViewInit {

	@Input() image: string;


	constructor(
		public activeModal: NgbActiveModal,
	) { }

	ngOnInit() {

	}

	ngAfterViewInit() {

	}

	ngOnDestroy() {

	}

	closeModal() {
		this.activeModal.close('close');
	}


}
