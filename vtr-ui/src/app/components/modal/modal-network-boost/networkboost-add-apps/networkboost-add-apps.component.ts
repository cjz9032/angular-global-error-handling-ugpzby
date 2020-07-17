import { LoggerService } from './../../../../services/logger/logger.service';
import { NetworkBoostService } from './../../../../services/gaming/gaming-networkboost/networkboost.service';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { isUndefined } from 'util';

@Component({
	selector: 'vtr-networkboost-add-apps',
	templateUrl: './networkboost-add-apps.component.html',
	styleUrls: ['./networkboost-add-apps.component.scss']
})
export class NetworkboostAddAppsComponent implements OnInit, OnChanges{
	loading = true;
	runningList: any = [];
	noAppsRunning = false;
	currentLength = 0;
	addAppsList: string;
	ariaLabel = 'gaming.narrator.networkBoost.addApps.addAppsTitle';
	statusAskAgain: boolean;
	public isChecked: any = [];
	@Input() showAppsModal: boolean;
	@Input() addedApps = 0;
	maxAppsCount = 5;
	@Output() closeAddAppsModal = new EventEmitter<boolean>();
	constructor(private networkBoostService: NetworkBoostService, private loggerService: LoggerService) { }

	ngOnInit() {
		this.refreshNetworkBoostList();
	}

	ngOnChanges(changes: any) {
		this.runningList.push({ iconName: '', processDescription: '', processPath: '' });
	}

	async onValueChange(event: any, i: number, item: any = {}) {
		this.isChecked[i] = !this.isChecked[i];
		item.isChecked = !item.isChecked;
		if (event && event.target) {
			this.addAppsList = event.target.value;
			if (this.isChecked[i]) {
				this.addedApps += 1;
				this.addAppToList(event.target.value, item);
			} else {
				this.addedApps -= 1;
				this.removeApp(event.target.value, item);
			}
		}
	}

	async addAppToList(app, item: any = {}) {
		try {
			const result = await this.networkBoostService.addProcessToNetworkBoost(app);
			if (!result) {
				this.addedApps -= 1;
				item.isChecked = false;
			}
			this.loggerService.info('NetworkboostaddComponent.addAppToList',
				'RESULT FROM NB ADD ========>' + result + 'checked-->' + item.isChecked);
		} catch (error) { }
	}
	async removeApp(app, item: any = {}) {
		try {
			const result = await this.networkBoostService.deleteProcessInNetBoost(app);
			if (!result) {
				this.addedApps += 1;
				item.isChecked = true;
			}
		} catch (err) { }
	}

	async refreshNetworkBoostList() {
		try {
			const result: any = await this.networkBoostService.getNetUsingProcesses();
			this.loggerService.info('NetworkboostaddComponent.refreshNetworkBoostList',
				'RESULT frpm NB --->' + result);
			this.loading = false;
			this.runningList = [];
			if (result && !isUndefined(result.processList)) {
				this.runningList = result.processList || [];
			}
			this.noAppsRunning = this.runningList.length === 0 ? true : false;
			if (this.noAppsRunning) {
				this.ariaLabel = 'gaming.narrator.networkBoost.addApps.noAppsTitle';
			} else {
				this.ariaLabel = 'gaming.narrator.networkBoost.addApps.addAppsTitle';
			}
			this.loggerService.info('NetworkboostaddComponent.refreshNetworkBoostList',
				'RUNNINGLIST --->' +  this.runningList);
		} catch (error) {
			this.loading = false;
			this.noAppsRunning = true;
			this.focusElement();
			this.loggerService.error('networkboost-add-apps.component => ERROR in refreshNetworkBoostList()', error);
		} finally {
			this.focusElement();
		}
	}

	focusElement() {
		setTimeout(() => {
			const modal = document.getElementsByClassName('gaming-popup-window')[0] as HTMLElement;
			if (modal) {
				modal.focus();
			}
		}, 2);
	}

	closeModal(action: boolean) {
		this.closeAddAppsModal.emit(action);
		document.getElementById('main-wrapper').focus();
	}

	runappKeyup(event, i) {
		if (event.which === 9 && !event.shiftKey) {
			if (i > this.currentLength) {
				this.currentLength = i;
			}
			if (Number(this.addedApps) === 5) {
				if (!this.checkApps(i)) {
					this.focusElement();
				}

			} else {
				if (i === this.runningList.length - 1) {
					this.focusElement();
				}
			}
		}
	}

	checkApps(i) {
		let isShow = false;
		this.runningList.forEach((e, index) => {
			this.loggerService.info('NetworkboostaddComponent.checkApps','--->' +  index);
			if (this.isChecked[index] && index > i) {
				isShow = true;
			}
		});
		return isShow;
	}

	checkFocus(event) {
		if (this.noAppsRunning && event.which === 9) {
			this.focusElement();
		}
	}
}
