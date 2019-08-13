import { CommonService } from 'src/app/services/common/common.service';
import { NetworkBoostService } from './../../../../services/gaming/gaming-networkboost/networkboost.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { isUndefined } from 'util';

@Component({
  selector: 'vtr-networkboost-add-apps',
  templateUrl: './networkboost-add-apps.component.html',
  styleUrls: ['./networkboost-add-apps.component.scss']
})
export class NetworkboostAddAppsComponent implements OnInit {
  loading = true;
  runningList: any = [];
  noAppsRunning = false;
  addAppsList: string;
  statusAskAgain: boolean;
  @Input() showAppsModal: boolean;
  @Input() addedApps = 0;
  maxAppsCount = 5;
  @Output() closeAddAppsModal = new EventEmitter<boolean>();
  constructor(private networkBoostService: NetworkBoostService) { }

  ngOnInit() {
    this.refreshNetworkBoostList();
  }

  async onValueChange(event: any) {
    if (event && event.target) {
      this.addAppsList = event.target.value;
      if (event.target.checked) {
        this.addAppToList(event.target.value);
      } else {
        this.removeApp(event.target.value);
      }
      
    }
  }
  
async addAppToList(app) {
  try {
    const result = await this.networkBoostService.addProcessToNetworkBoost(app);
    if (result) {
      this.addedApps += 1;
    }
    console.log(`Another adding process to network bosst for => `, result);
  } catch (error) {
    console.log(`ERROR in addAppsToList()`, error);
  }
}
  async removeApp(app) {
    try {
      const result = await this.networkBoostService.deleteProcessInNetBoost(app);
      console.log(`RESULT from deleteProcessInNetBoost()`, result);
      if (result) {
        this.addedApps -= 1;
      }
    } catch (err) {
      console.log(`ERROR in removeApp()`, err);
    }
  }

  async refreshNetworkBoostList() {
    try {
      const result: any = await this.networkBoostService.getNetUsingProcesses();
      console.log('RESULT frpm NB', result);
      if (result && !isUndefined(result.processList)) {
        this.loading = false;
        this.runningList = result.processList || [];
        this.noAppsRunning = this.runningList.length === 0 ? true : false;
      }
    } catch (error) {
      console.log(`ERROR in refreshNetworkBoostList()`, error);
    }
  }

  closeModal(action: boolean) {
    this.closeAddAppsModal.emit(action);
  }
}
