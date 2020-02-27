import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { BacklightStatusEnum, BacklightLevelEnum } from '../backlight/backlight.enum';
import { InputAccessoriesService } from 'src/app/services/input-accessories/input-accessories.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { EMPTY } from 'rxjs';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';

@Component({
	selector: 'vtr-backlight-thinkpad',
	templateUrl: './backlight-thinkpad.component.html',
	styleUrls: ['./backlight-thinkpad.component.scss']
})
export class BacklightThinkpadComponent implements OnInit, OnDestroy {
	private kbdBacklightInterval: any;
	currentMode: BacklightStatusEnum = BacklightStatusEnum.OFF;
	@Output() showHide = new EventEmitter<boolean>();
	modes = [
		{
			title: 'device.deviceSettings.inputAccessories.backlight.level.auto',
			value: BacklightStatusEnum.AUTO,
			available: true
		},
		{
			title: 'device.deviceSettings.inputAccessories.backlight.level.low',
			value: BacklightStatusEnum.LEVEL_1,
			available: true
		},
		{
			title: 'device.deviceSettings.inputAccessories.backlight.level.high',
			value: BacklightStatusEnum.LEVEL_2,
			available: true
		},
		{
			title: 'device.deviceSettings.inputAccessories.backlight.level.off',
			value: BacklightStatusEnum.OFF,
			available: true
		},
	];
	cacheData = {modes: this.modes, currentMode: this.currentMode};

	constructor(
		private keyboardService: InputAccessoriesService,
		private logger: LoggerService,
		private commonService: CommonService) {
			this.getKBDBacklightCapability();
		}

	ngOnInit() {
		this.initDataFromCache();
		this.kbdBacklightInterval = setInterval(async () => {
			this.logger.debug('Trying after 30 seconds for getting kbdBacklight status');
			this.getKBDBacklightCapability();
		}, 30000);
	}

	private initDataFromCache() {
		this.cacheData = this.commonService.getLocalStorageValue(LocalStorageKey.KBDBacklightThinkPadCapability, this.cacheData);
		this.modes = this.cacheData.modes;
		this.currentMode = this.cacheData.currentMode;
	}

	public updateMode(mode) {
		this.currentMode = mode;
		this.cacheData.currentMode = this.currentMode;
		this.commonService.setLocalStorageValue(LocalStorageKey.KBDBacklightThinkPadCapability, this.cacheData)
		if (this.currentMode === BacklightStatusEnum.AUTO) {
			this.setKBDBacklightStatus(BacklightStatusEnum.OFF);
			this.setAutomaticKBDBacklight(true);
		} else {
			this.setKBDBacklightStatus(this.currentMode);
			this.setAutomaticKBDBacklight(false);
		}
	}

	public getKBDBacklightCapability() {
		try {
			if (this.keyboardService.isShellAvailable) {
				this.keyboardService.getKBDBacklightCapability()
					.then(res => {
						this.logger.info('BacklightThinkpadComponent:GetKBDBacklightCapability', res);
						this.getAutoKBDBacklightCapability();
						if (res) {
							this.getKBDBacklightLevel();
						} else {
							this.modes = this.removeObjByValue(this.modes, BacklightStatusEnum.LEVEL_1);
							this.modes = this.removeObjByValue(this.modes, BacklightStatusEnum.LEVEL_2);
							this.modes = this.removeObjByValue(this.modes, BacklightStatusEnum.OFF);
							this.cacheData.modes = this.modes;
							this.commonService.setLocalStorageValue(LocalStorageKey.KBDBacklightThinkPadCapability, this.cacheData)
						}
					}).catch(error => {
						this.logger.error('BacklightThinkpadComponent:GetKBDBacklightCapability', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('BacklightThinkpadComponent:GetKBDBacklightCapability', error.message);
			return EMPTY;
		}
	}

	public removeObjByValue(array: any[], value: string) {
		return array.filter(e => e.value !== value);
	}

	public getAutoKBDBacklightCapability() {
		try {
			if (this.keyboardService.isShellAvailable) {
				this.keyboardService.getAutoKBDBacklightCapability()
					.then(res => {
						this.logger.info('BacklightThinkpadComponent:getAutoKBDBacklightCapability', res);
						if (res) {
							this.getAutoKBDStatus();
						} else {
							this.modes = this.removeObjByValue(this.modes, BacklightStatusEnum.AUTO);
							this.cacheData.modes = this.modes;
							this.commonService.setLocalStorageValue(LocalStorageKey.KBDBacklightThinkPadCapability, this.cacheData)
						}
					}).catch(error => {
						this.logger.error('BacklightThinkpadComponent:getAutoKBDBacklightCapability', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('BacklightThinkpadComponent:getAutoKBDBacklightCapability', error.message);
			return EMPTY;
		}
	}

	public getAutoKBDStatus() {
		try {
			if (this.keyboardService.isShellAvailable) {
				this.keyboardService.getAutoKBDStatus()
					.then(res => {
						this.logger.info('BacklightThinkpadComponent:getAutoKBDStatus', res);
						if (res) {
							this.currentMode = BacklightStatusEnum.AUTO;
							this.cacheData.currentMode = this.currentMode;
							this.commonService.setLocalStorageValue(LocalStorageKey.KBDBacklightThinkPadCapability, this.cacheData)
						}
					}).catch(error => {
						this.logger.error('BacklightThinkpadComponent:GetAutoKBDStatus', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('BacklightThinkpadComponent:GetAutoKBDStatus', error.message);
			return EMPTY;
		}
	}

	public getKBDBacklightStatus() {
		try {
			if (this.keyboardService.isShellAvailable) {
				this.keyboardService.getKBDBacklightStatus()
					.then(res => {
						this.logger.info('BacklightThinkpadComponent:getKBDBacklightStatus', res);
						if (res !== BacklightStatusEnum.AUTO && this.currentMode !== BacklightStatusEnum.AUTO) {
							this.currentMode = this.compare(res);
							this.cacheData.currentMode = this.currentMode;
							this.commonService.setLocalStorageValue(LocalStorageKey.KBDBacklightThinkPadCapability, this.cacheData)
						}
					}).catch(error => {
						this.logger.error('BacklightThinkpadComponent:GetKBDBacklightStatus', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('BacklightThinkpadComponent:GetKBDBacklightStatus', error.message);
			return EMPTY;
		}
	}

	public getKBDBacklightLevel() {
		try {
			if (this.keyboardService.isShellAvailable) {
				this.keyboardService.getKBDBacklightLevel()
					.then(res => {
						this.logger.info('BacklightThinkpadComponent:getKBDBacklightLevel', res);
						if (res === BacklightLevelEnum.NO_CAPABILITY) {
							this.modes = this.removeObjByValue(this.modes, BacklightStatusEnum.OFF);
							this.modes = this.removeObjByValue(this.modes, BacklightStatusEnum.LEVEL_1);
							this.modes = this.removeObjByValue(this.modes, BacklightStatusEnum.LEVEL_2);
							this.cacheData.modes = this.modes;
							this.commonService.setLocalStorageValue(LocalStorageKey.KBDBacklightThinkPadCapability, this.cacheData)
						} else {
							if (res === BacklightLevelEnum.ONE_LEVEL) {
								this.modes = this.removeObjByValue(this.modes, BacklightStatusEnum.LEVEL_2);
								this.cacheData.modes = this.modes;
								this.commonService.setLocalStorageValue(LocalStorageKey.KBDBacklightThinkPadCapability, this.cacheData)
							}
							this.getKBDBacklightStatus();
						}
					}).catch(error => {
						this.logger.error('BacklightThinkpadComponent:GetKBDBacklightLevel', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('BacklightThinkpadComponent:GetKBDBacklightLevel', error.message);
			return EMPTY;
		}
	}

	public setKBDBacklightStatus(level: string) {
		if (this.keyboardService.isShellAvailable) {
			this.keyboardService.setKBDBacklightStatus(level)
			.then((value: boolean) => {
				this.logger.info('BacklightThinkpadComponent:setKBDBacklightStatus.then', value);
			}).catch(error => {
				this.logger.error('BacklightThinkpadComponent:setKBDBacklightStatus', error.message);
				return EMPTY;
			});
		}
	}

	public setAutomaticKBDBacklight(level: boolean) {
		if (this.keyboardService.isShellAvailable) {
			this.keyboardService.setAutomaticKBDBacklight(level)
			.then((value: boolean) => {
				this.logger.info('BacklightThinkpadComponent:setAutomaticKBDBacklight.then', value);
			}).catch(error => {
				this.logger.error('BacklightThinkpadComponent:setAutomaticKBDBacklight', error.message);
				return EMPTY;
			});
		}
	}

	private compare(value: string): BacklightStatusEnum {
		switch (value) {
			case BacklightStatusEnum.AUTO:
				return BacklightStatusEnum.AUTO;
			case BacklightStatusEnum.DISABLED_OFF:
				return BacklightStatusEnum.DISABLED_OFF;
			case BacklightStatusEnum.LEVEL_1:
				return BacklightStatusEnum.LEVEL_1;
			case BacklightStatusEnum.LEVEL_2:
				return BacklightStatusEnum.LEVEL_2;
			case BacklightStatusEnum.OFF:
				return BacklightStatusEnum.OFF;
		}
	}

	ngOnDestroy() {
		clearInterval(this.kbdBacklightInterval);
	}

}
