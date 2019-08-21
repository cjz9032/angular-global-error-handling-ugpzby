import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'vtr-modal-reboot-confirm',
  templateUrl: './modal-reboot-confirm.component.html',
  styleUrls: ['./modal-reboot-confirm.component.scss']
})
export class ModalRebootConfirmComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }
	proceedToReboot() {
		this.activeModal.close('enable');
	}

	closeModal() {
		this.activeModal.close('close');
	}
}
