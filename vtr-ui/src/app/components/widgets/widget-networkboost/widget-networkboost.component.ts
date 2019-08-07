import { isUndefined } from 'util';
import { NetworkBoostService } from 'src/app/services/gaming/gaming-networkboost/networkboost.service';
import { GamingAllCapabilitiesService } from './../../../services/gaming/gaming-capabilities/gaming-all-capabilities.service';
import { GamingAllCapabilities } from './../../../data-models/gaming/gaming-all-capabilities';
import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'vtr-widget-networkboost',
	templateUrl: './widget-networkboost.component.html',
	styleUrls: ['./widget-networkboost.component.scss']
})
export class WidgetNetworkboostComponent implements OnInit, OnChanges {
	@Input() introTitle: string;
	@Input() changeNum: any = 0;
	@Output() actionModal = new EventEmitter<any>();

	public title: string;
	public networkBoostStatus = false;
	runningAppsList = [];
	gamingProperties: GamingAllCapabilities = new GamingAllCapabilities();
	constructor(private networkBoostService: NetworkBoostService) { }

	ngOnInit() {
		this.title = this.introTitle;
		this.getNetworkBoostList();
	}

	ngOnChanges(changes: any) {
		this.getNetworkBoostList();
	}
	public openModal() {
		this.actionModal.emit();
	}

	async getNetworkBoostList() {
		try {
			const appList: any = await this.networkBoostService.getNetworkBoostList();
			if (!isUndefined(appList.processList)) {
				this.runningAppsList = appList.processList;
			}
		} catch (error) {
			console.log(`ERROR in getNetworkBoostList()`, error.message);
		}
	}

	async removeApp(app: any, i: any) {
		try {
			const result = await this.networkBoostService.deleteProcessInNetBoost(app);
			console.log(`RESULT from deleteProcessInNetBoost()`, result);
			this.getNetworkBoostList();
		} catch (err) {
			console.log(`ERROR in removeApp()`, err);
		}
	}
}
