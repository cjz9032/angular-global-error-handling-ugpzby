import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';

@Component({
  selector: 'vtr-networkboost-turn-on',
  templateUrl: './networkboost-turn-on.component.html',
  styleUrls: ['./networkboost-turn-on.component.scss']
})
export class NetworkboostTurnOnComponent implements OnInit, AfterViewInit {

  runningList: any = {};
  addAppsList: string;
  statusAskAgain: boolean;
  setAutoClose: any;
  public isChecked:any;
  constructor() { }

  @Input() showTurnOnModal: boolean;
  @Output() actionTurnOn = new EventEmitter<any>();
  @Output() actionNotNow = new EventEmitter<any>();
  @Output() closeTurnOnModal = new EventEmitter<boolean>();
  @Output() actionNeedAsk = new EventEmitter<boolean>();

  ngOnInit() {
  }
  ngAfterViewInit() {
    document.getElementById('close').focus();
  }
  async setAksAgain() {
    this.isChecked = !this.isChecked;
    this.statusAskAgain = this.isChecked;
  }

  turnOnAction(isConfirm: boolean) {
    let status = 0;
    if (this.statusAskAgain) {
        status = 2;
    }
    this.actionTurnOn.emit({isConfirm, askAgainStatus: status });
  }

  notNowAction(event) {
    let status = 0;
    if (this.statusAskAgain) {
      status = 1;
    }
    this.actionNotNow.emit({askAgainStatus: status});
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
