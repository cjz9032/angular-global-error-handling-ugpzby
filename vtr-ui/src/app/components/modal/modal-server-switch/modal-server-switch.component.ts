import { Component, OnInit, ElementRef, HostListener, SecurityContext } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {ServerSwitch} from '../../../data-models/server-switch/server-switch.model'

@Component({
  selector: 'vtr-modal-server-switch',
  templateUrl: './modal-server-switch.component.html',
  styleUrls: ['./modal-server-switch.component.scss']
})
export class ModalServerSwitchComponent implements OnInit {

  serverSwitchTitle: any = 'Server Switch Feature';
  serverSwitchData: ServerSwitch;

  constructor(
    public activeModal: NgbActiveModal,
		private sanitizer: DomSanitizer,
    private element: ElementRef
    ) { }

  ngOnInit() {
  }

  closeModal() {
    this.activeModal.close('close');
  }

  @HostListener('document:keydown.escape', ['$event'])
	onClickEscape() {
		this.closeModal();
	}

}
