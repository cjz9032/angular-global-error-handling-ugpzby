import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'vtr-modal-common-confirmation',
  templateUrl: './modal-common-confirmation.component.html',
  styleUrls: ['./modal-common-confirmation.component.scss']
})
export class ModalCommonConfirmationComponent implements OnInit {
	title: string;
	body: string;
	packages: string[];

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  closeModal() {
	this.activeModal.close('close');
}
}
