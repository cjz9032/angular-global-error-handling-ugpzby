import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PowerService } from 'src/app/services/power/power.service';
import {
	ICModes,
	IntelligentCoolingMode,
	IntelligentCoolingModes,
	IntelligentCoolingHardware } from 'src/app/enums/intelligent-cooling.enum';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalIntelligentCoolingModesComponent } from '../../modal/modal-intelligent-cooling-modes/modal-intelligent-cooling-modes.component';
const thinkpad = "thinkpad";
const ideapad = "ideapad";
@Component({
	selector: 'vtr-power-smart-settings',
	templateUrl: './power-smart-settings.component.html',
	styleUrls: ['./power-smart-settings.component.scss']
})
export class PowerSmartSettingsComponent implements OnInit {
	intelligentCoolingModes = IntelligentCoolingHardware.ITS
	dYTCRevision = 0;
	cQLCapability = false;
	tIOCapability = false;
	showIC = 0;
	showIntelligentCoolingToggle = true;
	radioPerformance = false;
	radioQuietCool = false;
	radioBatterySaving = false;
	selectedModeText = "";
	enableIntelligentCoolingToggle = false;
	apsStatus = false;
	showIntelligentCoolingModes = true;
	captionText = ""
	machineType = "";
	add = 0;
	onReadMoreClick: boolean;
	@Output() isPowerSmartSettingHidden = new EventEmitter<any>();

	constructor(
		public powerService: PowerService,
		private translate: TranslateService,
		public commonService: CommonService,
		public modalService: NgbModal) { }

	ngOnInit() {

		let machineInfo = this.commonService.getLocalStorageValue(LocalStorageKey.MachineInfo);
		this.machineType = machineInfo.subBrand.toLocaleLowerCase();
		console.log("Machine Type: " + this.machineType)
		if(thinkpad == this.machineType) {
			this.add = 0;//thinkpad
			this.initPowerSmartSettingsForThinkPad();
		} else if(ideapad == this.machineType) {
			this.add = 10;//Ideapad
			this.initPowerSmartSettingsForIdeaPad();
		}
	}

	onIntelligentCoolingToggle(event, isSetManualMode: boolean = true) {
		if (event.switchValue) {
			this.enableIntelligentCoolingToggle = true
			this.showIntelligentCoolingModes = false;
		} else {
			this.showIntelligentCoolingModes = true;
			this.enableIntelligentCoolingToggle = false;
			isSetManualMode ? this.setManualModeSetting(IntelligentCoolingModes.Performance) : "";
		}
		this.setAutoModeSetting(event);
	}

	changeQuietCool(event) {
		console.log('cool');
		this.setManualModeSetting(IntelligentCoolingModes.Cool);
	}

	changePerformance(event) {
		console.log('Performance');
		this.setManualModeSetting(IntelligentCoolingModes.Performance);
	}

	changeBatterySaving(event) {
		console.log('BatterySaving');
		this.setManualModeSetting(IntelligentCoolingModes.BatterySaving);
	}

	// Start Power Smart Settings for IdeaPad
	async initPowerSmartSettingsForIdeaPad() {
		try {
			let response = await this.powerService.getITSModeForICIdeapad();
			console.log("getITSModeForICIdeapad: " + response);
			if(response && response.available && response.errorCode) {
				if(response.itsVersion == 3) {
					this.intelligentCoolingModes = IntelligentCoolingHardware.ITS13;
					this.showIntelligentCoolingToggle = true;
					this.showIC = response.itsVersion + this.add;
					this.captionText = this.translate.instant("device.deviceSettings.power.powerSmartSettings.description13");
					let currentMode = IntelligentCoolingModes.getModeForIdeaPadITS3(response.currentMode);
					if(currentMode == IntelligentCoolingModes.Error) {
						// need to make toggle button on
						let customEvent = { switchValue: true }
						this.onIntelligentCoolingToggle(customEvent, false);
					} else {
						// need to make toggle button off
						this.setPerformanceAndCool(currentMode);
					}
				} else if(response.itsVersion == 4) {
					this.intelligentCoolingModes = IntelligentCoolingHardware.ITS14;
					this.showIntelligentCoolingToggle = false;
					this.showIC = response.itsVersion + this.add;
					this.captionText = this.translate.instant("device.deviceSettings.power.powerSmartSettings.description14");
					let currentMode = IntelligentCoolingModes.getMode(response.currentMode);
					this.updateSelectedModeText(currentMode);
					this.setPerformanceAndCool(currentMode);
				}
			}
		} catch (error) {
			console.error("initPowerSmartSettingsForIdeaPad: " + error.message);
		}
	}

	updateSelectedModeText(mode: IntelligentCoolingModes) {
		switch(mode) {
			case IntelligentCoolingModes.Cool:
				this.selectedModeText = this.translate.instant("device.deviceSettings.power.powerSmartSettings.intelligentCooling.selectedModeText.quiteCool");
				break;
			case IntelligentCoolingModes.Performance:
					this.selectedModeText = this.translate.instant("device.deviceSettings.power.powerSmartSettings.intelligentCooling.selectedModeText.performance");
					break;
			case IntelligentCoolingModes.BatterySaving:
					this.selectedModeText = this.translate.instant("device.deviceSettings.power.powerSmartSettings.intelligentCooling.selectedModeText.batterySaving");
					break;
		}
	}

	private setPowerSmartSettingsForIdeaPad(value: string) {
		try {
			if (this.powerService.isShellAvailable) {
				return this.powerService.setITSModeForICIdeapad(value);
			}
		} catch (error) {
			console.error(error.message);
		}
	}


	// End Power Smart Settings for IdeaPad
	//=================== Start Power Smart Settings for ThinkPad
	async initPowerSmartSettingsForThinkPad() {
		try {
			let isITS = false;
			let its = await this.getDYTCRevision();
			if (its == 4 || its == 5) {
				//ITS supported or DYTC 4 or 5
				isITS = true;
				this.intelligentCoolingModes = IntelligentCoolingHardware.ITS
				if (its == 4) {
					this.captionText = this.translate.instant("device.deviceSettings.power.powerSmartSettings.description1");
					// DYTC 4 supported
					console.log("DYTC 4 supported");
					this.showIC = 4;
					this.cQLCapability = await this.getCQLCapability();
					this.tIOCapability = await this.getTIOCapability();
					console.log("cQLCapability: " + this.cQLCapability + ", tIOCapability: " + this.tIOCapability);
					let status = await this.getManualModeSetting()
					let mode = IntelligentCoolingModes.getMode(status)
					if (this.cQLCapability || this.tIOCapability) {
						this.showIntelligentCoolingToggle = true;
						if (mode.type == ICModes.Error) {
							let customEvent = { switchValue: this.enableIntelligentCoolingToggle }
							this.onIntelligentCoolingToggle(customEvent);
						}
					} else {
						this.showIntelligentCoolingToggle = false;
					}
					this.setPerformanceAndCool(mode);
				} else if (its === 5) {
					// DYTC 5 supported
					console.log("DYTC 5 supported");
					this.showIC = 5;
				}
			}
			if (!isITS) {
				//Check for Legacy Capable
				this.cQLCapability = await this.getLegacyCQLCapability();
				this.tIOCapability = 0 != (await this.getLegacyTIOCapability());
				let legacyManualModeCapability = await this.getLegacyManualModeCapability();
				if (this.cQLCapability || this.tIOCapability || legacyManualModeCapability) {
					// Legacy Capable or DYTC 3.0
					this.captionText = this.translate.instant("device.deviceSettings.power.powerSmartSettings.description3");
					this.showIC = 3;
					this.intelligentCoolingModes = IntelligentCoolingHardware.Legacy;
					console.log("DYTC 3.0 supported");
					if (this.cQLCapability || this.tIOCapability) {
						this.showIntelligentCoolingToggle = true;
						this.enableIntelligentCoolingToggle = await this.getLegacyAutoModeState();

						let customEvent = { switchValue: this.enableIntelligentCoolingToggle }
						this.onIntelligentCoolingToggle(customEvent, false);
					} else {
						this.showIntelligentCoolingToggle = false;
					}
					let modeStatus = await this.getLegacyManualModeState();
					let modeType = modeStatus ? ICModes.Cool : ICModes.Performance;
					let mode = IntelligentCoolingModes.getMode(modeType);
					this.setPerformanceAndCool(mode);
					this.apsStatus = await this.getAPSState();
				} else {
					console.log("Intelligent Cooling Not Supported");
					this.showIC = 0;
					this.isPowerSmartSettingHidden.emit(true);
				}
			}
		} catch (error) {
			console.error(error.message);
		}
	}

	private getDYTCRevision(): Promise<number> {
		try {
			if (this.powerService.isShellAvailable) {
				return this.powerService.getDYTCRevision();
			}
		} catch (error) {
			console.error(error.message);
		}
	}
	private setPerformanceAndCool(mode: IntelligentCoolingMode) {
		switch (mode.type) {
			case ICModes.Cool:
				console.log('manualModeSettingStatus: Cool');
				this.radioQuietCool = true;
				this.radioPerformance = false;
				this.radioBatterySaving = false;
				//this.enableIntelligentCoolingToggle = false;
				break;
			case ICModes.Performance:
				console.log('manualModeSettingStatus: Performance');
				this.radioPerformance = true;
				this.radioQuietCool = false;
				this.radioBatterySaving = false;
				//this.enableIntelligentCoolingToggle = false;
				break;
			case ICModes.Error:
				let customEvent = { switchValue: true }
				this.onIntelligentCoolingToggle(customEvent);
				this.enableIntelligentCoolingToggle = true;
				console.log('manualModeSettingStatus: error');
				break;
			case IntelligentCoolingModes.BatterySaving.ideapadType4:
				console.log('manualModeSettingStatus: Performance');
				this.radioPerformance = false;
				this.radioQuietCool = false;
				this.radioBatterySaving = true;
				break;
		}
	}
	private getCQLCapability() {
		try {
			if (this.powerService.isShellAvailable) {
				return this.powerService.getCQLCapability()
			}
		} catch (error) {
			console.error(error.message);
		}
	}
	private getTIOCapability() {
		try {
			if (this.powerService.isShellAvailable) {
				return this.powerService.getTIOCapability()
			}
		} catch (error) {
			console.error(error.message);
		}
	}
	private async setAutoModeSetting(event: any) {
		try {
			if (this.intelligentCoolingModes == IntelligentCoolingHardware.ITS13) {
				if(event.switchValue) {
					await this.setPowerSmartSettingsForIdeaPad(IntelligentCoolingModes.Error.ideapadType3)
				} else {
					await this.setPowerSmartSettingsForIdeaPad(IntelligentCoolingModes.Performance.ideapadType3)
				}
			}
			else if (this.intelligentCoolingModes == IntelligentCoolingHardware.Legacy) {
				await this.setLegacyAutoModeState(event.switchValue);
			}
			else if (this.powerService.isShellAvailable) {
				this.powerService
					.setAutoModeSetting(event.switchValue)
					.then((value: boolean) => {
						console.log('setAutoModeSetting.then', value);
					})
					.catch(error => {
						console.error('setAutoModeSetting', error);
					});
			}
		} catch (error) {
			console.error(error.message);
		}
	}
	private async setManualModeSetting(mode: IntelligentCoolingMode) {
		try {
			if (this.intelligentCoolingModes == IntelligentCoolingHardware.ITS13) {
				await this.powerService.setITSModeForICIdeapad(mode.ideapadType3);
				this.setPerformanceAndCool(mode)
			}
			if (this.intelligentCoolingModes == IntelligentCoolingHardware.ITS14) {
				await this.powerService.setITSModeForICIdeapad(mode.ideapadType4);
				this.setPerformanceAndCool(mode)
			}
			if (this.intelligentCoolingModes == IntelligentCoolingHardware.Legacy) {
				await this.setLegacyManualModeState(mode.status);
				this.setPerformanceAndCool(mode)
			}
			else if (this.powerService.isShellAvailable) {
				this.powerService
					.setManualModeSetting(mode.type)
					.then((value: boolean) => {
						console.log('setManualModeSetting.then', value);
						this.setPerformanceAndCool(mode)
					})
					.catch(error => {
						console.error('setManualModeSetting', error);
					});
			}
		} catch (error) {
			console.error(error.message);
		}
	}
	private getManualModeSetting() {
		try {
			if (this.powerService.isShellAvailable) {
				return this.powerService.getManualModeSetting()
			}
		} catch (error) {
			console.error(error.message);
		}
	}

	//=============== Start Legacy
	private getAPSState() {
		try {
			if (this.powerService.isShellAvailable) {
				return this.powerService.getAPSState()
			}
		} catch (error) {
			console.error(error.message);
		}
	}

	private getLegacyCQLCapability() {
		try {
			if (this.powerService.isShellAvailable) {
				return this.powerService.getLegacyCQLCapability()
			}
		} catch (error) {
			console.error(error.message);
		}
	}
	private getLegacyTIOCapability() {
		try {
			if (this.powerService.isShellAvailable) {
				return this.powerService.getLegacyTIOCapability()
			}
		} catch (error) {
			console.error(error.message);
		}
	}

	private getLegacyManualModeCapability() {
		try {
			if (this.powerService.isShellAvailable) {
				return this.powerService.getLegacyManualModeCapability()
			}
		} catch (error) {
			console.error(error.message);
		}
	}
	private getLegacyAutoModeState() {
		try {
			if (this.powerService.isShellAvailable) {
				return this.powerService.getLegacyAutoModeState()
			}
		} catch (error) {
			console.error(error.message);
		}
	}
	private async getLegacyManualModeState() {
		try {
			if (this.powerService.isShellAvailable) {
				let mode1 = await this.powerService.getLegacyManualModeState();
				console.log("getLegacyManualModeState: " + mode1)
				return mode1;
			}
		} catch (error) {
			console.error(error.message);
		}
	}
	private setLegacyAutoModeState(value: boolean) {
		try {
			if (this.powerService.isShellAvailable) {
				return this.powerService.setLegacyAutoModeState(value)
			}
		} catch (error) {
			console.error(error.message);
		}
	}
	private setLegacyManualModeState(value: boolean) {
		try {
			if (this.powerService.isShellAvailable) {
				return this.powerService.setLegacyManualModeState(value)
			}
		} catch (error) {
			console.error(error.message);
		}
	}
	//=============== End Legacy
	//=================== End Power Smart Settings for ThinkPad

	coolingModesPopUp() {
		console.log("modal open");
		this.modalService.open(ModalIntelligentCoolingModesComponent,  {
			backdrop: 'static',
			size: 'sm',
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

	readMore() {
		this.onReadMoreClick = true;
	}
}
