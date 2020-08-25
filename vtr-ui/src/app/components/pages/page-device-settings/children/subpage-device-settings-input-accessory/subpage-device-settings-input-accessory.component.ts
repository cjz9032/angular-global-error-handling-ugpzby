import { Component, OnDestroy, OnInit } from '@angular/core';
import WinRT from '@lenovo/tan-client-bridge/src/util/winrt';
import { EMPTY, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { InputAccessoriesCapability } from 'src/app/data-models/input-accessories/input-accessories-capability.model';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { BatteryDetailService } from 'src/app/services/battery-detail/battery-detail.service';
import { CommonService } from 'src/app/services/common/common.service';
import { InputAccessoriesService } from 'src/app/services/input-accessories/input-accessories.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { RouteHandlerService } from 'src/app/services/route-handler/route-handler.service';
import { StringBooleanEnum } from '../../../../../data-models/common/common.interface';
import { VoipApp } from '../../../../../data-models/input-accessories/voip.model';
import { VoipErrorCodeEnum } from '../../../../../enums/voip.enum';
import { BacklightLevelEnum } from './backlight/backlight.enum';
import { BacklightService } from './backlight/backlight.service';
import { TopRowFunctionsIdeapadService } from './top-row-functions-ideapad/top-row-functions-ideapad.service';
import { UiCircleRadioWithCheckBoxListModel } from 'src/app/components/ui/ui-circle-radio-with-checkbox-list/ui-circle-radio-with-checkbox-list.model';

@Component({
	selector: 'vtr-subpage-device-settings-input-accessory',
	templateUrl: './subpage-device-settings-input-accessory.component.html',
	styleUrls: ['./subpage-device-settings-input-accessory.component.scss']
})
export class SubpageDeviceSettingsInputAccessoryComponent implements OnInit, OnDestroy {

	title = 'device.deviceSettings.inputAccessories.title';
	public shortcutKeys: any[] = [];
	public privacyIcon = 'assets/images/keyboard-images/KeyboarmMap_Icons/Privacy-Screen.png';
	public kbdBlIcon = 'assets/images/keyboard-images/KeyboarmMap_Icons/KBD-BL.png';
	public merlynIcon = 'assets/images/keyboard-images/KeyboarmMap_Icons/Merlyn-Perf-mode.png';
	public zoomIcon = 'assets/images/keyboard-images/KeyboarmMap_Icons/Zoom-app.png';
	public imagePath = 'assets/images/keyboard-images/KeyboardMap_Images/';
	public imagePathGrafEvo = 'assets/images/keyboard-images/KeyboardMap_Images/GrafEvo/';
	public imagePathCS20 = 'assets/images/keyboard-images/KeyboardMap_Images/CS20/';
	public imagesArray: string[] = ['Belgium.png', 'French.png', 'French_Canadian.png', 'German.png', 'Italian.png', 'Spanish.png', 'Turkish_F.png', 'Standered.png'];
	public image = '';
	public additionalCapabilitiesObj: any = {};
	public machineType: number;
	public keyboardCompatibility: boolean;
	public stickyFunStatus = false;
	public isTouchPadVisible = false;
	public isMouseVisible = false;
	public keyboardVersion: string;

	public selectedApp: VoipApp;
	public installedApps: VoipApp[] = [];
	public voipUIModel: Array<UiCircleRadioWithCheckBoxListModel> = [];
	public showVoipHotkeysSection = false;
	public isAppInstalled = false;
	public fnCtrlSwapCapability = false;
	public fnCtrlSwapStatus = false;
	public fnAsCtrlCapability = false;
	public fnAsCtrlStatus = false;
	public isRestartRequired = false;
	voipAppName = ['Skype For Business 2016', 'Microsoft Teams'];
	iconName: string[] = ['skype-business', 'microsoft-teams'];
	public tooltipString = 'device.deviceSettings.inputAccessories.fnCtrlKey.tootTip.';

	public inputAccessoriesCapability: InputAccessoriesCapability;
	hasUDKCapability = false;
	fnLockCapability = false;
	cacheFound = false;
	public isFrenchKeyboard = false;
	private topRowFunctionsIdeapadSubscription: Subscription;
	backlightCapability$: Observable<boolean>;
	public fnCtrlKeyTooltipContent = [];
	public isKbdBacklightAvailable = true;

	constructor(
		routeHandler: RouteHandlerService, // logic is added in constructor, no need to call any method
		private keyboardService: InputAccessoriesService,
		private topRowFunctionsIdeapadService: TopRowFunctionsIdeapadService,
		private commonService: CommonService,
		private logger: LoggerService,
		private backlightService: BacklightService,
		private batteryService: BatteryDetailService
	) {
	}

	ngOnInit() {
		this.commonService.checkPowerPageFlagAndHide();
		this.machineType = this.commonService.getLocalStorageValue(LocalStorageKey.MachineType);
		this.batteryService.getBatterySettings();
		if (this.machineType === 1) {
			this.initDataFromCache();
			if (this.keyboardCompatibility) {
				this.getKBDLayoutName();
			}
			// udk capability
			const inputAccessoriesCapability: InputAccessoriesCapability = this.commonService.getLocalStorageValue(LocalStorageKey.InputAccessoriesCapability, undefined);
			if (inputAccessoriesCapability) {
				this.hasUDKCapability = inputAccessoriesCapability.isUdkAvailable;
			}

			this.getFnCtrlSwapCapability();
			this.getFnAsCtrlCapability();
		}
		this.getMouseAndTouchPadCapability();
		this.getVoipHotkeysSettings();
		this.topRowFunctionsIdeapadSubscription = this.topRowFunctionsIdeapadService.capability.subscribe(capabilities => {
			capabilities.forEach(capability => {
				if (capability.key === 'FnLock' && capability.value === StringBooleanEnum.TRUTHY) {
					this.fnLockCapability = true;
				}
			});
		});
		this.backlightCapability$ = this.backlightService.backlight.pipe(
			map(res => res.find(item => item.key === 'KeyboardBacklightLevel')),
			map(res => res.value !== BacklightLevelEnum.NO_CAPABILITY)
		);

		this.keyboardService.getTopRowFnLockCapability().then(res => {
			this.fnLockCapability = res;
		});
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
					this.setUpVoipUIModel();
				}
			})
			.catch(error => {
				this.logger.error('getVoipHotkeysSettings error', error);
			});
	}

	setVoipHotkeysSettings(model: UiCircleRadioWithCheckBoxListModel) {
		this.keyboardService.setVoipHotkeysSettings(+model.value)
			.then(VoipResponse => {
				if (+VoipResponse.errorCode !== VoipErrorCodeEnum.SUCCEED) {
					this.updateVoipUIModel(model.value);
					return VoipResponse;
				}
				this.installedApps = VoipResponse.appList;
				this.setUpVoipUIModel();
			})
			.catch(error => {
				this.logger.error('setVoipHotkeysSettings error', error);
			});
	}

	initDataFromCache() {
		this.initHiddenKbdFnFromCache();
	}

	initHiddenKbdFnFromCache() {
		try {
			this.inputAccessoriesCapability = this.commonService.getLocalStorageValue(LocalStorageKey.InputAccessoriesCapability, undefined);
			this.logger.error('initHiddenKbdFnFromCache capability from cache', this.inputAccessoriesCapability);
			if (this.inputAccessoriesCapability) {
				this.cacheFound = true;
				this.keyboardCompatibility = this.inputAccessoriesCapability.isKeyboardMapAvailable;
				this.keyboardVersion = this.inputAccessoriesCapability.keyboardVersion;
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
				this.cacheFound = false;
				this.keyboardService.GetAllCapability().then((response => {
					this.keyboardCompatibility = (response != null && Object.keys(response).indexOf('keyboardMapCapability') !== -1) ? response.keyboardMapCapability : false;
					this.inputAccessoriesCapability.isKeyboardMapAvailable = this.keyboardCompatibility;
					this.commonService.setLocalStorageValue(LocalStorageKey.InputAccessoriesCapability, this.inputAccessoriesCapability);
					if (!this.cacheFound && this.keyboardCompatibility) {
						this.getKBDLayoutName();
					}
				}));
			}
		} catch (error) {
			this.logger.exception('initHiddenKbdFnFromCache', error);
		}
	}

	getAdditionalCapabilitiesFromCache() {
		this.shortcutKeys = [];
		if (this.additionalCapabilitiesObj.performance) {
			this.shortcutKeys.push({ text: 'device.deviceSettings.inputAccessories.inputAccessory.fourthKeyObj', id: 'FnQ' });
		}

		this.shortcutKeys.push({ text: 'device.deviceSettings.inputAccessories.inputAccessory.secondKeyObj', id: 'Fn4' });

		if (this.additionalCapabilitiesObj.privacy) {
			this.shortcutKeys.push({ text: 'device.deviceSettings.inputAccessories.inputAccessory.thirdKeyObj', id: 'FnD' });
		}
		if (this.additionalCapabilitiesObj.magnifier) {
			this.shortcutKeys.push({ text: 'device.deviceSettings.inputAccessories.inputAccessory.firstKeyObj', id: 'FnTab' });
		}
		if (this.additionalCapabilitiesObj.backLight) {
			this.shortcutKeys.push({ text: 'device.deviceSettings.inputAccessories.inputAccessory.fifthKeyObj', id: 'FnSpace' });
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
						// fnAsCtrl feature hidden in 3.2.001
						// this.getLayoutTable(value);
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
					this.inputAccessoriesCapability.keyboardVersion = this.keyboardVersion;
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
		this.imagesArray.forEach(element => {
			if (element.toLowerCase() === layOutName.toLowerCase() + '.png') {
				if (this.keyboardVersion === '1') {
					this.image = this.imagePathCS20 + element;
				} else {
					if (type === 'grafevo') {
						this.image = this.imagePathGrafEvo + element;
					} else {
						this.image = this.imagePath + element;
					}
				}
			}
		});
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
					if (response && response.length) {
						if (response[0]) {
							this.shortcutKeys.push({ text: 'device.deviceSettings.inputAccessories.inputAccessory.fourthKeyObj', id: 'FnQ' });
						}
						this.shortcutKeys.push({ text: 'device.deviceSettings.inputAccessories.inputAccessory.secondKeyObj', id: 'Fn4' });

						if (response[1]) {
							this.shortcutKeys.push({ text: 'device.deviceSettings.inputAccessories.inputAccessory.thirdKeyObj', id: 'FnD' });
						}
						if (response[2]) {
							this.shortcutKeys.push({ text: 'device.deviceSettings.inputAccessories.inputAccessory.firstKeyObj', id: 'FnTab' });
						}
						if (response[3]) {
							this.shortcutKeys.push({ text: 'device.deviceSettings.inputAccessories.inputAccessory.fifthKeyObj', id: 'FnSpace' });
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
	// fnCtrlSwap & fnAsCtrl features hidden in 3.2.001
	// FnCtrlSwap feature start here
	public getFnCtrlSwapCapability() {
		try {
			if (this.keyboardService.isShellAvailable) {
				this.keyboardService.GetFnCtrlSwapCapability().then(res => {
					this.fnCtrlSwapCapability = res;
					if (this.fnCtrlSwapCapability) {
						this.getFnCtrlSwap();
					}
				}).catch((error) => {
					this.logger.error('GetFnCtrlSwapCapability', error.message);
				});
			}
		} catch (error) {
			this.logger.error('GetFnCtrlSwapCapability', error.message);
			return EMPTY;
		}
	}
	public getFnCtrlSwap() {
		try {
			if (this.keyboardService.isShellAvailable) {
				this.keyboardService.GetFnCtrlSwap().then(res => {
					this.fnCtrlSwapStatus = res;
				}).catch(error => {
					this.logger.error('GetFnCtrlSwap error here', error.message);
					return EMPTY;
				});
			}
		} catch (error) {
			this.logger.error('GetFnCtrlSwap', error.message);
			return EMPTY;
		}
	}

	public fnCtrlKey(event) {
		this.fnCtrlSwapStatus = event.switchValue;
		try {
			if (this.keyboardService.isShellAvailable) {
				this.keyboardService.SetFnCtrlSwap(this.fnCtrlSwapStatus).then(res => {
					this.isRestartRequired = res.RebootRequired;
					if (res.RebootRequired === true) {
						this.keyboardService.restartMachine();
					}
				}).catch((error) => {
					this.logger.error('SetFnCtrlSwap', error.message);
				});
			}
		} catch (error) {
			this.logger.error('SetFnCtrlSwap', error.message);
			return EMPTY;
		}
	}
	// FnCtrlSwap feature end here

	// FnAsCtrl feature start here
	public getFnAsCtrlCapability() {
		try {
			if (this.keyboardService.isShellAvailable) {
				this.keyboardService.GetFnAsCtrlCapability().then(res => {
					this.fnAsCtrlCapability = res;
					if (this.fnAsCtrlCapability) {
						this.getFnAsCtrlStatus();
					}
				}).catch((error) => {
					this.logger.error('GetFnAsCtrlCapability', error.message);
				});
			}
		} catch (error) {
			this.logger.error('GetFnAsCtrlCapability', error.message);
			return EMPTY;
		}
	}
	public getFnAsCtrlStatus() {
		try {
			if (this.keyboardService.isShellAvailable) {
				this.keyboardService.GetFnAsCtrl().then(res => {
					this.fnAsCtrlStatus = res;
				}).catch(error => {
					this.logger.error('GetFnAsCtrl error here', error.message);
					return EMPTY;
				});
			}
		} catch (error) {
			this.logger.error('GetFnAsCtrl', error.message);
			return EMPTY;
		}
	}

	public setFnAsCtrl(event) {
		this.fnAsCtrlStatus = event.switchValue;
		try {
			if (this.keyboardService.isShellAvailable) {
				this.keyboardService.SetFnAsCtrl(this.fnAsCtrlStatus).then(res => {
				}).catch((error) => {
					this.logger.error('SetFnAsCtrl', error.message);
				});
			}
		} catch (error) {
			this.logger.error('SetFnAsCtrl', error.message);
			return EMPTY;
		}
	}


	public getLayoutTable(layOutName) {
		this.fnCtrlKeyTooltipContent = [];
		let array = [];
		switch (layOutName.toUpperCase()) {
			case 'TURKISH_F':
				array = [8, 1, 6, 9, 2, 5, 3];
				this.generateLayOutTable(array);
				break;
			case 'BELGIUM':
			case 'FRENCH':
			case 'FRENCH_CANADIAN':
				array = [7, 4, 10, 11, 2, 9, 13, 12];
				this.generateLayOutTable(array);
				this.isFrenchKeyboard = true;
				break;
			default:
				array = [1, 4, 13, 11, 2, 9, 10, 12];
				this.generateLayOutTable(array);
				break;
		}
	}
	public generateLayOutTable(array) {
		let obj: any = {};
		this.fnCtrlKeyTooltipContent = [];
		array.forEach(el => {
			obj = {
				action: this.tooltipString + 'action.action' + el,
				ctrlKey: this.tooltipString + 'ctrlKeys.key' + el,
				fnkey: this.tooltipString + 'fnKeys.key' + el
			};
			if (this.isFrenchKeyboard && obj !== undefined && obj.fnkey) {
				if (obj.fnkey === this.tooltipString + 'fnKeys.key10') {
					obj.action = this.tooltipString + 'action.action13';
				}
				if (obj.fnkey === this.tooltipString + 'fnKeys.key13') {
					obj.action = this.tooltipString + 'action.action10';
				}
			}
			this.fnCtrlKeyTooltipContent.push(obj);
		});
	}
	// FnAsCtrl feature end here
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

	public showHideKeyboardBacklight(available: any) {
		this.isKbdBacklightAvailable = available;
	}

	ngOnDestroy(): void {
		if (this.topRowFunctionsIdeapadSubscription) {
			this.topRowFunctionsIdeapadSubscription.unsubscribe();
		}
	}

	// setup model for UI rendering
	private setUpVoipUIModel() {
		const voipApps = this.installedApps;
		if (voipApps) {
			this.voipUIModel = [];
			voipApps.forEach((app: VoipApp, index: number) => {
				if (app.isAppInstalled) {
					const appObj: UiCircleRadioWithCheckBoxListModel = {
						componentId: `VoipHotkeys.rectangle-radio-${index}`,
						label: `device.deviceSettings.inputAccessories.inputAccessory.VoipHotkeys.app-${app.appName}`,
						value: app.appName.toString(),
						isChecked: app.isSelected.valueOf(),
						isDisabled: false,
						processIcon: false,
						hideIcon: false,
						processLabel: false,
						customIcon: `${this.iconName[app.appName]}`,
						metricsItem: '',
					};
					appObj.ariaLabel = this.voipAppName[index];
					this.voipUIModel.push(appObj);
				}
			});
		}
	}

	// updated selected option in model
	private updateVoipUIModel(selectedAppId: string) {
		this.voipUIModel.forEach((app: UiCircleRadioWithCheckBoxListModel) => {
			if (app.value === selectedAppId) {
				app.isChecked = true;
			} else {
				app.isChecked = false;
			}
		});
	}
}
