import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GamingAutoCloseService } from 'src/app/services/gaming/gaming-autoclose/gaming-autoclose.service';
import { isUndefined } from 'util';

@Component({
  selector: 'vtr-modal-add-apps',
  templateUrl: './modal-add-apps.component.html',
  styleUrls: ['./modal-add-apps.component.scss']
})
export class ModalAddAppsComponent implements OnInit {
  loading: boolean = true;
  runningList: any = [];
  noAppsRunning = false;
  addAppsList: string;
  statusAskAgain: boolean;
  @Input() showAppsModal: boolean;
  @Output() closeAddAppsModal = new EventEmitter<boolean>();
  constructor(private gamingAutoCloseService: GamingAutoCloseService) { }

  ngOnInit() {
    this.refreshRunningList();
  }

  refreshRunningList() {
    try {
      this.gamingAutoCloseService.getAppsAutoCloseRunningList().then((list: any) => {
        if (!isUndefined(list.processList)) {
          this.loading = false;
          this.runningList = list.processList;
          this.noAppsRunning = this.runningList.length === 0 ? true : false;
        }
      });
    } catch (error) {
      this.loading = false;
      console.error(error.message);
    }
  }


  AddAppsToList(event: any, index: number) {
    console.log(event.target.checked);
    console.log(event.target.value);
    if (event.target.checked) {
      this.addAppsList = event.target.value;
      try {
        this.gamingAutoCloseService.addAppsAutoCloseList(this.addAppsList).then((success: any) => {
          console.log('Added successfully ------------------------>', success);
          this.refreshAutoCloseList();
          this.refreshRunningList();
        });
      } catch (error) {
        console.error(error.message);
      }
    }
  }

  public refreshAutoCloseList() {
    this.gamingAutoCloseService.getAutoCloseListCache();
    try {
      this.gamingAutoCloseService.getAppsAutoCloseList().then((appList: any) => {
        this.gamingAutoCloseService.setAutoCloseListCache(appList.processList);
      });
    } catch (error) {
      console.error(error.message);
    }
  }

  closeModal(action: boolean) {
    this.closeAddAppsModal.emit(action);
  }
}
