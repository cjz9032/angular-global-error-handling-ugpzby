import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'vtr-modal-autoclose',
  templateUrl: './modal-autoclose.component.html',
  styleUrls: ['./modal-autoclose.component.scss']
})
export class ModalAutocloseComponent implements OnInit {

  @Input() modalContent: any;
  @Output() action = new EventEmitter<boolean>();
  constructor(private activeModal: NgbActiveModal, private modalService: NgbModal) { }

  ngOnInit() {
  }

  showAddAppsModal(content: any): void {
    this.activeModal.close('close');
    this.modalService
      .open(content, {
        backdrop: 'static',
        size: 'lg',
        windowClass: 'apps-modal-container'
      })
  }

  closeModal() {
    this.activeModal.close('close');
  }
}
