import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'vtr-modal-smart-performance-subscribe',
  templateUrl: './modal-smart-performance-subscribe.component.html',
  styleUrls: ['./modal-smart-performance-subscribe.component.scss']
})
export class ModalSmartPerformanceSubscribeComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }
  closeModal() {
    this.activeModal.close('close');
}
}
