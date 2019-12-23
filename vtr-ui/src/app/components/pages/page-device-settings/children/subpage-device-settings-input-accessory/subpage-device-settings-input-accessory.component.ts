import { Component, OnInit } from '@angular/core';
import { InputAccessoriesService } from 'src/app/services/input-accessories/input-accessories.service';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { InputAccessoriesCapability } from 'src/app/data-models/input-accessories/input-accessories-capability.model';
import WinRT from '@lenovo/tan-client-bridge/src/util/winrt';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { EMPTY } from 'rxjs';
import { RouteHandlerService } from 'src/app/services/route-handler/route-handler.service';
import { VoipApp } from '../../../../../data-models/input-accessories/voip.model';
import { VoipErrorCodeEnum } from '../../../../../enums/voip.enum';

@Component({
	selector: 'vtr-subpage-device-settings-input-accessory',
	templateUrl: './subpage-device-settings-input-accessory.component.html',
	styleUrls: ['./subpage-device-settings-input-accessory.component.scss']
})
export class SubpageDeviceSettingsInputAccessoryComponent implements OnInit {

	title = 'device.deviceSettings.inputAccessories.title';
	public shortcutKeys: any[] = [];
	public privacyIcon = '/assets/images/keyboard-images/KeyboarmMap_Icons/Privacy-Screen.png';
	public kbdBlIcon = '/assets/images/keyboard-images/KeyboarmMap_Icons/KBD-BL.png';
	public merlynIcon = '/assets/images/keyboard-images/KeyboarmMap_Icons/Merlyn-Perf-mode.png';
	public zoomIcon = '/assets/images/keyboard-images/KeyboarmMap_Icons/Zoom-app.png';

	public image = '';
	public additionalCapabilitiesObj: any = {};
	public machineType: number;
	public keyboardCompatibility: boolean;
	public switchValue = false;
	public stickyFunStatus = false;
	public isTouchPadVisible = false;
	public isMouseVisible = false;

	public inputAccessoriesCapability: InputAccessoriesCapability;
	public selectedApp: VoipApp;
	public installedApps: VoipApp[] = [];
	public showVoipHotkeysSection = false;
	public isAppInstalled = false;
	voipAppName = ['Skype For Business 2016', 'Microsoft Teams'];
	iconName: string[] = ['icon-s4b', 'icon-teams'];

	hasUDKCapability = false;

	constructor(
		routeHandler: RouteHandlerService, // logic is added in constructor, no need to call any method
		private keyboardService: InputAccessoriesService,
		private commonService: CommonService,
		private logger: LoggerService
	) { }

	ngOnInit() {
		this.machineType = this.commonService.getLocalStorageValue(LocalStorageKey.MachineType);
		if (this.machineType === 1) {
			this.initDataFromCache();
			if (this.keyboardCompatibility) {
				this.getKBDLayoutName();
			}
			// udk capability
			const inputAccessoriesCapability: InputAccessoriesCapability = this.commonService.getLocalStorageValue(LocalStorageKey.InputAccessoriesCapability);
			this.hasUDKCapability = inputAccessoriesCapability.isUdkAvailable;
		}
		this.getMouseAndTouchPadCapability();
		this.getVoipHotkeysSettings();
	}

	getVoipHotkeysSettings() {
		this.keyboardService.getVoipHotkeysSettings()
			.then(res => {
				if (+res.errorCode !== VoipErrorCodeEnum.SUCCEED || !res.capability) {
					return res;
				}
				this.showVoipHotkeysSection = true;
				res.appList.forEach(app => {
					if (app.isAppInstalled) {
						this.isAppInstalled = true;
					}
					if (app.isSelected) {
						this.selectedApp = app;
					}
				});
				if (this.isAppInstalled) {
					this.installedApps = res.appList;
				}
			})
			.catch(error => {
				console.log('getVoipHotkeysSettings error', error);
			});
	}

	setVoipHotkeysSettings(app: VoipApp) {
		const prev = this.selectedApp;
		this.selectedApp = app;
		this.keyboardService.setVoipHotkeysSettings(app.appName)
			.then(VoipResponse => {
				if (+VoipResponse.errorCode !== VoipErrorCodeEnum.SUCCEED) {
					this.selectedApp.isSelected = false;
					this.selectedApp = prev;
					this.selectedApp.isSelected = true;
					return VoipResponse;
				}
				this.installedApps = VoipResponse.appList;
			})
			.catch(error => {
				console.log('setVoipHotkeysSettings error', error);
			});
	}

	initDataFromCache() {
		this.initHiddenKbdFnFromCache();
	}

	initHiddenKbdFnFromCache() {
		try {
			this.inputAccessoriesCapability = this.commonService.getLocalStorageValue(LocalStorageKey.InputAccessoriesCapability, undefined);
			if (this.inputAccessoriesCapability !== undefined) {
				this.keyboardCompatibility = this.inputAccessoriesCapability.isKeyboardMapAvailable;
				if (this.inputAccessoriesCapability.image && this.inputAccessoriesCapability.image.length > 0) {
					this.image = this.inputAccessoriesCapability.image;
				}
				if (this.inputAccessoriesCapability.additionalCapabilitiesObj) {
					this.additionalCapabilitiesObj = this.inputAccessoriesCapability.additionalCapabilitiesObj;
					if (this.keyboardCompatibility && this.inputAccessoriesCapability.keyboardLayoutName) {
						this.getAdditionalCapabilitiesFromCache();
					}

				}
			} else {
				this.inputAccessoriesCapability = new InputAccessoriesCapability();
			}
		} catch (error) {
			console.log('initHiddenKbdFnFromCache', error);
		}
	}

	getAdditionalCapabilitiesFromCache() {
		this.shortcutKeys = [];
		if (this.additionalCapabilitiesObj.performance) {
			this.shortcutKeys.push('device.deviceSettings.inputAccessories.inputAccessory.firstKeyObj');
		}

		this.shortcutKeys.push('device.deviceSettings.inputAccessories.inputAccessory.secondKeyObj');

		if (this.additionalCapabilitiesObj.privacy) {
			this.shortcutKeys.push('device.deviceSettings.inputAccessories.inputAccessory.thirdKeyObj');
		}
		if (this.additionalCapabilitiesObj.magnifier) {
			this.shortcutKeys.push('device.deviceSettings.inputAccessories.inputAccessory.fourthKeyObj');
		}
		if (this.additionalCapabilitiesObj.backLight) {
			this.shortcutKeys.push('device.deviceSettings.inputAccessories.inputAccessory.fifthKeyObj');
		}
	}

	// To get Keyboard Layout Name
	public getKBDLayoutName() {
		try {
			if (this.keyboardService.isShellAvailable) {
				this.keyboardService.GetKBDLayoutName().then((value: any) => {
					this.inputAccessoriesCapability.keyboardLayoutName = value;
					this.commonService.setLocalStorageValue(LocalStorageKey.InputAccessoriesCapability, this.inputAccessoriesCapability);
					if (value) {
						this.getKBDMachineType(value);
					}
				})
					.catch(error => {
						this.logger.error('keyboard Layout name error here', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('getKBDLayoutName', error.message);
			return EMPTY;
		}
	}

	// To get Machine Type
	public getKBDMachineType(layOutName) {
		try {
			if (this.keyboardService.isShellAvailable) {
				this.keyboardService.GetKBDMachineType().then((value: any) => {
					this.getKeyboardMap(layOutName, value);
					this.inputAccessoriesCapability.image = this.image;
					this.commonService.setLocalStorageValue(LocalStorageKey.InputAccessoriesCapability, this.inputAccessoriesCapability);
					this.getAdditionalCapabilities();
				})
					.catch(error => {
						this.logger.error('keyboard Layout name error here', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('getKBDMachineType', error.message);
			return EMPTY;
		}
	}
	// To display the keyboard map image
	public getKeyboardMap(layOutName, machineType) {
		const type = machineType.toLowerCase();
		this.image = 'assets/images/keyboard-images/KeyboardMap_Images/Standered.png';
		switch (layOutName.toLowerCase()) {
			case 'standered':
				if (type === 'other') {

					this.image = 'assets/images/keyboard-images/KeyboardMap_Images/Standered.png';
					return this.image;
				} else {
					this.image = 'assets/images/keyboard-images/KeyboardMap_Images/GrafEvo/Standered.png';
					return this.image;
				}
				break;
			case 'belgium':
				if (type === 'other') {
					this.image = 'assets/images/keyboard-images/KeyboardMap_Images/Belgium.png';
					return this.image;
				} else {
					this.image = 'assets/images/keyboard-images/KeyboardMap_Images/GrafEvo/Belgium.png';
					return this.image;
				}
				break;
			case 'french':
				if (type === 'other') {

					this.image = 'assets/images/keyboard-images/KeyboardMap_Images/French.png';
					return this.image;
				} else {
					this.image = 'assets/images/keyboard-images/KeyboardMap_Images/GrafEvo/French.png';
					return this.image;
				}
				break;
			case 'french_canadian':
				if (type === 'other') {
					this.image = 'assets/images/keyboard-images/KeyboardMap_Images/French_Canadian.png';
					return this.image;
				} else {
					this.image = 'assets/images/keyboard-images/KeyboardMap_Images/GrafEvo/French_Canadian.png';
					return this.image;
				}
				break;
			case 'german':
				if (type === 'other') {
					this.image = 'assets/images/keyboard-images/KeyboardMap_Images/German.png';
					return this.image;
				} else {
					this.image = 'assets/images/keyboard-images/KeyboardMap_Images/GrafEvo/German.png';
					return this.image;
				}
				break;
			case 'italian':
				if (type === 'other') {
					this.image = 'assets/images/keyboard-images/KeyboardMap_Images/Italian.png';
					return this.image;
				} else {
					this.image = 'assets/images/keyboard-images/KeyboardMap_Images/GrafEvo/Italian.png';
					return this.image;
				}
				break;
			case 'spanish':
				if (type === 'other') {
					this.image = 'assets/images/keyboard-images/KeyboardMap_Images/Spanish.png';
					return this.image;
				} else {
					this.image = 'assets/images/keyboard-images/KeyboardMap_Images/GrafEvo/Spanish.png';
					return this.image;
				}
				break;
			case 'turkish_':
				if (type === 'other') {
					this.image = 'assets/images/keyboard-images/KeyboardMap_Images/Turkish_F.png';
					return this.image;
				} else {
					this.image = 'assets/images/keyboard-images/KeyboardMap_Images/GrafEvo/Turkish_F.png';
					return this.image;
				}
				break;
			default:
				this.image = 'assets/images/keyboard-images/KeyboardMap_Images/Standered.png';
		}
	}
	// To get Additional Capability Status
	public getAdditionalCapabilities() {
		this.shortcutKeys = [];
		try {
			if (this.keyboardService.isShellAvailable) {
				Promise.all([
					this.keyboardService.GetKbdHiddenKeyPerformanceModeCapability(),
					this.keyboardService.GetKbdHiddenKeyPrivacyFilterCapability(),
					this.keyboardService.GetKbdHiddenKeyMagnifierCapability(),
					this.keyboardService.GetKbdHiddenKeyBackLightCapability(),

				]).then((response: any[]) => {
					// console.log('promise all resonse  here -------------.>', response);
					if (response && response.length) {
						if (response[0]) {
							this.shortcutKeys.push('device.deviceSettings.inputAccessories.inputAccessory.firstKeyObj');
						}
						this.shortcutKeys.push('device.deviceSettings.inputAccessories.inputAccessory.secondKeyObj');

						if (response[1]) {
							this.shortcutKeys.push('device.deviceSettings.inputAccessories.inputAccessory.thirdKeyObj');
						}
						if (response[2]) {
							this.shortcutKeys.push('device.deviceSettings.inputAccessories.inputAccessory.fourthKeyObj');
						}
						if (response[3]) {
							this.shortcutKeys.push('device.deviceSettings.inputAccessories.inputAccessory.fifthKeyObj');
						}
						this.additionalCapabilitiesObj = {
							performance: response[0],
							privacy: response[1],
							magnifier: response[2],
							backLight: response[3],
						};
						this.inputAccessoriesCapability.additionalCapabilitiesObj = this.additionalCapabilitiesObj;
						this.commonService.setLocalStorageValue(LocalStorageKey.InputAccessoriesCapability, this.inputAccessoriesCapability);
					}
				});
			}
		} catch (error) {
			this.logger.error('getAdditionalCapabilities', error.message);
			return EMPTY;
		}
	}
	fnCtrlKey(event) {
		this.switchValue = event.switchValue;
	}

	public launchProtocol(protocol: string) {
		if (this.keyboardService.isShellAvailable && protocol && protocol.length > 0) {
			WinRT.launchUri(protocol);
		}
	}

	public getMouseAndTouchPadCapability() {
		if (this.keyboardService.isShellAvailable) {
			Promise.all([
				this.keyboardService.getMouseCapability(),
				this.keyboardService.getTouchPadCapability()
			]).then((responses: any[]) => {
				this.logger.info('SubpageDeviceSettingsInputAccessoryComponent: getMouseAndTouchPadCapability.response', responses);
				this.isMouseVisible = responses[0];
				this.isTouchPadVisible = responses[1];
			}).catch((error) => {
				this.logger.error('SubpageDeviceSettingsInputAccessoryComponent: error in getMouseAndTouchPadCapability.Promise.all()', error);
			});
		}
	}
}
