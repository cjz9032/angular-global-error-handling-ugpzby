import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { BacklightStatusEnum, BacklightLevelEnum } from '../backlight/backlight.enum';
import { InputAccessoriesService } from 'src/app/services/input-accessories/input-accessories.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { CommonService } from 'src/app/services/common/common.service';
import { EMPTY } from 'rxjs';
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
	baseAuto = 'base';
	autoObject = {
		title: 'device.deviceSettings.inputAccessories.backlight.level.auto',
		value: BacklightStatusEnum.AUTO,
		order: 1
	};
	lowObject = {
		title: 'device.deviceSettings.inputAccessories.backlight.level.low',
		value: BacklightStatusEnum.LEVEL_1,
		order: 2
	};
	highObject = {
		title: 'device.deviceSettings.inputAccessories.backlight.level.high',
		value: BacklightStatusEnum.LEVEL_2,
		order: 3
	};
	offObject = {
		title: 'device.deviceSettings.inputAccessories.backlight.level.off',
		value: BacklightStatusEnum.OFF,
		order: 4
	};
	modes = [];
	isAutoKBDEnable = false;
	cacheData = {modes: this.modes, currentMode: this.currentMode, isAutoKBDEnable: false};

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
		this.isAutoKBDEnable = this.cacheData.isAutoKBDEnable;
		this.isBaseAuto(this.modes, BacklightStatusEnum.AUTO);
	}

	public async updateMode(mode) {
		this.currentMode = mode;
		this.cacheData.currentMode = this.currentMode;
		this.commonService.setLocalStorageValue(LocalStorageKey.KBDBacklightThinkPadCapability, this.cacheData)
		if (this.currentMode === BacklightStatusEnum.AUTO) {
			await this.setKBDBacklightStatus(BacklightStatusEnum.OFF);
			this.setAutomaticKBDBacklight(false);
		} else {
			this.setKBDBacklightStatus(this.currentMode);
			this.setAutomaticKBDBacklight(false);
		}
	}

	public getKBDBacklightCapability() {
		try {
			if (this.keyboardService.isShellAvailable) {
				this.keyboardService.getKBDBacklightCapability()
					.then(async res => {
						this.logger.info('BacklightThinkpadComponent:GetKBDBacklightCapability', res);
						const autoCapability = await this.getAutoKBDBacklightCapability();
						if (autoCapability) {
							this.modes = [];
							this.cacheData.modes = this.modes;
							this.commonService.setLocalStorageValue(LocalStorageKey.KBDBacklightThinkPadCapability, this.cacheData)
							return;
						}
						if (res) {
							this.getKBDBacklightLevel();
						} else {
							this.removeObjByValue(BacklightStatusEnum.LEVEL_1);
							this.removeObjByValue(BacklightStatusEnum.LEVEL_2);
							this.removeObjByValue(BacklightStatusEnum.OFF);
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

	public removeObjByValue(value: string) {
		this.modes = this.modes.filter(e => e.value !== value);
		this.cacheData.modes = this.modes;
		this.commonService.setLocalStorageValue(LocalStorageKey.KBDBacklightThinkPadCapability, this.cacheData)
	}

	public isBaseAuto(array: any[], value: string) {
		const element = array.find(e => e.value === value);
		if (element) {
			this.baseAuto = 'auto';
		} else {
			this.baseAuto = 'base';
		}
	}

	addToObjectsList(obj: any) {
		const isPresent = this.modes.find(e => e.value === obj.value);
		if (!isPresent) {
			this.modes.push(obj);
			this.modes = this.commonService.sortMenuItems(this.modes);
		}
		this.cacheData.modes = this.modes;
		this.commonService.setLocalStorageValue(LocalStorageKey.KBDBacklightThinkPadCapability, this.cacheData)
	}

	public getAutoKBDBacklightCapability() {
		try {
			if (this.keyboardService.isShellAvailable) {
				return this.keyboardService.getAutoKBDBacklightCapability()
					// .then(res => {
					// 	this.logger.info('BacklightThinkpadComponent:getAutoKBDBacklightCapability', res);
					// 	if (res) {
					// 		this.addToObjectsList(this.autoObject);
					// 		this.getAutoKBDStatus();
					// 	} else {
					// 		this.removeObjByValue(BacklightStatusEnum.AUTO);
					// 	}
					// 	this.isBaseAuto(this.modes, BacklightStatusEnum.AUTO);
					// }).catch(error => {
					// 	this.logger.error('BacklightThinkpadComponent:getAutoKBDBacklightCapability', error.message);
					// 	return EMPTY;
					// });
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
						switch (res) {
							case BacklightLevelEnum.TWO_LEVELS:
							case BacklightLevelEnum.TWO_LEVELS_AUTO:
								this.addToObjectsList(this.highObject);
								this.addToObjectsList(this.lowObject);
								this.addToObjectsList(this.offObject);
								this.getKBDBacklightStatus();
								break;
							case BacklightLevelEnum.ONE_LEVEL:
								this.addToObjectsList(this.lowObject);
								this.addToObjectsList(this.offObject);
								this.getKBDBacklightStatus();
								break;
							case BacklightLevelEnum.NO_CAPABILITY:
								this.removeObjByValue(BacklightStatusEnum.OFF);
								this.removeObjByValue(BacklightStatusEnum.LEVEL_1);
								this.removeObjByValue(BacklightStatusEnum.LEVEL_2);
								break;
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
			return this.keyboardService.setKBDBacklightStatus(level);
		}
	}

	public async setAutomaticKBDBacklight(level: boolean) {
		if (this.keyboardService.isShellAvailable) {
			if (!this.isAutoKBDEnable) {
				await this.keyboardService.setAutoKBDEnableStatus();
				this.isAutoKBDEnable = true;
				this.cacheData.isAutoKBDEnable = this.isAutoKBDEnable;
			}
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
