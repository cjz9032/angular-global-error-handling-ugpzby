import { CommonService } from 'src/app/services/common/common.service';
import { isUndefined } from 'util';
import { NetworkBoostService } from 'src/app/services/gaming/gaming-networkboost/networkboost.service';
import { GamingAllCapabilities } from './../../../data-models/gaming/gaming-all-capabilities';
import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';

@Component({
	selector: 'vtr-widget-networkboost',
	templateUrl: './widget-networkboost.component.html',
	styleUrls: ['./widget-networkboost.component.scss']
})
export class WidgetNetworkboostComponent implements OnInit, OnChanges {
	@Input() introTitle: string;
	@Input() changeNum: any = 0;
	@Output() actionModal = new EventEmitter<any>();
	@Output() addedApps = new EventEmitter<any>();
	@Input() modalStatus = false;
	public title: string;
	public networkBoostStatus = false;
	runningAppsList = [];
	gamingProperties: GamingAllCapabilities = new GamingAllCapabilities();
	constructor(private networkBoostService: NetworkBoostService, private commonService: CommonService) {
		this.getNetworkBoostListCache();
	}

	ngOnInit() {
		this.title = this.introTitle;
		this.getNetworkBoostList();
	}

	ngOnChanges(changes: any) {
		this.getNetworkBoostList();
	}
	public openModal() {
		if (this.runningAppsList && this.runningAppsList.length < 5) {
			this.actionModal.emit();
		}
	}

	async getNetworkBoostList(doFocus = false) {
		try {
			const appList: any = await this.networkBoostService.getNetworkBoostList();
			if (appList && !isUndefined(appList.processList)) {
				this.runningAppsList = appList.processList;
				this.sendAddedApps();
				this.commonService.setLocalStorageValue(LocalStorageKey.NetworkBoostList, appList);
			}
			const focusElement = document.getElementById('networkboost_addButton_clickable');
			if (doFocus && focusElement) {
				focusElement.focus();
			}
		} catch (error) {
		}
	}
	getNetworkBoostListCache() {
		const appList: any = this.commonService.getLocalStorageValue(LocalStorageKey.NetworkBoostList, {});
		if (appList && !isUndefined(appList.processList)) {
			this.runningAppsList = appList.processList || [];
			this.sendAddedApps();
		}
	}

	async removeApp(app: any, i: any) {
		try {
			const result = await this.networkBoostService.deleteProcessInNetBoost(app);
			this.getNetworkBoostList(true);
		} catch (err) {
		}
	}
	sendAddedApps() {
		this.runningAppsList = this.runningAppsList || [];
		this.addedApps.emit(this.runningAppsList.length);
	}
}
