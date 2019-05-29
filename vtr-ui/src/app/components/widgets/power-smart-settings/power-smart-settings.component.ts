import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PowerService } from 'src/app/services/power/power.service';
import { 
	ICModes, 
	IntelligentCoolingMode, 
	IntelligentCoolingModes, 
	IntelligentCoolingHardware } from 'src/app/enums/intelligent-cooling.enum';

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
	enableIntelligentCoolingToggle = false;
	apsStatus = false;
	showIntelligentCoolingModes = true;
	@Output() isPowerSmartSettingHidden = new EventEmitter<any>();

	constructor(public powerService: PowerService) { }

	ngOnInit() {
		this.initPowerSmartSettings();
	}

	onIntelligentCoolingToggle(event) {
		if (event.switchValue) {
			this.enableIntelligentCoolingToggle = true
			this.showIntelligentCoolingModes = false;
		} else {
			this.showIntelligentCoolingModes = true;
			this.enableIntelligentCoolingToggle = false;
			this.setManualModeSetting(IntelligentCoolingModes.Performance);
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
	// Power Smart Settings
	async initPowerSmartSettings() {
		try {
			let isITS = false;
			let its = await this.getDYTCRevision();
			if (its == 4 || its == 5) {
				//ITS supported or DYTC 4 or 5
				isITS = true;
				this.intelligentCoolingModes = IntelligentCoolingHardware.ITS
				if (its == 4) {
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
					this.showIC = 3;
					this.intelligentCoolingModes = IntelligentCoolingHardware.Legacy;
					console.log("DYTC 3.0 supported");
					if (this.cQLCapability || this.tIOCapability) {
						this.showIntelligentCoolingToggle = true;
						this.enableIntelligentCoolingToggle = await this.getLegacyAutoModeState();
						let customEvent = { switchValue: this.enableIntelligentCoolingToggle }
						this.onIntelligentCoolingToggle(customEvent);
					} else {
						this.showIntelligentCoolingToggle = false;
					}
					let status = await this.getLegacyManualModeState();
					let modeType = status ? ICModes.Cool : ICModes.Performance;
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
				//this.enableIntelligentCoolingToggle = false;
				break;
			case ICModes.Performance:
				console.log('manualModeSettingStatus: Performance');
				this.radioPerformance = true;
				this.radioQuietCool = false;
				//this.enableIntelligentCoolingToggle = false;
				break;
			case ICModes.Error:
				let customEvent = { switchValue: true }
				this.onIntelligentCoolingToggle(customEvent);
				this.enableIntelligentCoolingToggle = true;
				console.log('manualModeSettingStatus: error');
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
			if (this.intelligentCoolingModes == IntelligentCoolingHardware.Legacy) {
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
	private getLegacyManualModeState() {
		try {
			if (this.powerService.isShellAvailable) {
				return this.powerService.getLegacyManualModeState()
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
	//=============== Start End 
	// End Power Smart Settings
}
