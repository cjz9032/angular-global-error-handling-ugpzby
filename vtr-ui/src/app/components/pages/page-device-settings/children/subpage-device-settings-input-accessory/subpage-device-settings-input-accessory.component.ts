import { Component, OnInit } from '@angular/core';
import { InputAccessoriesService } from 'src/app/services/input-accessories/input-accessories.service';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { InputAccessoriesCapability } from 'src/app/data-models/input-accessories/input-accessories-capability.model';

@Component({
	selector: 'vtr-subpage-device-settings-input-accessory',
	templateUrl: './subpage-device-settings-input-accessory.component.html',
	styleUrls: ['./subpage-device-settings-input-accessory.component.scss']
})
export class SubpageDeviceSettingsInputAccessoryComponent implements OnInit {

	title = 'device.deviceSettings.inputAccessories.title';
	public shortcutKeys: any[] = [];
	public privacyIcon = '../../../../../../assets/images/keyboard-images/KeyboarmMap_Icons/Privacy-Screen.png';
	public kbdBlIcon = '../../../../../../assets/images/keyboard-images/KeyboarmMap_Icons/KBD-BL.png';
	public merlynIcon = '../../../../../../assets/images/keyboard-images/KeyboarmMap_Icons/Merlyn-Perf-mode.png';
	public zoomIcon = '../../../../../../assets/images/keyboard-images/KeyboarmMap_Icons/Zoom-app.png';

	public image = '';
	public additionalCapabilitiesObj: any = {};
	public machineType: number;
	public keyboardCompatibility: boolean;
	public switchValue = false;
	public stickyFunStatus = false;

	public selectedApp: '';
	public installedApps: any[];
	public showVoiphotkeysSection = true;
	public isAppInstalled = false;

	constructor(private keyboardService: InputAccessoriesService, private commonService: CommonService,) {
	}

	ngOnInit() {
		this.machineType = this.commonService.getLocalStorageValue(LocalStorageKey.MachineType);
		if (this.machineType === 1) {
			const inputAccessoriesCapability: InputAccessoriesCapability = this.commonService.getLocalStorageValue(LocalStorageKey.InputAccessoriesCapability);
			this.keyboardCompatibility = inputAccessoriesCapability.isKeyboardMapAvailable;
			if (this.keyboardCompatibility) {
				this.getKBDLayoutName();
			}
		}
	}

	getVoipHotkeysSettings() {
		this.keyboardService.GetVoipHotkeysSettings()
			.then(res => {
				res.appList.forEach((element: { isAppInstalled: boolean; }) => {
					if (element.isAppInstalled === true) {
						this.isAppInstalled = true;
					}
				});
				if (res.errorCode === 0 && res.capability === true && this.isAppInstalled === true) {
					this.showVoiphotkeysSection = true;
					// this.installedApps = res.appList;
					if (res.appList.length === 1) {
						this.selectedApp = res.appList[0].appName;
					}
				}
			})
			.catch(error => {
				console.log('getVoipHotkeysSettings error', error);
			});
	}

	setVoipHotkeysSettings($event: any) {
		this.keyboardService.SetVoipHotkeysSettings($event)
			.then(res => {
				if (res.errorCode === 0) {
					this.selectedApp = res.appList[$event];
				}
			})
			.catch(error => {
				console.log('setVoipHotkeysSettings error', error);
			});
	}

	// To get Keyboard Layout Name
	public getKBDLayoutName() {
		try {
			if (this.keyboardService.isShellAvailable) {
				this.keyboardService.GetKBDLayoutName().then((value: any) => {
					if (value) {
						this.getKBDMachineType(value);
					}
				})
					.catch(error => {
						console.error('keyboard Layout name error here', error);
					});
			}
		} catch (error) {
			console.error(error.message);
		}
	}

	// To get Machine Type
	public getKBDMachineType(layOutName) {
		try {
			if (this.keyboardService.isShellAvailable) {
				this.keyboardService.GetKBDMachineType().then((value: any) => {
					this.getKeyboardMap(layOutName, value);
					this.getAdditionalCapabilities();
				})
					.catch(error => {
						console.error('keyboard Layout name error here', error);
					});
			}
		} catch (error) {
			console.error(error.message);
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
					}
				});
			}
		} catch (error) {
			console.error(error.message);
		}
	}

	fnCtrlKey(event) {
		this.switchValue = event.switchValue;
	}
}
