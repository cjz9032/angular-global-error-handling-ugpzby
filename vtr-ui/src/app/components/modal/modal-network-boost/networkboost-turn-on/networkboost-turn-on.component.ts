import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'vtr-networkboost-turn-on',
  templateUrl: './networkboost-turn-on.component.html',
  styleUrls: ['./networkboost-turn-on.component.scss']
})
export class NetworkboostTurnOnComponent implements OnInit {

  runningList: any = {};
  addAppsList: string;
  statusAskAgain: boolean;
  setAutoClose: any;
  constructor() { }

  @Input() showTurnOnModal: boolean;
  @Output() actionTurnOn = new EventEmitter<any>();
  @Output() actionNotNow = new EventEmitter<any>();
  @Output() closeTurnOnModal = new EventEmitter<boolean>();
  @Output() actionNeedAsk = new EventEmitter<boolean>();

  ngOnInit() {
  }

  async setAksAgain(event: any) {
    this.statusAskAgain = event.target.checked;
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
}
