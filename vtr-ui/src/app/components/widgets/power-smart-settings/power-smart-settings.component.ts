import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { EMPTY } from 'rxjs';
import { IntelligentCoolingCapability } from 'src/app/data-models/device/intelligent-cooling-capability.model';
import { DYTC6Modes, ICModes, IntelligentCoolingHardware, IntelligentCoolingMode, IntelligentCoolingModes } from 'src/app/enums/intelligent-cooling.enum';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { CommonService } from 'src/app/services/common/common.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { PowerService } from 'src/app/services/power/power.service';
import { ModalIntelligentCoolingModesComponent } from '../../modal/modal-intelligent-cooling-modes/modal-intelligent-cooling-modes.component';
import { MetricService } from 'src/app//services/metric/metric.service';

const thinkpad = 1;
const ideapad = 0;
@Component({
	selector: 'vtr-power-smart-settings',
	templateUrl: './power-smart-settings.component.html',
	styleUrls: ['./power-smart-settings.component.scss']
})
export class PowerSmartSettingsComponent implements OnInit, OnDestroy {
	intelligentCoolingModes = IntelligentCoolingHardware.ITS;
	dYTCRevision = 0;
	cQLCapability = false;
	tIOCapability = false;
	showIC = 0;
	showIntelligentCoolingToggle = true;
	radioPerformance = false;
	radioQuietCool = false;
	radioBatterySaving = false;
	selectedModeText = '';
	enableIntelligentCoolingToggle = false;
	apsStatus = false;
	showIntelligentCoolingModes = true;
	captionText = '';
	machineType: number;
	add = 0;
	onReadMoreClick: boolean;
	cache: IntelligentCoolingCapability = undefined;
	public isCollapsed = false;
	legacyManualModeCapability = true;
	public dytc6Mode: string = DYTC6Modes.Manual;
	public dytc6IsAutoModeSupported = true;
	private amtCapabilityInterval: any;
	public isAutoTransitionVisible = false;
	public isAutoTransitionEnabled = false;
	public autoTransitionIsReadMore = false;
	public isSmartPowerSettingRemoved = false;
	@Output() isPowerSmartSettingHidden = new EventEmitter<any>();
	@Output() isPowerSmartSettingAdd = new EventEmitter<any>();

	constructor(
		public powerService: PowerService,
		private translate: TranslateService,
		private logger: LoggerService,
		public commonService: CommonService,
		public modalService: NgbModal,
		private metricService: MetricService) {
			this.initDataFromCache();
		}

	ngOnInit() {
		this.machineType = this.commonService.getLocalStorageValue(LocalStorageKey.MachineType);
		if (thinkpad === this.machineType || this.isYogo730()) {
			this.add = 0; // thinkpad
			this.checkDriverForThinkPad();
		} else if (ideapad === this.machineType) {
			this.add = 10; // Ideapad
			this.initPowerSmartSettingsForIdeaPad();
		} else {
			this.hidePowerSmartSetting();
		}
	}

	initDataFromCache() {
		this.cache = this.commonService.getLocalStorageValue(LocalStorageKey.IntelligentCoolingCapability, undefined);
		if (this.cache) {
			// init ui
			this.showIC = this.cache.showIC;
			// if (this.showIC === 0) {
			// 	this.isPowerSmartSettingHidden.emit(true);
			// 	return;
			// }
			if (this.showIC === 6) {
				this.dytc6Mode = this.cache.captionText;
				this.dytc6IsAutoModeSupported = this.cache.autoModeToggle.available;
				return;
			}
			this.showIntelligentCoolingModes = this.cache.showIntelligentCoolingModes;
			this.captionText = this.cache.captionText !== '' ? this.translate.instant(this.cache.captionText) : '';
			this.showIntelligentCoolingToggle = this.cache.autoModeToggle.available;
			this.enableIntelligentCoolingToggle = this.cache.autoModeToggle.status;
			this.apsStatus = this.cache.apsState;
			this.selectedModeText = this.cache.selectedModeText !== '' ? this.translate.instant(this.cache.selectedModeText) : '';
			if (this.cache.mode) {
				this.setPerformanceAndCool(this.cache.mode);
			}
			this.isAutoTransitionEnabled = this.cache.isAutoTransitionEnabled;

		} else {
			this.cache = new IntelligentCoolingCapability();
		}
	}

	private hidePowerSmartSetting() {
		this.isSmartPowerSettingRemoved = true;
		this.showIC = 0;
		this.cache.showIC = this.showIC;
		this.commonService.setLocalStorageValue(LocalStorageKey.IntelligentCoolingCapability, this.cache);
		this.isPowerSmartSettingHidden.emit(true);
	}

	async checkDriverForThinkPad() {
		try {
			if (this.isYogo730()) {
				const isEMDriverAvailable = await this.getEMDriverStatus();
				if (!isEMDriverAvailable) {
					this.logger.info('PowerSmartSettingsComponent:isEMDriverAvailable', isEMDriverAvailable);
					this.hidePowerSmartSetting();
					return false;
				}
				this.initPowerSmartSettingsForThinkPad();
			} else {
				const isPMDriverAvailable = await this.getPMDriverStatus();
				if (!isPMDriverAvailable) {
					this.logger.info('PowerSmartSettingsComponent:isPMDriverAvailable', isPMDriverAvailable);
					this.hidePowerSmartSetting();
					return false;
				}
				this.initPowerSmartSettingsForThinkPad();
			}
		} catch (error) {
			this.logger.info('PowerSmartSettingsComponent:checkDriverForThinkPad', error);
			this.hidePowerSmartSetting();
		}
	}

	isYogo730() {
		const cacheMachineFamilyName = this.commonService.getLocalStorageValue(
			LocalStorageKey.MachineFamilyName,
			undefined
		);
		let isYogo730 = false;
		const regExForYoga730 = /YOGA 730/gi;
		if (cacheMachineFamilyName && (cacheMachineFamilyName.search(regExForYoga730) !== -1)) {
			isYogo730 = true;
		}
		return isYogo730;
	}
	onIntelligentCoolingToggle(event, isSetManualMode: boolean = true) {
		if (event.switchValue) {
			this.enableIntelligentCoolingToggle = true;
			this.showIntelligentCoolingModes = false;
		} else {
			this.showIntelligentCoolingModes = true;
			this.enableIntelligentCoolingToggle = false;
			if (isSetManualMode) {
				this.setManualModeSetting(IntelligentCoolingModes.Performance);
			}
		}
		if (!this.legacyManualModeCapability) {
			this.showIntelligentCoolingModes = false;
		}
		this.cache.showIC = this.showIC;
		this.cache.autoModeToggle.available = this.showIntelligentCoolingToggle;
		this.cache.autoModeToggle.status = this.enableIntelligentCoolingToggle;
		this.cache.showIntelligentCoolingModes = this.showIntelligentCoolingModes;
		this.cache.apsState = this.apsStatus;
		this.commonService.setLocalStorageValue(LocalStorageKey.IntelligentCoolingCapability, this.cache);
		this.setAutoModeSetting(event);
	}

	changeQuietCool(event) {
		this.setManualModeSetting(IntelligentCoolingModes.Cool);
	}

	changePerformance(event) {
		this.setManualModeSetting(IntelligentCoolingModes.Performance);
	}

	changeBatterySaving(event) {
		this.setManualModeSetting(IntelligentCoolingModes.BatterySaving);
	}

	public showMoreDytc6() {
		this.isCollapsed = !this.isCollapsed;
	}

	// Start Power Smart Settings for IdeaPad
	async initPowerSmartSettingsForIdeaPad() {
		try {
			const response = await this.powerService.getITSModeForICIdeapad();
			this.logger.debug('getITSModeForICIdeapad: ', response);
			if (response && !response.available) {
				this.hidePowerSmartSetting();
				return;
			}
			if (response && response.available) {
				// (response.itsVersion === 3 || response.itsVersion === 4 || response.itsVersion >= 5)
				if (response.itsVersion >= 3) {
					this.initPowerSmartSettingsUIForIdeaPad(response);
					this.startMonitorForICIdeapad();
				}
			}
		} catch (error) {
			this.logger.exception('initPowerSmartSettingsForIdeaPad: ', error);
			this.hidePowerSmartSetting();
			return EMPTY;
		}
	}

	initPowerSmartSettingsUIForIdeaPad(response: any) {
		try {
			if (response && response.available) {
				if (this.isSmartPowerSettingRemoved) {
					this.isPowerSmartSettingAdd.emit(true);
					this.isSmartPowerSettingRemoved = false;
				}
				if (response.itsVersion === 3) {
					this.intelligentCoolingModes = IntelligentCoolingHardware.ITS13;
					this.showIntelligentCoolingToggle = true;
					this.showIC = response.itsVersion + this.add;
					this.cache.showIC = this.showIC;
					this.captionText = this.translate.instant('device.deviceSettings.power.powerSmartSettings.description13');
					this.cache.captionText = 'device.deviceSettings.power.powerSmartSettings.description13';
					const currentMode = IntelligentCoolingModes.getModeForIdeaPadITS3(response.currentMode);
					if (currentMode === IntelligentCoolingModes.Error) {
						// need to make toggle button on
						const customEvent = { switchValue: true };
						this.onIntelligentCoolingToggle(customEvent, false);
					} else {
						// need to make toggle button off
						this.enableIntelligentCoolingToggle = false;
						this.showIntelligentCoolingModes = true;
						this.setPerformanceAndCool(currentMode);
					}
				} else if (response.itsVersion >= 4) {
					if (response.itsVersion === 4) {
						this.intelligentCoolingModes = IntelligentCoolingHardware.ITS14;
					} else if (response.itsVersion >= 5) {
						this.intelligentCoolingModes = IntelligentCoolingHardware.ITS15;
						this.isAutoTransitionVisible = true;
						if (Object.prototype.hasOwnProperty.call(response, 'isAutoTransitionEnabled')) {
							this.isAutoTransitionEnabled = response.isAutoTransitionEnabled;
						}
					}
					this.showIntelligentCoolingToggle = false;
					this.showIC = response.itsVersion + this.add;
					this.cache.showIC = this.showIC;
					this.captionText = this.translate.instant('device.deviceSettings.power.powerSmartSettings.description14');
					this.cache.captionText = 'device.deviceSettings.power.powerSmartSettings.description14';
					this.cache.isAutoTransitionEnabled = this.isAutoTransitionEnabled;
					const currentMode = IntelligentCoolingModes.getMode(response.currentMode);
					this.updateSelectedModeText(currentMode);
					this.setPerformanceAndCool(currentMode);
				}
			} else {
				this.hidePowerSmartSetting();
			}
		} catch (error) {
			this.logger.error('initPowerSmartSettingsUIForIdeaPad: ' + error.message);
			return EMPTY;
		}
	}

	callbackForStartMonitorICIdeapad(response: any) {
		this.initPowerSmartSettingsUIForIdeaPad(response);
	}

	startMonitorForICIdeapad() {
		try {
			if (this.powerService.isShellAvailable) {
				this.powerService.startMonitorForICIdeapad(this.callbackForStartMonitorICIdeapad.bind(this))
					.then((value: boolean) => { }).catch(error => {
						this.logger.error('startMonitorForICIdeapad', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('startMonitorForICIdeapad' + error.message);
			return EMPTY;
		}
	}

	stopMonitorForICIdeapad() {
		try {
			if (this.powerService.isShellAvailable) {
				this.powerService.stopMonitorForICIdeapad()
					.then((value: boolean) => { }).catch(error => {
						this.logger.error('stopMonitorForICIdeapad', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('stopMonitorForICIdeapad' + error.message);
			return EMPTY;
		}
	}

	updateSelectedModeText(mode: IntelligentCoolingModes) {
		let text = '';
		switch (mode) {
			case IntelligentCoolingModes.Cool:
				text = 'device.deviceSettings.power.powerSmartSettings.intelligentCooling.selectedModeText.quiteCool';
				break;
			case IntelligentCoolingModes.Performance:
				text = 'device.deviceSettings.power.powerSmartSettings.intelligentCooling.selectedModeText.performance';
				break;
			case IntelligentCoolingModes.BatterySaving:
				if (this.showIC ===14) {
					text = 'device.deviceSettings.power.powerSmartSettings.intelligentCooling.selectedModeText.batterySaving14';
				} else if (this.showIC >=15){
					text = 'device.deviceSettings.power.powerSmartSettings.intelligentCooling.selectedModeText.batterySaving15';
				}
				break;
		}
		this.selectedModeText = this.translate.instant(text);
		this.cache.selectedModeText = text;
		this.commonService.setLocalStorageValue(LocalStorageKey.IntelligentCoolingCapability, this.cache);
	}

	private setPowerSmartSettingsForIdeaPad(value: string) {
		try {
			if (this.powerService.isShellAvailable) {
				return this.powerService.setITSModeForICIdeapad(value);
			}
		} catch (error) {
			this.logger.error('setPowerSmartSettingsForIdeaPad :: ' + error.message);
			return EMPTY;
		}
	}


	// End Power Smart Settings for IdeaPad
	// =================== Start Power Smart Settings for ThinkPad
	async initPowerSmartSettingsForThinkPad() {
		try {
			let isITS = false;
			const itsServiceStatus = await this.getITSServiceStatus();
			const its = await this.getDYTCRevision();
			this.logger.info('PowerSmartSettingsComponent:initPowerSmartSettingsForThinkPad its version', its);
			if (itsServiceStatus && (its === 4 || its === 5 || its === 6)) {
				// ITS supported or DYTC 4 or 5
				isITS = true;
				this.intelligentCoolingModes = IntelligentCoolingHardware.ITS;
				if (its === 4) {
					this.captionText = this.translate.instant('device.deviceSettings.power.powerSmartSettings.description1');
					this.cache.captionText = 'device.deviceSettings.power.powerSmartSettings.description1';
					// DYTC 4 supported
					this.logger.info('PowerSmartSettingsComponent:initPowerSmartSettingsForThinkPad:: DYTC 4 supported');
					this.showIC = 4;
					this.cQLCapability = await this.getCQLCapability();
					this.tIOCapability = await this.getTIOCapability();
					this.logger.info('PowerSmartSettingsComponent:initPowerSmartSettingsForThinkPad:: cQLCapability: ' + this.cQLCapability + ', tIOCapability: ' + this.tIOCapability);
					const status = await this.getManualModeSetting();
					const mode = IntelligentCoolingModes.getMode(status);
					if (this.cQLCapability || this.tIOCapability) {
						this.showIntelligentCoolingToggle = true;
						if (mode.type === ICModes.Error) {
							const customEvent = { switchValue: this.enableIntelligentCoolingToggle };
							this.onIntelligentCoolingToggle(customEvent);
						}
					} else {
						this.captionText = this.translate.instant('device.deviceSettings.power.powerSmartSettings.nocqldesc');
						this.cache.captionText = 'device.deviceSettings.power.powerSmartSettings.nocqldesc';
						this.showIntelligentCoolingToggle = false;
					}
					this.setPerformanceAndCool(mode);
				} else if (its === 5) {
					// DYTC 5 supported
					this.logger.info('PowerSmartSettingsComponent:initPowerSmartSettingsForThinkPad:: DYTC 5 supported');
					this.showIC = 5;
					this.cache.showIC = this.showIC;
					this.commonService.setLocalStorageValue(LocalStorageKey.IntelligentCoolingCapability, this.cache);
				} else if (its === 6) {
					// DYTC 6 supported
					this.logger.info('PowerSmartSettingsComponent:initPowerSmartSettingsForThinkPad :: DYTC 6 supported');
					this.showIC = 6;
					this.cache.showIC = this.showIC;
					const amtCapability = await this.getAMTCapability();
					let amtSetting = await this.getAMTSetting();
					this.dytc6GetStatus(amtCapability, amtSetting);
					this.amtCapabilityInterval = setInterval(async () => {
						this.logger.debug('Trying after 30 seconds for getting AMT status');
						amtSetting = await this.getAMTSetting();
						this.dytc6GetStatus(amtCapability, amtSetting);
					}, 30000);
				}
			}
			if (!isITS) {
				// Check for Legacy Capable
				this.cQLCapability = await this.getLegacyCQLCapability();
				this.tIOCapability = 0 !== (await this.getLegacyTIOCapability());
				this.legacyManualModeCapability = await this.getLegacyManualModeCapability();
				if (!this.legacyManualModeCapability) {
					this.showIntelligentCoolingModes = false;
				}
				if (this.cQLCapability || this.tIOCapability || this.legacyManualModeCapability) {
					// Legacy Capable or DYTC 3.0
					this.captionText = this.translate.instant('device.deviceSettings.power.powerSmartSettings.description3');
					this.cache.captionText = 'device.deviceSettings.power.powerSmartSettings.description3';
					this.showIC = 3;
					this.intelligentCoolingModes = IntelligentCoolingHardware.Legacy;
					this.apsStatus = await this.getAPSState();
					// Start of fix for VAN-6839, changing appStatus true , to fix for VAN-6839.
					if (this.tIOCapability) {
						this.apsStatus = true;
					}
					this.cache.apsState = this.apsStatus;
					// end of fix for VAN-6839, changing appStatus true , to fix for VAN-6839.

					if ((this.cQLCapability || this.tIOCapability) && this.apsStatus) {
						this.showIntelligentCoolingToggle = true;
						this.enableIntelligentCoolingToggle = await this.getLegacyAutoModeState();

						const customEvent = { switchValue: this.enableIntelligentCoolingToggle };
						this.onIntelligentCoolingToggle(customEvent, false);
					} else {
						this.showIntelligentCoolingToggle = false;
					}
					const modeStatus = await this.getLegacyManualModeState();
					const modeType = modeStatus ? ICModes.Cool : ICModes.Performance;
					const mode = IntelligentCoolingModes.getMode(modeType);
					this.setPerformanceAndCool(mode);
				} else {
					this.hidePowerSmartSetting();
				}
			}
		} catch (error) {
			this.logger.error('initPowerSmartSettingsForThinkPad', error.message);
			this.hidePowerSmartSetting();
			return EMPTY;
		}
	}

	private dytc6GetStatus(amtCapability: boolean, amtSetting: boolean) {
		this.logger.info('PowerSmartSettingsComponent:initPowerSmartSettingsForThinkPad:: amtCapability', amtCapability);
		this.logger.info('PowerSmartSettingsComponent:initPowerSmartSettingsForThinkPad:: amtSetting', amtSetting);
		this.cache.autoModeToggle.available = amtCapability;
		this.cache.autoModeToggle.status = amtSetting;
		this.dytc6IsAutoModeSupported = amtCapability;
		if (amtCapability && amtSetting) {
			this.dytc6Mode = DYTC6Modes.Auto;
			this.cache.captionText = DYTC6Modes.Auto;

		} else if (amtCapability && !amtSetting) {
			this.dytc6Mode = DYTC6Modes.Manual;
			this.cache.captionText = DYTC6Modes.Manual;

		} else {
			// No auto mode case
			this.dytc6Mode = DYTC6Modes.Manual;
			this.cache.captionText = DYTC6Modes.Manual;
		}
		this.commonService.setLocalStorageValue(LocalStorageKey.IntelligentCoolingCapability, this.cache);
	}

	private getITSServiceStatus(): Promise<boolean> {
		try {
			if (this.powerService.isShellAvailable) {
				return this.powerService.getITSServiceStatus();
			}
		} catch (error) {
			this.logger.error('getITSServiceStatus', error.message);
		}
	}

	private getPMDriverStatus(): Promise<boolean> {
		try {
			if (this.powerService.isShellAvailable) {
				return this.powerService.getPMDriverStatus();
			}
		} catch (error) {
			this.logger.error('getPMDriverStatus', error.message);
		}
	}

	private getEMDriverStatus(): Promise<boolean> {
		try {
			if (this.powerService.isShellAvailable) {
				return this.powerService.getEMDriverStatus();
			}
		} catch (error) {
			this.logger.error('PowerSmartSettingsComponent:getEMDriverStatus', error.message);
		}
	}

	private getDYTCRevision(): Promise<number> {
		try {
			if (this.powerService.isShellAvailable) {
				return this.powerService.getDYTCRevision();
			}
		} catch (error) {
			this.logger.error('getDYTCRevision', error.message);
			return new Promise((resolve) => { resolve(6); });
		}
	}
	private setPerformanceAndCool(mode: IntelligentCoolingMode) {
		switch (mode.type) {
			case ICModes.Cool:
				this.radioQuietCool = true;
				this.radioPerformance = false;
				this.radioBatterySaving = false;
				// this.enableIntelligentCoolingToggle = false;
				break;
			case ICModes.Performance:
				this.radioPerformance = true;
				this.radioQuietCool = false;
				this.radioBatterySaving = false;
				// this.enableIntelligentCoolingToggle = false;
				break;
			case ICModes.Error:
				const customEvent = { switchValue: true };
				this.onIntelligentCoolingToggle(customEvent);
				this.enableIntelligentCoolingToggle = true;
				break;
			case IntelligentCoolingModes.BatterySaving.ideapadType4:
				this.radioPerformance = false;
				this.radioQuietCool = false;
				this.radioBatterySaving = true;
				break;
		}
		this.cache.mode = mode;
		this.cache.showIC = this.showIC;
		this.cache.apsState = this.apsStatus;
		this.cache.autoModeToggle.available = this.showIntelligentCoolingToggle;
		this.cache.autoModeToggle.status = this.enableIntelligentCoolingToggle;
		this.cache.showIntelligentCoolingModes = this.showIntelligentCoolingModes;
		this.commonService.setLocalStorageValue(LocalStorageKey.IntelligentCoolingCapability, this.cache);
	}
	private getCQLCapability() {
		try {
			if (this.powerService.isShellAvailable) {
				return this.powerService.getCQLCapability();
			}
		} catch (error) {
			this.logger.error('getCQLCapability ::' + error.message);
			return false;
		}
	}
	private getTIOCapability() {
		try {
			if (this.powerService.isShellAvailable) {
				return this.powerService.getTIOCapability();
			}
		} catch (error) {
			this.logger.error('getTIOCapability', error.message);
			return false;
		}
	}
	private async setAutoModeSetting(event: any) {
		try {
			if (this.intelligentCoolingModes === IntelligentCoolingHardware.ITS13) {
				if (event.switchValue) {
					await this.setPowerSmartSettingsForIdeaPad(IntelligentCoolingModes.Error.ideapadType3);
				} else {
					await this.setPowerSmartSettingsForIdeaPad(IntelligentCoolingModes.Performance.ideapadType3);
				}
			} else if (this.intelligentCoolingModes === IntelligentCoolingHardware.Legacy) {
				await this.setLegacyAutoModeState(event.switchValue);
			} else if (this.powerService.isShellAvailable) {
				this.powerService
					.setAutoModeSetting(event.switchValue)
					.then((value: boolean) => { })
					.catch(error => {
						this.logger.error('setAutoModeSetting', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('setAutoModeSetting', error.message);
			return EMPTY;
		}
	}
	private async setManualModeSetting(mode: IntelligentCoolingMode) {
		try {
			if (this.intelligentCoolingModes === IntelligentCoolingHardware.ITS13) {
				this.setPerformanceAndCool(mode);
				await this.powerService.setITSModeForICIdeapad(mode.ideapadType3);
			} else if (this.intelligentCoolingModes === IntelligentCoolingHardware.ITS14 || this.intelligentCoolingModes === IntelligentCoolingHardware.ITS15 || this.showIC >= 15) {
				this.updateSelectedModeText(mode);
				this.setPerformanceAndCool(mode);
				await this.powerService.setITSModeForICIdeapad(mode.ideapadType4);
				if (mode === IntelligentCoolingModes.Cool) {
					this.powerService.getITSModeForICIdeapad().then((response) => {
						this.initPowerSmartSettingsUIForIdeaPad(response);
					})
				}
			} else if (this.intelligentCoolingModes === IntelligentCoolingHardware.Legacy) {
				this.setPerformanceAndCool(mode);
				await this.setLegacyManualModeState(mode.status);
			} else if (this.powerService.isShellAvailable) {
				this.setPerformanceAndCool(mode);
				this.powerService
					.setManualModeSetting(mode.type)
					.then((value: boolean) => {
						this.setPerformanceAndCool(mode);
					})
					.catch(error => {
						this.logger.error('setManualModeSetting', error.message);
						return false;
					});
			}
		} catch (error) {
			this.logger.error('setManualModeSetting', error.message);
			return false;
		}
	}
	private getManualModeSetting() {
		try {
			if (this.powerService.isShellAvailable) {
				return this.powerService.getManualModeSetting();
			}
		} catch (error) {
			this.logger.error('getManualModeSetting', error.message);
			return 'error';
		}
	}

	// =============== Start Legacy
	private getAPSState() {
		try {
			if (this.powerService.isShellAvailable) {
				return this.powerService.getAPSState();
			}
		} catch (error) {
			this.logger.error('getAPSState', error.message);
			return false;
		}
	}

	private getLegacyCQLCapability() {
		try {
			if (this.powerService.isShellAvailable) {
				return this.powerService.getLegacyCQLCapability();
			}
		} catch (error) {
			this.logger.error('getLegacyCQLCapability', error.message);
			return false;
		}
	}
	private getLegacyTIOCapability() {
		try {
			if (this.powerService.isShellAvailable) {
				return this.powerService.getLegacyTIOCapability();
			}
		} catch (error) {
			this.logger.error('getLegacyTIOCapability', error.message);
			return 0;
		}
	}

	private getLegacyManualModeCapability() {
		try {
			if (this.powerService.isShellAvailable) {
				return this.powerService.getLegacyManualModeCapability();
			}
		} catch (error) {
			this.logger.error('getLegacyManualModeCapability', error.message);
			return false;
		}
	}
	private getLegacyAutoModeState() {
		try {
			if (this.powerService.isShellAvailable) {
				return this.powerService.getLegacyAutoModeState();
			}
		} catch (error) {
			this.logger.error('getLegacyAutoModeState', error.message);
			return false;
		}
	}
	private async getLegacyManualModeState() {
		try {
			if (this.powerService.isShellAvailable) {
				const mode1 = await this.powerService.getLegacyManualModeState();
				return mode1;
			}
		} catch (error) {
			this.logger.error('getLegacyManualModeState', error.message);
			return EMPTY;
		}
	}
	private setLegacyAutoModeState(value: boolean) {
		try {
			if (this.powerService.isShellAvailable) {
				return this.powerService.setLegacyAutoModeState(value);
			}
		} catch (error) {
			this.logger.error('setLegacyAutoModeState', error.message);
			return EMPTY;
		}
	}
	private setLegacyManualModeState(value: boolean) {
		try {
			if (this.powerService.isShellAvailable) {
				return this.powerService.setLegacyManualModeState(value);
			}
		} catch (error) {
			this.logger.error('setLegacyManualModeState', error.message);
			return EMPTY;
		}
	}
	// =============== End Legacy

	// ------------- Start DYTC 6.0 -------------------

	private getAMTCapability() {
		try {
			if (this.powerService.isShellAvailable) {
				return this.powerService.getAMTCapability();
			}
		} catch (error) {
			this.logger.exception('PowerSmartSettingsComponent:getAMTCapability', error);
			return false;
		}
	}

	private getAMTSetting() {
		try {
			if (this.powerService.isShellAvailable) {
				return this.powerService.getAMTSetting();
			}
		} catch (error) {
			this.logger.exception('PowerSmartSettingsComponent:getAMTSetting', error);
			return false;
		}
	}

	// ------------- End DYTC 6.0 -------------------
	// =================== End Power Smart Settings for ThinkPad

	coolingModesPopUp() {
		this.modalService.open(ModalIntelligentCoolingModesComponent, {
			backdrop: 'static',
			size: 'lg',
			keyboard: false,
			centered: true,
			windowClass: 'Intelligent-Cooling-Modes-Modal'
		}).result.then(
			result => {
				if (result === 'enable') {
					// this.toggleOnOff.emit($event);
				} else if (result === 'close') {
					// this.isSwitchChecked = !this.isSwitchChecked;
				}
			},
			reason => {
			}
		);
	}


	readMore(readMoreDiv: HTMLElement,$event:Event) {
		this.onReadMoreClick = true;
	
		if(readMoreDiv){
			readMoreDiv.style.display = 'block';
			//readMoreDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
			// const focusElement = readMoreDiv.querySelector('[tabindex = \'0\']') as HTMLElement;
			// Fix for Edge browser
			// window.scrollBy(0, 0);
			//if($event.type!=='click'){
				readMoreDiv.focus();
			//}
			
		}
		
	}

	ngOnDestroy() {
		this.stopMonitorForICIdeapad();
		clearInterval(this.amtCapabilityInterval);
	}

	onAutoTransitionToggle($event) {
		this.isAutoTransitionEnabled = $event
		if (this.powerService.isShellAvailable && this.isAutoTransitionVisible) {
			this.powerService.setAutoTransitionForICIdeapad($event)
			.then((isSuccess: boolean) => {
				if (isSuccess) {
					this.cache.isAutoTransitionEnabled = this.isAutoTransitionEnabled;
					this.commonService.setLocalStorageValue(LocalStorageKey.IntelligentCoolingCapability, this.cache);
				} else {
					setTimeout(() => {
					this.isAutoTransitionEnabled = !$event;	
					}, 0);
				}
				this.logger.info(`onAutoTransitionToggle.setAutoTransitionForICIdeapad after API ${isSuccess} ; $event: ${$event}`);
			})
		}
	}

	public autoTransitionReadMoreClick() {
		if (!this.autoTransitionIsReadMore) {
			const metricsData = {
				ItemParent: 'Device.MyDeviceSettings',
				ItemName: 'IntelligentCooling-5.0-AutoTransition-ReadMore',
				ItemType: 'FeatureClick',
				ItemValue: 'ExpandedToReadMore'
			};
			this.metricService.sendMetrics(metricsData);
		}
		this.autoTransitionIsReadMore = !this.autoTransitionIsReadMore
	}
}
