import { Component, OnInit } from '@angular/core';
import { InputAccessoriesService } from 'src/app/services/input-accessories/input-accessories.service';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';

@Component({
	selector: 'vtr-subpage-device-settings-input-accessory',
	templateUrl: './subpage-device-settings-input-accessory.component.html',
	styleUrls: ['./subpage-device-settings-input-accessory.component.scss']
})
export class SubpageDeviceSettingsInputAccessoryComponent implements OnInit {

	title = 'device.deviceSettings.inputAccessories.title';

	public shortcutKeys: any[] = [];
	hasUDKCapability = true;
	udkTypeList: any[] = [];
	public description: string;
	public url: string;
	public hyperLinkPatterns = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
	public enterTextPatterns = '[a-zA-Z0-9][A-Za-z0-9._-]*';
	public hideApplyForDefault = true;
	public udkFormSubmitted = false;

	userDefinedKeyOptions: any[] = [{
		'title': 'Launch Lenovo Vantage',
		'value': 1
	},
	{
		'title': 'Open website',
		'value': 2
	},
	{
		'title': 'Enter text',
		'value': 3
	}
	];

	public privacyIcon = '../../../../../../assets/images/keyboard-images/KeyboarmMap_Icons/Privacy-Screen.png';
	public kbdBlIcon = '../../../../../../assets/images/keyboard-images/KeyboarmMap_Icons/KBD-BL.png';
	public merlynIcon = '../../../../../../assets/images/keyboard-images/KeyboarmMap_Icons/Merlyn-Perf-mode.png';
	public zoomIcon = '../../../../../../assets/images/keyboard-images/KeyboarmMap_Icons/Zoom-app.png';

	public selectedValue: any;
	public image = '';
	public additionalCapabilitiesObj: any = {};
	public machineType: number;
	public keyboardCompatability: boolean;

	constructor(private keyboardService: InputAccessoriesService, private commonService: CommonService, ) { }

	ngOnInit() {
		this.machineType = this.commonService.getLocalStorageValue(LocalStorageKey.MachineType);
		if (this.machineType === 1) {
			this.getKeyboardCompatability();
		}

		if (this.getUDKCapability()) {

			this.selectedValue = this.userDefinedKeyOptions[0];
			if (this.selectedValue.value === 1) {
				this.hideApplyForDefault = true;
			}
		}

	}
	public onChange(item) {
		this.selectedValue = item;

		//reset udkFormSubmitted to false
		this.udkFormSubmitted = false;

		if (this.selectedValue.value === 1) {
			this.hideApplyForDefault = false;
		}


	}


	public setUserDefinedKeySetting(type, actionType, settingKey, settingValue) {
		try {

			if (this.keyboardService.isShellAvailable) {
				this.keyboardService.setUserDefinedKeySetting(type, actionType, settingKey, settingValue).then((value: boolean) => {
					console.log('keyboard setUserDefinedKeySetting here -------------.>', value);
				})
					.catch(error => {
						console.error('keyboard setUserDefinedKeySetting error here', error);
					});
			}
		}
		catch (error) {
			console.error(error.message);
		}
	}

	public getUDKCapability() {
		try {
			if (this.keyboardService.isShellAvailable) {
				this.keyboardService.GetUDKCapability().then((value: boolean) => {
					console.log('keyboard UDKCapability here -------------.>', value);
					this.hasUDKCapability = value;
					//let self = this;

					/* if (this.hasUDKCapability) {
						this.getUDKTypeList();
					} */

					return this.hasUDKCapability;
				})
					.catch(error => {
						console.error('keyboard UDKCapability error here', error);
					});
			}
		}
		catch (error) {
			console.error(error.message);
		}
		return this.hasUDKCapability;

	}

	//

	public getUDKTypeList() {
		try {
			if (this.keyboardService.isShellAvailable) {
				this.keyboardService.GetUDKTypeList().then((value: any) => {
					console.log('keyboard getUDKTypeList here -------------.>', value);
					console.log(value);
					this.udkTypeList = value;
					console.log(this.udkTypeList);

				}).catch(error => {
					console.error('keyboard getUDKTypeList error here', error);
				});
			}

		}
		catch (error) {
			console.error(error.message);
		}

		return undefined;
	}
	// To Check Keyboard Compatability Status
	public getKeyboardCompatability() {
		try {
			if (this.keyboardService.isShellAvailable) {
				this.keyboardService.GetKeyboardMapCapability().then((value: any) => {
					console.log('keyboard compatability here -------------.>', value);
					if (value) {
						this.keyboardCompatability = value;
						this.getKBDLayoutName();
					}
				})
					.catch(error => {
						console.error('keyboard compatability error here', error);
					});
			}
		} catch (error) {
			console.error(error.message);
		}
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
		let type = machineType.toLowerCase();
		this.image = 'assets/images/keyboard-images/KeyboardMap_Images/Standered.png';
		switch (layOutName.toLowerCase()) {
			case "standered":
				if (type == 'other') {

					this.image = 'assets/images/keyboard-images/KeyboardMap_Images/Standered.png';
					return this.image
				} else {
					this.image = 'assets/images/keyboard-images/KeyboardMap_Images/GrafEvo/Standered.png';
					return this.image
				}
				break;
			case "belgium":
				if (type == 'other') {
					this.image = 'assets/images/keyboard-images/KeyboardMap_Images/Belgium.png';
					return this.image
				} else {
					this.image = 'assets/images/keyboard-images/KeyboardMap_Images/GrafEvo/Belgium.png';
					return this.image
				}
				break;
			case "french":
				if (type == 'other') {

					this.image = 'assets/images/keyboard-images/KeyboardMap_Images/French.png';
					return this.image
				} else {
					this.image = 'assets/images/keyboard-images/KeyboardMap_Images/GrafEvo/French.png';
					return this.image
				}
				break;
			case "french_canadian":
				if (type == 'other') {
					this.image = 'assets/images/keyboard-images/KeyboardMap_Images/French_Canadian.png';
					return this.image
				} else {
					this.image = 'assets/images/keyboard-images/KeyboardMap_Images/GrafEvo/French_Canadian.png';
					return this.image
				}
				break;
			case "german":
				if (type == 'other') {
					this.image = 'assets/images/keyboard-images/KeyboardMap_Images/German.png';
					return this.image
				} else {
					this.image = 'assets/images/keyboard-images/KeyboardMap_Images/GrafEvo/German.png';
					return this.image
				}
				break;
			case "italian":
				if (type == 'other') {
					this.image = 'assets/images/keyboard-images/KeyboardMap_Images/Italian.png';
					return this.image
				} else {
					this.image = 'assets/images/keyboard-images/KeyboardMap_Images/GrafEvo/Italian.png';
					return this.image
				}
				break;
			case "spanish":
				if (type == 'other') {
					this.image = 'assets/images/keyboard-images/KeyboardMap_Images/Spanish.png';
					return this.image
				} else {
					this.image = 'assets/images/keyboard-images/KeyboardMap_Images/GrafEvo/Spanish.png';
					return this.image
				}
				break;
			case "turkish_":
				if (type == 'other') {
					this.image = 'assets/images/keyboard-images/KeyboardMap_Images/Turkish_F.png';
					return this.image
				} else {
					this.image = 'assets/images/keyboard-images/KeyboardMap_Images/GrafEvo/Turkish_F.png';
					return this.image
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
					//console.log('promise all resonse  here -------------.>', response);
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
							performane: response[0],
							privacy: response[1],
							magnifier: response[2],
							backLight: response[3],
						}
					}
				});
			}
		} catch (error) {
			console.error(error.message);
		}
	}

	udkSubmit() {
		this.udkFormSubmitted = true;
		console.log('submit called');
	}
}
