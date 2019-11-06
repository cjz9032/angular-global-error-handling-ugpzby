import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'vtr-modal-gaming-lighting',
  templateUrl: './modal-gaming-lighting.component.html',
  styleUrls: ['./modal-gaming-lighting.component.scss']
})
export class ModalGamingLightingComponent implements OnInit {

	constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  closeModal() {
	this.activeModal.close('close');
}


}
