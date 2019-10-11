import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'vtr-modal-smart-performance-cancel',
  templateUrl: './modal-smart-performance-cancel.component.html',
  styleUrls: ['./modal-smart-performance-cancel.component.scss']
})
export class ModalSmartPerformanceCancelComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }
  closeModal() {
	this.activeModal.close('close');
}
}
