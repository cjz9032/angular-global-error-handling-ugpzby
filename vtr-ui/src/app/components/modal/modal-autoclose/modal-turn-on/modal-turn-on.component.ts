import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GamingAutoCloseService } from 'src/app/services/gaming/gaming-autoclose/gaming-autoclose.service';

@Component({
  selector: 'vtr-modal-turn-on',
  templateUrl: './modal-turn-on.component.html',
  styleUrls: ['./modal-turn-on.component.scss']
})
export class ModalTurnOnComponent implements OnInit {
  setAutoClose: any;
  public isChecked :any;
  constructor(private gamingAutoCloseService: GamingAutoCloseService) { }

  @Input() showTurnOnModal: boolean;
  @Output() actionTurnOn = new EventEmitter<boolean>();
  @Output() actionNotNow = new EventEmitter<boolean>();
  @Output() closeTurnOnModal = new EventEmitter<boolean>();
  @Output() actionNeedAsk = new EventEmitter<any>();
  ngOnInit() {
  }

  // setAksAgain(event: any) {
  //   this.actionNeedAsk.emit(event);
  // }

  setAksAgainbtn(){
     this.isChecked =!this.isChecked;
     this.actionNeedAsk.emit(this.isChecked);
  }

  turnOnAction(isConfirm: boolean) {
    this.actionTurnOn.emit(isConfirm);
  }

  notNowAction(event: any) {
    this.actionNotNow.emit(event);
  }

  closeModal(action: boolean) {
    this.closeTurnOnModal.emit(action);
  }

  keydownFn(event){
    if(event.which === 9){
      let txt = document.getElementById("close");
      txt.focus();
    }
  }

}
