import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'vtr-modal-zero-touch-lock-facial-recognition',
  templateUrl: './modal-zero-touch-lock-facial-recognition.component.html',
  styleUrls: ['./modal-zero-touch-lock-facial-recognition.component.scss']
})


export class ModalZeroTouchLockFacialRecognitionComponent implements OnInit {

  // public paEvent = {
  //   Active: 'active',
  //   Cancel: 'cancel',
  //   Close: 'close'
  // }
  constructor( public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  enableFacialRecognition() {
    this.activeModal.close('enable');
  }

  closeModal() {
    this.activeModal.close('cancel');
  }

}
