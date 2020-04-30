import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'vtr-modal-gaming-prompt',
  templateUrl: './modal-gaming-prompt.component.html',
  styleUrls: ['./modal-gaming-prompt.component.scss']
})
export class ModalGamingPromptComponent implements OnInit {
  @Output() emitService = new EventEmitter();
  public info:any = {};
  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    setTimeout(()=>{
      document.getElementById('gaming-advanced-prompt-close').focus(); 
    },230)
  }
  emitFn(info) {
    this.emitService.next(info)
  }
  closeModal() {
    this.emitFn(0);
		this.activeModal.close('close');
  }
  
  confirmFn(){
    this.emitFn(1);
    this.activeModal.close('close');
  }
  
  cancleFn() {
    this.emitFn(2);
    this.activeModal.close('close');
  }
}
