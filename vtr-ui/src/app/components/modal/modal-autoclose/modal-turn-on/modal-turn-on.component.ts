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
  @Output() actionNeedAsk = new EventEmitter<any>();
  ngOnInit() {
  }

  // showAddAppsModal(event: Event): void {
  //   // this.activeModal.close('close');
  //   // this.modalService
  //   //   .open(ModalAddAppsComponent, {
  //   //     backdrop: 'static',
  //   //     size: 'lg',
  //   //     windowClass: 'apps-modal-container'
  //   //   });
  //   this.gamingAutoCloseService.setAutoCloseStatus(true).then((status: any) => {
  //     this.gamingAutoCloseService.setAutoCloseStatusCache(status);
  //   });
  // }

  setAksAgain(event: any) {
    this.actionNeedAsk.emit(event.target.checked);
  }

  turnOnAction(isConfirm: boolean = false) {
    this.actionTurnOn.emit(isConfirm);
  }

  closeModal(action: boolean) {
    this.closeTurnOnModal.emit(action);
  }

}
