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
  @Output() actionNotNow = new EventEmitter<boolean>();
  @Output() closeTurnOnModal = new EventEmitter<boolean>();
  @Output() actionNeedAsk = new EventEmitter<boolean>();
  ngOnInit() {
  }

  setAksAgain(event: any) {
    const status = event.target.checked;
    try {
      this.gamingAutoCloseService.setNeedToAsk(!status).then((response: any) => {
        console.log('Set successfully ------------------------>', !status);
        this.gamingAutoCloseService.setNeedToAskStatusCache(!status);
        this.actionNeedAsk.emit(!status);
      });
    } catch (error) {
      console.error(error.message);
    }
  }

  turnOnAction(isConfirm: boolean) {
    this.actionTurnOn.emit(isConfirm);
  }

  notNowAction(event) {
    this.actionNotNow.emit(event);
  }

  closeModal(action: boolean) {
    this.closeTurnOnModal.emit(action);
  }

}
