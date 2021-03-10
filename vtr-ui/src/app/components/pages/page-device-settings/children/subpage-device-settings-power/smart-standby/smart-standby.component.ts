import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@lenovo/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { EMPTY } from 'rxjs';
import { Subscription } from 'rxjs/internal/Subscription';
import { ModalSmartStandByComponent } from 'src/app/components/modal/modal-smart-stand-by/modal-smart-stand-by.component';
import { UiRoundedRectangleRadioModel } from 'src/app/components/ui/ui-rounded-rectangle-custom-radio-list/ui-rounded-rectangle-radio-list.model';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { SmartStandby } from 'src/app/data-models/device/smart-standby.model';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { PowerService } from 'src/app/services/power/power.service';
import { SmartStandbyService } from 'src/app/services/smart-standby/smart-standby.service';

@Component({
	selector: 'vtr-smart-standby',
	templateUrl: './smart-standby.component.html',
	styleUrls: ['./smart-standby.component.scss'],
})
export class SmartStandbyComponent implements OnInit, OnDestroy {
	public smartStandby = new SmartStandby();
	cache: SmartStandby;
	public smartStandbyStartTime: string;
	public smartStandbyEndTime: string;
	isSmartStandbyVisible: boolean;
	showDiffNote: boolean;
	showDropDown: boolean[];
	toggleSubscription: Subscription;
	checkbox = false;
	isCollapsed = true;
	public isAutonomicCapability = false;
	public smartStandByInterval: any;
	public caption = this.translate.instant('device.deviceSettings.power.smartStandby.description');
	public tooltipText = this.translate.instant('device.deviceSettings.power.smartStandby.tooltip');
	clicktoChangeId = 'smartstandby-click-to-change';
	collapseId = 'smartstandby-click-to-change-collapse';
	firstTimeLoad: boolean;
	timeOut = 100;
	@Output() smartStandbyCapability = new EventEmitter<boolean>();
	public readonly AUTOMATIC_MODE = 'Automatic mode';
	public readonly MANUAL_MODE = 'Manual mode';
	public scheduleComputerModesUIModel: Array<UiRoundedRectangleRadioModel> = [
		{
			componentId: 'Automatic mode',
			label: 'device.deviceSettings.power.smartStandby.automaticMode',
			value: this.AUTOMATIC_MODE,
			isChecked: this.checkbox === true ? true : false,
			isDisabled: !this.smartStandby.isEnabled,
			metricsItem: 'radio.smart-standby.automatic-mode',
		},
		{
			componentId: 'Manual mode',
			label: 'device.deviceSettings.power.smartStandby.manualMode',
			value: this.MANUAL_MODE,
			isChecked: this.checkbox !== true ? true : false,
			isDisabled: !this.smartStandby.isEnabled,
			metricsItem: 'radio.smart-standby.manual-mode',
		},
	];

	constructor(
		private dialog: MatDialog,
		public powerService: PowerService,
		private logger: LoggerService,
		public commonService: CommonService,
		public smartStandbyService: SmartStandbyService,
		private translate: TranslateService,
		private localCacheService: LocalCacheService
	) {
		this.smartStandbyService.days = this.smartStandby.daysOfWeekOff;
	}

	ngOnInit() {
		this.firstTimeLoad = true;
		this.getSmartStandbyCapability();
		this.showDropDown = [false, false, false];
		this.toggleSubscription = this.commonService.notification.subscribe(
			(notification: AppNotification) => {
				this.onSmartStandbyNotification(notification);
			}
		);
	}

	public showSmartStandby() {
		if (this.powerService.isShellAvailable) {
			this.powerService
				.getSmartStandbyCapability()
				.then((response: boolean) => {
					this.logger.info(' getSmartStandbyCapability response', response);
					if (this.firstTimeLoad || response !== this.smartStandby.isCapable) {
						this.smartStandby.isCapable = response;
						this.cache.isCapable = response;
						this.saveCache();
						if (this.smartStandby.isCapable) {
							this.setSmartStandbyEnabled();
							this.autonomicCapabilityCheck();
						}
					}
					this.smartStandbyCapability.emit(this.smartStandby.isCapable);
				})
				.catch((error) => {
					this.logger.info('getSmartStandbyCapability Error', error.message);
				});
		}
	}

	public getSmartStandbyCapability() {
		this.initSmartStandby();
		this.showSmartStandby();
		this.smartStandByInterval = setInterval(() => {
			this.firstTimeLoad = false;
			this.showSmartStandby();
		}, 30000);
	}

	async setSmartStandbyEnabled() {
		const response = await this.powerService.getSmartStandbyEnabled();
		await this.setSmartStandbySection(response);
	}

	async setSmartStandbySection(response: boolean) {
		this.logger.info('getSmartStandbyEnabled response', response);
		this.smartStandby.isEnabled = response;
		this.cache.isEnabled = response;
		this.saveCache();
		if (this.smartStandby.isEnabled) {
			const activeStartEnd = await this.powerService.getSmartStandbyActiveStartEnd();
			const daysOffWeek = await this.powerService.getSmartStandbyDaysOfWeekOff();
			this.smartStandby.activeStartEnd = activeStartEnd;
			this.splitStartEndTime();
			this.smartStandby.daysOfWeekOff = daysOffWeek;
			this.smartStandbyService.days = daysOffWeek;
			this.cache.activeStartEnd = this.smartStandby.activeStartEnd;
			this.cache.daysOfWeekOff = this.smartStandby.daysOfWeekOff;
			this.saveCache();
			this.updateScheduleComputerModesUIModel();
		}
	}

	initSmartStandby() {
		// fix for VAN-19096: called so that SmartStandby section is reinitialized(shell side) hence the update in capability response
		this.getIsAutonomicCapability();
		this.initDataFromCache();
		this.splitStartEndTime();
	}

	autonomicCapabilityCheck() {
		this.getIsAutonomicCapability();
		this.getSmartStandbyIsAutonomic();
	}
	initDataFromCache() {
		this.cache = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.SmartStandbyCapability,
			undefined
		);
		if (this.cache) {
			this.smartStandby.isCapable = this.cache.isCapable;
			if (!this.smartStandby.isCapable) {
				this.smartStandbyCapability.emit(this.smartStandby.isCapable);
				return;
			}
			this.smartStandby.isEnabled = this.cache.isEnabled;
			this.smartStandby.activeStartEnd = this.cache.activeStartEnd;
			this.smartStandby.daysOfWeekOff = this.cache.daysOfWeekOff;
			this.smartStandbyService.days = this.smartStandby.daysOfWeekOff;
		} else {
			this.cache = new SmartStandby();
		}
		this.updateScheduleComputerModesUIModel();
	}

	public onSmartStandbyToggle(event: any) {
		this.showDropDown = [false, false, false];
		if (this.isAutonomicCapability) {
			this.isCollapsed = true;
		} else {
			this.isCollapsed = false;
		}
		const isEnabled = event.switchValue;
		try {
			this.logger.info('setSmartStandbyEnabled entered', event);
			if (this.powerService.isShellAvailable) {
				this.powerService
					.setSmartStandbyEnabled(isEnabled)
					.then((value: number) => {
						this.logger.info('setSmartStandbyEnabled.then', value);
						if (value === 0) {
							this.smartStandby.isEnabled = isEnabled;
							this.cache.isEnabled = this.smartStandby.isEnabled;
							this.saveCache();
							this.setSmartStandbySection(isEnabled);
							this.updateScheduleComputerModesUIModel();
						}
					})
					.catch((error) => {
						this.logger.error('setSmartStandbyEnabled', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('setSmartStandbyEnabled', error.message);
			return EMPTY;
		}
		// this.smartStandby.isEnabled = isEnabled;
	}

	splitStartEndTime() {
		const startEndTime = this.smartStandby.activeStartEnd.split('-');
		if (startEndTime.length === 2) {
			this.smartStandbyStartTime = startEndTime[0].trim();
			this.smartStandbyEndTime = startEndTime[1].trim();
		} else {
			this.smartStandbyStartTime = '00:00';
			this.smartStandbyEndTime = '00:00';
		}
		this.isStartEndTimeValid();
	}

	onSetActiveStartEnd(event, isStart) {
		let activeStartEnd;
		if (isStart) {
			activeStartEnd = event + '-' + this.smartStandbyEndTime;
		} else {
			activeStartEnd = this.smartStandbyStartTime + '-' + event;
		}
		this.smartStandby.activeStartEnd = activeStartEnd;

		this.splitStartEndTime();
		if (!this.showDiffNote) {
			try {
				this.logger.info('setSmartStandbyStartEndTime entered', event);
				if (this.powerService.isShellAvailable) {
					this.powerService
						.setSmartStandbyActiveStartEnd(activeStartEnd)
						.then((value: number) => {
							this.logger.info('setSmartStandbyStartEndTime.then', value);
							if (value === 0) {
								this.logger.info('smartStandbyStartEndTime is set successfully');
								this.cache.activeStartEnd = activeStartEnd;
								this.saveCache();
							}
						})
						.catch((error) => {
							this.logger.error('setSmartStandbyStartTime', error.message);
							return EMPTY;
						});
				}
			} catch (error) {
				this.logger.error('setSmartStandbyStartTime', error.message);
				return EMPTY;
			}
		}
	}

	onSetDaysOfWeekOff(event) {
		const daysOfWeekOff = event;
		this.smartStandby.daysOfWeekOff = daysOfWeekOff;
		this.smartStandbyService.days = this.smartStandby.daysOfWeekOff;
		this.cache.daysOfWeekOff = daysOfWeekOff;
		this.saveCache();
		try {
			this.logger.info('setSmartStandbyDaysOfWeekOff entered', event);
			if (this.powerService.isShellAvailable) {
				this.powerService
					.setSmartStandbyDaysOfWeekOff(daysOfWeekOff)
					.then((value: number) => {
						this.logger.info('setSmartStandbyDaysOfWeekOff.then', value);
						if (value === 0) {
							this.logger.info('smartStandbyDaysOfWeekOff is set successfully');
							this.cache.daysOfWeekOff = daysOfWeekOff;
							this.saveCache();
						}
					})
					.catch((error) => {
						this.logger.error('setSmartStandbyDaysOfWeekOff.error', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('onSetDaysOfWeekOff', error.message);
			return EMPTY;
		}
	}

	isStartEndTimeValid() {
		let timeDiff;
		let hourMinutes = this.smartStandbyStartTime.split(':');
		const startMinutes = parseInt(hourMinutes[0], 10) * 60 + parseInt(hourMinutes[1], 10);

		hourMinutes = this.smartStandbyEndTime.split(':');
		const endMinutes = parseInt(hourMinutes[0], 10) * 60 + parseInt(hourMinutes[1], 10);
		if (endMinutes <= startMinutes) {
			timeDiff = (24 * 60 - startMinutes + endMinutes) / 60;
		} else {
			timeDiff = (endMinutes - startMinutes) / 60;
		}
		if (timeDiff > 20) {
			this.showDiffNote = true;
		} else {
			this.showDiffNote = false;
		}
	}

	onSmartStandbyNotification(notification: AppNotification) {
		if (notification && notification.type === 'smartStandbyToggles') {
			const toggle = notification.payload;
			if (!toggle.value) {
				this.showDropDown[toggle.id] = false;
			} else {
				for (let i = 0; i < this.showDropDown.length; i++) {
					if (i !== toggle.id) {
						this.showDropDown[i] = false;
					} else {
						this.showDropDown[i] = true;
					}
				}
			}
		}
	}
	public getIsAutonomicCapability() {
		try {
			if (this.powerService.isShellAvailable) {
				this.powerService
					.getIsAutonomicCapability()
					.then((response) => {
						this.logger.info('===== getIsAutonomicCapability =====:', response);
						this.isAutonomicCapability = response || false;
						if (!this.isAutonomicCapability) {
							this.checkbox = false;
							this.isCollapsed = false;
							this.caption = this.translate.instant(
								'device.deviceSettings.power.smartStandby.description2'
							);
							this.tooltipText = this.translate.instant(
								'device.deviceSettings.power.smartStandby.oldTooltipText'
							);
							this.updateScheduleComputerModesUIModel();
						}
					})
					.catch((error) => {
						this.logger.error('getIsAutonomicCapability', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('getIsAutonomicCapability', error.message);
			return EMPTY;
		}
	}
	public setSmartStandbyIsAutonomic(onOff) {
		try {
			if (this.powerService.isShellAvailable) {
				this.powerService
					.setSmartStandbyIsAutonomic(onOff)
					.then((value: number) => {
						this.logger.info('setSmartStandbyIsAutonomic', value);
					})
					.catch((error) => {
						this.logger.error('setSmartStandbyIsAutonomic', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('setSmartStandbyIsAutonomic' + error.message);
		}
	}

	public getSmartStandbyIsAutonomic() {
		try {
			if (this.powerService.isShellAvailable) {
				this.powerService
					.getSmartStandbyIsAutonomic()
					.then((response: boolean) => {
						this.checkbox = response;
						this.updateScheduleComputerModesUIModel();
						this.logger.info('getSmartStandbyIsAutonomic:', response);
					})
					.catch((error) => {
						this.logger.error('getSmartStandbyIsAutonomic', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('getSmartStandbyIsAutonomic', error.message);
			return EMPTY;
		}
	}

	onCheckboxClicked($event) {
		this.showDropDown = [false, false, false];
		this.checkbox = $event.value === this.AUTOMATIC_MODE ? true : false;
		this.setSmartStandbyIsAutonomic(this.checkbox);
		this.isCollapsed = true;
	}

	focusElement(elementId) {
		setTimeout(() => {
			const focusElement = document.getElementById(`${elementId}`) as HTMLElement;
			if (focusElement) {
				focusElement.focus();
			}
		}, this.timeOut);
	}

	public onToggle(elem: HTMLElement) {
		elem.focus();
		this.isCollapsed = !this.isCollapsed;
		this.showDropDown = [false, false, false];
		if (this.isCollapsed) {
			this.focusElement(this.clicktoChangeId);
		}
		if (!this.isCollapsed) {
			this.focusElement(this.collapseId);
		}
	}
	public showUsageGraph() {
		if (this.smartStandby.isEnabled) {
			const modalRef = this.dialog.open(ModalSmartStandByComponent, {
				autoFocus: true,
				hasBackdrop: true,
				disableClose: true,
				panelClass: ['smart-standBy-modal', 'modal-lg'],
			});
			modalRef.componentInstance.isAutomatic = this.checkbox;
		}
	}

	ngOnDestroy() {
		clearTimeout(this.smartStandByInterval);
		if (this.toggleSubscription) {
			this.toggleSubscription.unsubscribe();
		}
	}

	updateScheduleComputerModesUIModel() {
		if (this.scheduleComputerModesUIModel && this.scheduleComputerModesUIModel.length > 0) {
			this.scheduleComputerModesUIModel.forEach((model) => {
				switch (model.value) {
					case this.AUTOMATIC_MODE:
						model.isChecked = this.checkbox;
						model.isDisabled = !this.smartStandby.isEnabled;
						break;
					case this.MANUAL_MODE:
						model.isChecked = !this.checkbox;
						model.isDisabled = !this.smartStandby.isEnabled;
						break;
					default:
						break;
				}
			});
		}
	}

	private saveCache(): void {
		this.localCacheService.setLocalCacheValue(
			LocalStorageKey.SmartStandbyCapability,
			this.cache
		);
	}
}
