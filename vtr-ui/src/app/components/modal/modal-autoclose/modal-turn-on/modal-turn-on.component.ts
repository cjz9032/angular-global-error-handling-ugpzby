import { Component, OnInit } from '@angular/core';
import { ModalAddAppsComponent } from '../modal-add-apps/modal-add-apps.component';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GamingAutoCloseService } from 'src/app/services/gaming/gaming-autoclose/gaming-autoclose.service';

@Component({
  selector: 'vtr-modal-turn-on',
  templateUrl: './modal-turn-on.component.html',
  styleUrls: ['./modal-turn-on.component.scss']
})
export class ModalTurnOnComponent implements OnInit {
  runningList: any;
  addAppsList: string;
  statusAskAgain: boolean;
  constructor(private activeModal: NgbActiveModal, private modalService: NgbModal, private gamingAutoCloseService: GamingAutoCloseService) { }

  ngOnInit() {
  }

  showAddAppsModal(event: Event): void {
    this.activeModal.close('close');
    this.gamingAutoCloseService.setAutoCloseStatus(true).then((status: any) => {
      this.gamingAutoCloseService.setAutoCloseStatusCache(status);
    });
    this.modalService
      .open(ModalAddAppsComponent, {
        backdrop: 'static',
        size: 'lg',
        windowClass: 'apps-modal-container'
      });
  }

  closeModal() {
    this.activeModal.close('close');
  }

  setAksAgain(event: any) {
    try {
      this.gamingAutoCloseService.setNeedToAsk(event.target.checked).then((response: any) => {
        console.log('Set successfully ------------------------>', response);
        this.gamingAutoCloseService.setNeedToAskStatusCache(event.target.checked);
      });
    } catch (error) {
      console.error(error.message);
    }
  }

}
