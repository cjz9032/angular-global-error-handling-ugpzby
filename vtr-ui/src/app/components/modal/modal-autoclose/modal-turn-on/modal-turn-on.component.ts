import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GamingAutoCloseService } from 'src/app/services/gaming/gaming-autoclose/gaming-autoclose.service';

@Component({
  selector: 'vtr-modal-turn-on',
  templateUrl: './modal-turn-on.component.html',
  styleUrls: ['./modal-turn-on.component.scss']
})
export class ModalTurnOnComponent implements OnInit {
  runningList: any = {};
  addAppsList: string;
  statusAskAgain: boolean;
  setAutoClose: any;
  constructor(private gamingAutoCloseService: GamingAutoCloseService) { }

  @Input() showTurnOnModal: boolean;
  @Output() actionTurnOn = new EventEmitter<boolean>();
  @Output() closeTurnOnModal = new EventEmitter<boolean>();
  @Output() actionNeedAsk = new EventEmitter<boolean>();
  ngOnInit() {
  }

  setAksAgain(event: any) {
    this.actionNeedAsk.emit(event.target.checked);
  }

  turnOnAction(isConfirm) {
    this.actionTurnOn.emit(isConfirm);
  }

  closeModal(action: boolean) {
    this.closeTurnOnModal.emit(action);
  }

}
