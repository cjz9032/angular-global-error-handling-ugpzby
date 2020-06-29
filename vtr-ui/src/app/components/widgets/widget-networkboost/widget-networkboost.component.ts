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
	imageAddIcon = "data:image/svg+xml,%3Csvg width='20px' height='20px' viewBox='0 0 20 20' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E6.20pxIcon/add%3C/title%3E%3Cdesc%3ECreated with Sketch.%3C/desc%3E%3Cg id='6.20pxIcon/add' stroke='none' stroke-width='1' fill='rgba(255,255,255,0.6)' fill-rule='evenodd'%3E%3Cpath d='M9.86634391,2 C9.30897756,2 8.85714286,2.44991629 8.85714286,2.99708744 L8.85714286,8.85714286 L2.99708744,8.85714286 C2.44641125,8.85714286 2,9.29785156 2,9.86634391 L2,10.1336561 C2,10.6910224 2.44991629,11.1428571 2.99708744,11.1428571 L8.85714286,11.1428571 L8.85714286,17.0029126 C8.85714286,17.5535887 9.29785156,18 9.86634391,18 L10.1336561,18 C10.6910224,18 11.1428571,17.5500837 11.1428571,17.0029126 L11.1428571,11.1428571 L17.0029126,11.1428571 C17.5535887,11.1428571 18,10.7021484 18,10.1336561 L18,9.86634391 C18,9.30897756 17.5500837,8.85714286 17.0029126,8.85714286 L11.1428571,8.85714286 L11.1428571,2.99708744 C11.1428571,2.44641125 10.7021484,2 10.1336561,2 L9.86634391,2 Z' id='Shape' fill='#FBFDFF' fill-rule='nonzero'%3E%3C/path%3E%3C/g%3E%3C/svg%3E";
	imageAddIconDisabled = "data:image/svg+xml,%3Csvg width='20px' height='20px' viewBox='0 0 20 20' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E6.20pxIcon/add%3C/title%3E%3Cdesc%3ECreated with Sketch.%3C/desc%3E%3Cg id='6.20pxIcon/add' stroke='none' stroke-width='1' fill='rgba(255,255,255,0.6)' fill-rule='evenodd'%3E%3Cpath d='M9.86634391,2 C9.30897756,2 8.85714286,2.44991629 8.85714286,2.99708744 L8.85714286,8.85714286 L2.99708744,8.85714286 C2.44641125,8.85714286 2,9.29785156 2,9.86634391 L2,10.1336561 C2,10.6910224 2.44991629,11.1428571 2.99708744,11.1428571 L8.85714286,11.1428571 L8.85714286,17.0029126 C8.85714286,17.5535887 9.29785156,18 9.86634391,18 L10.1336561,18 C10.6910224,18 11.1428571,17.5500837 11.1428571,17.0029126 L11.1428571,11.1428571 L17.0029126,11.1428571 C17.5535887,11.1428571 18,10.7021484 18,10.1336561 L18,9.86634391 C18,9.30897756 17.5500837,8.85714286 17.0029126,8.85714286 L11.1428571,8.85714286 L11.1428571,2.99708744 C11.1428571,2.44641125 10.7021484,2 10.1336561,2 L9.86634391,2 Z' id='Shape' fill='#FFFBFDFF' fill-rule='nonzero'%3E%3C/path%3E%3C/g%3E%3C/svg%3E";
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
			if (doFocus) {
				document.getElementById('networkboost_addButton').focus();
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
