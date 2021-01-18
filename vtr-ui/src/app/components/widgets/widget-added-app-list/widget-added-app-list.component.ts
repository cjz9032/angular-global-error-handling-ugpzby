import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { LoggerService } from 'src/app/services/logger/logger.service';

import { NetworkBoostService } from 'src/app/services/gaming/gaming-networkboost/networkboost.service';
import { GamingAutoCloseService } from './../../../services/gaming/gaming-autoclose/gaming-autoclose.service';

@Component({
	selector: 'vtr-widget-added-app-list',
	templateUrl: './widget-added-app-list.component.html',
	styleUrls: ['./widget-added-app-list.component.scss'],
})
export class WidgetAddedAppListComponent implements OnInit, OnChanges {
	@Input() refreshTrigger: any = 0;
	@Output() actionModal = new EventEmitter<any>();
	@Output() addedApps = new EventEmitter<any>();
	@Input() isNetworkBoost = undefined;
	appList = [];

	constructor(
		private networkBoostService: NetworkBoostService,
		private autoCloseService: GamingAutoCloseService,
		private commonService: CommonService,
		private loggerService: LoggerService
	) {}

	ngOnInit() {}

	ngOnChanges(changes: any): void {
		if (this.isNetworkBoost === true) {
			this.getNetworkBoostList();
			this.focusAddButton();
		} else {
			this.getAutoCloseList();
			if (this.refreshTrigger === -1) {
				this.focusAddButton();
			}
		}
	}

	openModal() {
		this.actionModal.emit();
	}

	getNetworkBoostList() {
		try {
			this.networkBoostService.getNetworkBoostList().then((appList: any) => {
				if (appList && appList.processList !== undefined) {
					this.appList = appList.processList || [];
					this.sendAddedApps();
					this.commonService.setLocalStorageValue(
						LocalStorageKey.NetworkBoostList,
						appList
					);
				}
			});
		} catch (error) {}
	}

	getNetworkBoostListCache() {
		const appList: any = this.commonService.getLocalStorageValue(
			LocalStorageKey.NetworkBoostList,
			{}
		);
		if (appList && appList.processList !== undefined) {
			this.appList = appList.processList || [];
			this.sendAddedApps();
		}
	}

	sendAddedApps() {
		this.appList = this.appList || [];
		this.addedApps.emit(this.appList.length);
	}

	getAutoCloseList() {
		try {
			this.autoCloseService.getAppsAutoCloseList().then((appList: any) => {
				if (appList && appList.processList !== undefined) {
					this.appList = appList.processList || [];
					this.autoCloseService.setAutoCloseListCache(appList.processList);
					this.loggerService.info(
						'page-autoclose.component.refreshAutoCloseList',
						'get Auto close List--->' + appList.processList
					);
					this.loggerService.info(
						'page-autoclose.component.refreshAutoCloseList',
						'Total Auto close List Apps--->' + appList.processList.length
					);
				}
			});
		} catch (error) {}
	}

	getAutoCloseListCache() {
		const appList: any = this.autoCloseService.getAutoCloseListCache();
		if (appList && appList.processList !== undefined) {
			this.appList = appList.processList || [];
		}
	}

	removeApp(app: any, i: any) {
		try {
			if (this.isNetworkBoost === true) {
				this.networkBoostService
					.deleteProcessInNetBoost(app.processPath)
					.then((response: boolean) => {
						if (response) {
							this.getNetworkBoostList();
						}
					});
			} else {
				this.autoCloseService
					.delAppsAutoCloseList(app.processDescription)
					.then((response: boolean) => {
						if (response) {
							this.getAutoCloseList();
						}
					});
			}
			this.focusAddButton();
		} catch (err) {}
	}

	focusAddButton() {
		setTimeout(() => {
			const id = this.isNetworkBoost
				? 'networkboost_addButton_clickable'
				: 'addAutoCloseAppBtn';
			const focusElement = document.getElementById(id);
			if (focusElement) {
				focusElement.focus();
			}
		}, 100);
	}
}
