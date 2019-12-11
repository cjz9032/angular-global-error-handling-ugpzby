import { LoggerService } from './../../../../services/logger/logger.service';
import { CommonService } from 'src/app/services/common/common.service';
import { NetworkBoostService } from './../../../../services/gaming/gaming-networkboost/networkboost.service';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, AfterViewInit, OnDestroy } from '@angular/core';
import { isUndefined } from 'util';

@Component({
	selector: 'vtr-networkboost-add-apps',
	templateUrl: './networkboost-add-apps.component.html',
	styleUrls: ['./networkboost-add-apps.component.scss']
})
export class NetworkboostAddAppsComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
	loading = true;
	runningList: any = [];
	noAppsRunning = false;
	currentLength = 0;
	addAppsList: string;
	ariaLabel = 'gaming.narrator.networkBoost.addApps.addAppsTitle';
	statusAskAgain: boolean;
	public isChecked: any = [];
	noRunningInterval: any;
	@Input() showAppsModal: boolean;
	@Input() addedApps = 0;
	maxAppsCount = 5;
	@Output() closeAddAppsModal = new EventEmitter<boolean>();
	constructor(private networkBoostService: NetworkBoostService, private loggerService: LoggerService) { }

	ngOnInit() {
		this.refreshNetworkBoostList();

	}
	ngAfterViewInit() {
	}
	ngOnChanges(changes: any) {
		this.runningList.push({ iconName: '', processDescription: '', processPath: '' });
	}
	ngOnDestroy() {
		if (this.noRunningInterval) {
			clearInterval(this.noRunningInterval);
		}
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
			// console.log('RESULT frpm NB', result);
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
			// console.log(this.runningList, '--RUNNINGLIST');
		} catch (error) {
			this.loading = false;
			this.noAppsRunning = true;
			this.focusElement('nbAddApps');
			this.loggerService.error('networkboost-add-apps.component => ERROR in refreshNetworkBoostList()', error);
		} finally {
			setTimeout(() => {
				this.focusElement('nbAddApps');
			}, 2);
		}
	}

	focusElement(id) {
		if (document.getElementById(id)) {
			document.getElementById(id).focus();
		}
	}

	closeModal(action: boolean) {
		this.closeAddAppsModal.emit(action);
		this.focusElement('main-wrapper');
	}

	runappKeyup(event, i) {
		if (event.which === 9) {
			if (i > this.currentLength) {
				this.currentLength = i;
			}
			if (Number(this.addedApps) === 5) {
				if (!this.checkApps(i)) {
					this.focusClose();
				}

			} else {
				if (i === this.runningList.length - 1) {
					this.focusClose();
				}
			}
		}
	}

	focusClose() {
		setTimeout(() => {
			this.focusElement('close');
		}, 2);
	}
	checkApps(i) {
		let isShow = false;
		this.runningList.forEach((e, index) => {
			// console.log(index);
			if (this.isChecked[index] && index > i) {
				// console.log(index, i);
				isShow = true;
			}
		});
		return isShow;
	}

	checkFocus(event) {
		if (this.noAppsRunning && event.which === 9) {
			this.noRunningInterval = setInterval(() => {
				this.focusElement('close');
			}, 1);
		}
	}
}
