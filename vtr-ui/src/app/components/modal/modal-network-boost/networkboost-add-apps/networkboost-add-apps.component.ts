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
  @Output() closeAddAppsModal = new EventEmitter<boolean>();
  constructor(private networkBoostService: NetworkBoostService) { }

  ngOnInit() {
    this.refreshNetworkBoostList();
  }

  async addAppsToList(event: any, index: number) {
    if (event && event.target && event.target.checked) {
      this.addAppsList = event.target.value;
      try {
        console.log('THIS IS THE ADD', this.addAppsList);
        const result = await this.networkBoostService.addProcessToNetworkBoost(this.addAppsList);
        console.log(`Another adding process to network bosst for => `, result);
        this.refreshNetworkBoostList();
        // this.networkBoostService.addProcessToNetworkBoost(this.addAppsList).then(res => {
        //   console.log(`Another adding process to network bosst for .then => `, res);
        //   this.refreshNetworkBoostList();
        // });
        console.log(`After adding process to network bosst => `);
      } catch (error) {
        console.log(`ERROR in addAppsToList()`, error);
      }
    }
  }

  async refreshNetworkBoostList() {
    try {
      const result: any = await this.networkBoostService.getNetUsingProcesses();
      console.log('RESULT frpm NB', result);
      if (!isUndefined(result.processList)) {
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
