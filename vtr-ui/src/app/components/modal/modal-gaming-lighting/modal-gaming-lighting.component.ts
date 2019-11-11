import { Component, OnInit, HostListener } from '@angular/core';
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

  @HostListener('window: focus')
  onFocus(): void {
    const modal = document.querySelector('.gaming-help-modal') as HTMLElement;
    modal.focus();
  }


}
