import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GamingAutoCloseService } from 'src/app/services/gaming/gaming-autoclose/gaming-autoclose.service';

@Component({
  selector: 'vtr-modal-add-apps',
  templateUrl: './modal-add-apps.component.html',
  styleUrls: ['./modal-add-apps.component.scss']
})
export class ModalAddAppsComponent implements OnInit {

  runningList: any;
  addAppsList: string;
  statusAskAgain: boolean;
  constructor(private activeModal: NgbActiveModal, private modalService: NgbModal, private gamingAutoCloseService: GamingAutoCloseService) { }

  ngOnInit() {
    this.displayRunningList();
  }


  displayRunningList() {
    try {
      this.gamingAutoCloseService.getAppsAutoCloseRunningList().then((list: any) => {
        this.runningList = list.processList;
      });
    } catch (error) {
      console.error(error.message);
    }
  }

  closeAddAppsModal() {
    this.activeModal.dismiss();
  }

  toggleAddAppsToList(event: any) {
    console.log(event.target.checked);
    console.log(event.target.value);
    if (event.target.checked) {
      this.addAppsList = event.target.value;
      try {
        this.gamingAutoCloseService.addAppsAutoCloseList(this.addAppsList).then((success: any) => {
          console.log('Added successfully ------------------------>', success);
        });
      } catch (error) {
        console.error(error.message);
      }
    }
  }
}
