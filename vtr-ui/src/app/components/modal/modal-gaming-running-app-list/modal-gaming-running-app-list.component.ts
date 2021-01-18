import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { LoggerService } from './../../../services/logger/logger.service';
import { NetworkBoostService } from './../../../services/gaming/gaming-networkboost/networkboost.service';
import { GamingAutoCloseService } from 'src/app/services/gaming/gaming-autoclose/gaming-autoclose.service';
import { MatDialogRef } from '@lenovo/material/dialog';

@Component({
	selector: 'vtr-modal-gaming-running-app-list',
	templateUrl: './modal-gaming-running-app-list.component.html',
	styleUrls: ['./modal-gaming-running-app-list.component.scss'],
})
export class ModalGamingRunningAppListComponent implements OnInit, OnChanges {
	@Input() addedApps = 0;
	@Output() emitService = new EventEmitter();
	public isChecked: any = [];
	public info: any = {
		id: {
			section: '',
			headerText: '',
			description: '',
			closeButton: '',
		},
		title: '',
		description: '',
		description2: '',
		description3: '',
	};

	loading = true;
	runningList: any = [];
	emptyAppList = false;
	ariaLabel = '';
	maxAppsCount = 5;
	isNetworkBoost = false;

	constructor(
		private networkBoostService: NetworkBoostService,
		private autoCloseService: GamingAutoCloseService,
		private loggerService: LoggerService,
		public dialogRef: MatDialogRef<ModalGamingRunningAppListComponent>
	) { }

	ngOnInit() { }

	ngOnChanges(changes: any) {
		this.runningList.push({ iconName: '', processDescription: '', processPath: '' });
	}

	public setAppList(isNetworkBoost: boolean, count: number) {
		this.isNetworkBoost = isNetworkBoost;
		this.addedApps = count;
		this.initInfo();
		this.refreshList();
	}

	initInfo() {
		if (this.isNetworkBoost) {
			this.info = {
				id: {
					section: 'gaming_networkboost_running_applist',
					headerText: 'network_boost_add_apps_popup_header_text',
					description: 'network_boost_add_apps_popup_description',
					closeButton: 'nbAddApps_close_btn',
				},
				title: 'gaming.networkBoost.modalAddApps.title',
				description: 'gaming.networkBoost.modalAddApps.body.part1',
				description2: 'gaming.networkBoost.modalAddApps.body.part2',
				description3: 'gaming.networkBoost.modalAddApps.body.part3',
			};
			this.ariaLabel = 'gaming.narrator.networkBoost.addApps.addAppsTitle';
		} else {
			this.info = {
				id: {
					section: 'gaming_autoclose_addapps',
					headerText: 'auto_close_add_apps_popup_header_text',
					description: 'auto_close_add_apps_popup_description',
					closeButton: 'gaming_autoclose_addapps_close',
				},
				title: 'gaming.autoClose.modalAddApps.title',
				description: 'gaming.autoClose.modalAddApps.body',
			};
			this.ariaLabel = 'gaming.autoClose.modalTurnAutoCloseNarrator.open';
		}
	}

	async refreshList() {
		try {
			let result: any;
			if (this.isNetworkBoost) {
				result = await this.networkBoostService.getNetUsingProcesses();
			} else {
				result = await this.autoCloseService.getAppsAutoCloseRunningList();
			}
			if (this.loading === true) {
				this.focusCloseButton();
			}
			this.loading = false;
			this.runningList = [];
			if (result && result.processList !== undefined) {
				this.runningList = result.processList || [];
			}
			this.emptyAppList = this.runningList.length === 0 ? true : false;
			if (this.emptyAppList) {
				if (this.isNetworkBoost) {
					this.ariaLabel = 'gaming.narrator.networkBoost.addApps.noAppsTitle';
					this.info.id.section = 'nbAddApps_norunningapps';
					this.info.id.closeButton = 'nbAddApps_norunningapps_close_btn';
				} else {
					this.ariaLabel = 'gaming.autoClose.modalTurnAutoCloseNarrator.running';
					this.info.id.section = 'gaming_autoclose_norunningapps';
					this.info.id.closeButton = 'gaming_autoclose_norunningapps_close';
				}
			}
		} catch (error) {
			this.loading = false;
			this.emptyAppList = true;
			this.loggerService.error(
				'modal-gaming-running-app-list.component => ERROR in refreshList()',
				error
			);
		} finally {
		}
	}

	async onValueChange(event: any, i: number, item: any = {}) {
		this.isChecked[i] = !this.isChecked[i];
		item.isChecked = !item.isChecked;
		if (event && event.target) {
			if (this.isChecked[i]) {
				if (this.isNetworkBoost) {
					this.addedApps += 1;
				}
				this.addApp(event.target.value, item);
			} else {
				if (this.isNetworkBoost) {
					this.addedApps -= 1;
				}
				this.removeApp(event.target.value, item);
			}
		}
	}

	async addApp(app, item: any = {}) {
		try {
			let result;
			if (this.isNetworkBoost) {
				result = await this.networkBoostService.addProcessToNetworkBoost(app);
			} else {
				result = await this.autoCloseService.addAppsAutoCloseList(app);
			}
			if (!result) {
				if (this.isNetworkBoost) {
					this.addedApps -= 1;
				}
				item.isChecked = false;
			}
		} catch (error) { }
		this.emitService.next(this.addedApps);
	}

	async removeApp(app, item: any = {}) {
		try {
			let result;
			if (this.isNetworkBoost) {
				result = await this.networkBoostService.deleteProcessInNetBoost(app);
			} else {
				result = await this.autoCloseService.delAppsAutoCloseList(app);
			}
			if (!result) {
				if (this.isNetworkBoost) {
					this.addedApps += 1;
				}
				item.isChecked = true;
			}
		} catch (err) { }
		this.emitService.next(this.addedApps);
	}

	focusCloseButton() {
		setTimeout(() => {
			const modal = document.getElementsByClassName(
				'modal-gaming-running-app-list-close'
			)[0] as HTMLElement;
			if (modal) {
				modal.focus();
			}
		}, 20);
	}

	runappKeyup(event, index) {
		if (event.which === 9 && !event.shiftKey) {
			if (this.addedApps === 5 && this.isLastCheckedApp(index)) {
				this.focusCloseButton();
			}
		}
	}

	isLastCheckedApp(index) {
		if (index === this.runningList.length - 1) {
			return true;
		}
		for (let i = index; i < this.runningList.length; i++) {
			if (this.isChecked[i] === true && i > index) {
				return false;
			}
		}
		return true;
	}

	closeModal() {
		this.dialogRef.close('close');
	}
}
