import { Component, OnInit, Output } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'vtr-modal-update-change-log.',
	templateUrl: './modal-update-change-log.component.html',
	styleUrls: ['./modal-update-change-log.component.scss']
})
export class ModalUpdateChangeLogComponent implements OnInit {

	@Output() url: string;
	constructor(public activeModal: NgbActiveModal) { }

	ngOnInit() {
	}

}
