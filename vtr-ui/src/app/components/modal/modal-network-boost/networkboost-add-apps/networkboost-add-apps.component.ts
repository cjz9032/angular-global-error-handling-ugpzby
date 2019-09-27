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
	constructor(private networkBoostService: NetworkBoostService) { }

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

	async onValueChange(event: any, i: number) {
		this.isChecked[i] = !this.isChecked[i];
		if (event && event.target) {
			this.addAppsList = event.target.value;
			if (this.isChecked[i]) {
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
		} catch (error) { }
	}
	async removeApp(app) {
		try {
			const result = await this.networkBoostService.deleteProcessInNetBoost(app);
			if (result) {
				this.addedApps -= 1;
			}
		} catch (err) { }
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
			if (this.noAppsRunning) {
				this.ariaLabel = 'gaming.narrator.networkBoost.addApps.noAppsTitle';
			} else {
				this.ariaLabel = 'gaming.narrator.networkBoost.addApps.addAppsTitle';
			}
		} catch (error) {
			this.loading = false;
			this.noAppsRunning = true;
			document.getElementById('nbAddApps').focus();
			console.log(`ERROR in refreshNetworkBoostList()`, error);
		} finally {
			setTimeout(() => {
				document.getElementById('nbAddApps').focus();
			}, 2);
		}
	}

	closeModal(action: boolean) {
		this.closeAddAppsModal.emit(action);
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
			document.getElementById('close').focus();

		}, 2)
	}
	checkApps(i) {
		let isShow = false;
		this.runningList.forEach((e, index) => {
			console.log(index);
			if (this.isChecked[index] && index > i) {
				console.log(index, i);
				console.log(this.isChecked)
				isShow = true;
			}
		});
		return isShow;
	}

	checkFocus(event) {
		if (this.noAppsRunning && event.which === 9) {
			this.noRunningInterval = setInterval(() => {
				document.getElementById('close').focus();
			}, 1);
		}
	}
}
