import { GamingAutoCloseService } from 'src/app/services/gaming/gaming-autoclose/gaming-autoclose.service';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'vtr-modal-networkboost',
  templateUrl: './modal-networkboost.component.html',
  styleUrls: ['./modal-networkboost.component.scss']
})
export class ModalNetworkboostComponent implements OnInit {

  @Input() modalContent: any;
  @Output() action = new EventEmitter<boolean>();
  runningList: any[] = [];
  constructor(private activeModal: NgbActiveModal, private modalService: NgbModal, private gamingAutoCloseService: GamingAutoCloseService) { }

  ngOnInit() {
    this.displayRunningList();
  }


  public displayRunningList() {
    try {
      this.gamingAutoCloseService.getAppsAutoCloseRunningList().then((list: any) => {
        console.log('get Running list from js bridge ------------------------>', list);

        this.runningList = list.processList;
      });
    } catch (error) {
      console.error(error.message);
    }
  }

  showAddAppsModal(content: any): void {
    this.activeModal.close('close');
    this.modalService
      .open(content, {
        backdrop: 'static',
        size: 'lg',
        windowClass: 'apps-modal-container'
      });
  }

  closeModal() {
    this.activeModal.close('close');
  }
  addAppsToList(event, i) {

  }
}
