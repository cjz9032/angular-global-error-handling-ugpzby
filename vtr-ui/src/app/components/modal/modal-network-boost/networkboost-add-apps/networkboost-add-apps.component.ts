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
	constructor(private networkBoostService: NetworkBoostService) {}

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
			const result = await this.networkBoostService.addProcessToNetworkBoost(
				app
			);
			if (result) {
				this.addedApps += 1;
			}
		} catch (error) {}
	}
	async removeApp(app) {
		try {
			const result = await this.networkBoostService.deleteProcessInNetBoost(
				app
			);
			if (result) {
				this.addedApps -= 1;
			}
		} catch (err) {}
	}

	async refreshNetworkBoostList() {
		try {
			const result: any = await this.networkBoostService.getNetUsingProcesses();
			console.log('RESULT frpm NB', result);
			this.loading = false;
			this.runningList = [];
			if (result && !isUndefined(result.processList)) {
				this.runningList = result.processList || [];
			}
			this.noAppsRunning = this.runningList.length === 0 ? true : false;
		} catch (error) {
			this.loading = false;
			this.noAppsRunning = true;
			console.log(`ERROR in refreshNetworkBoostList()`, error);
		}
	}

	closeModal(action: boolean) {
		this.closeAddAppsModal.emit(action);
	}
}
