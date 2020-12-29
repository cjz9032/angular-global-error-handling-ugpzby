import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EMPTY } from 'rxjs';
import CommonMetricsModel from 'src/app/data-models/common/common-metrics.model';
import { DropDownInterval } from 'src/app/data-models/common/drop-down-interval.model';
import { InputAccessoriesCapability } from 'src/app/data-models/input-accessories/input-accessories-capability.model';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { CommonService } from 'src/app/services/common/common.service';
import { InputAccessoriesService } from 'src/app/services/input-accessories/input-accessories.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { keyboardMap } from './keyboardKeysMapping';
import {
	INPUT_TEXT,
	INVOKE_KEY_SEQUENCE,
	OPEN_APPLICATIONS,
	OPEN_APPLICATIONS_OR_FILES,
	OPEN_FILES,
	OPEN_WEB,
	UDKActionInfo,
} from './UDKActionInfo';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';
declare const Windows;

@Component({
	selector: 'vtr-user-defined-key',
	templateUrl: './user-defined-key.component.html',
	styleUrls: ['./user-defined-key.component.scss'],
})
export class UserDefinedKeyComponent implements OnInit, OnDestroy {
	@ViewChild('deleteKeyFocus') deleteKeyFocus: ElementRef;
	title = 'device.deviceSettings.inputAccessories.title';
	udkActionInfo: UDKActionInfo;
	hasUDKCapability = false;
	public machineType: number;
	public description: string;
	public url: string;
	public hideApplyForDefault = false;
	public udkFormSubmitted = false;
	userDefinedKeyOptions: DropDownInterval[] = [];
	public selectedValue: any;
	public isUDFSetSuccessVisible = false;
	public isUDFSetFailedVisible = false;
	public applicationList = [];
	public fileList = [];
	public keyCode = '';
	public keyCodeValue = '';
	public applicationType: string;
	public counter = 0;
	public keyboardMappedValues: any;
	private regExForUrlWithParam = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
	public metricsParent = CommonMetricsModel.ParentDeviceSettings;

	constructor(
		private keyboardService: InputAccessoriesService,
		private translateService: TranslateService,
		private logger: LoggerService,
		private localCacheService: LocalCacheService,
		private commonService: CommonService
	) {
		this.userDefinedKeyOptions = [
			{
				text:
					'device.deviceSettings.inputAccessories.userDefinedKey.dropDown.options.option1',
				value: 1,
				name: '',
				placeholder: '',
				metricsValue: 'please select',
			},
			{
				text:
					'device.deviceSettings.inputAccessories.userDefinedKey.dropDown.options.option4',
				value: 4,
				name: OPEN_APPLICATIONS_OR_FILES.str,
				placeholder: '',
				metricsValue: 'open applications or files',
			},
			{
				text:
					'device.deviceSettings.inputAccessories.userDefinedKey.dropDown.options.option2',
				value: 2,
				name: OPEN_WEB.str,
				placeholder: '',
				metricsValue: 'open website',
			},
			{
				text:
					'device.deviceSettings.inputAccessories.userDefinedKey.dropDown.options.option5',
				value: 5,
				name: INVOKE_KEY_SEQUENCE.str,
				placeholder: '',
				metricsValue: 'invoke key sequence',
			},
			{
				text:
					'device.deviceSettings.inputAccessories.userDefinedKey.dropDown.options.option3',
				value: 3,
				name: INPUT_TEXT.str,
				placeholder: '',
				metricsValue: 'enter text',
			},
		];
		this.selectedValue = this.userDefinedKeyOptions[0];
	}

	ngOnInit() {
		this.keyboardMappedValues = keyboardMap;
		this.getUDKCapability();
		this.initialize();
	}

	async getUDKCapability() {
		try {
			await this.keyboardService.StartSpecialKeyMonitor(
				Windows.Storage.ApplicationData.current.localFolder.path
			);
			this.machineType = this.localCacheService.getLocalCacheValue(
				LocalStorageKey.MachineType
			);
			if (this.machineType === 1) {
				let inputAccessoriesCapability: InputAccessoriesCapability = this.localCacheService.getLocalCacheValue(
					LocalStorageKey.InputAccessoriesCapability
				);
				if (inputAccessoriesCapability && inputAccessoriesCapability.isUdkAvailable) {
					this.hasUDKCapability = inputAccessoriesCapability.isUdkAvailable;
				} else {
					inputAccessoriesCapability = new InputAccessoriesCapability();
					const response = await this.keyboardService.GetAllCapability();
					if (response) {
						inputAccessoriesCapability.isUdkAvailable =
							Object.keys(response).indexOf('uDKCapability') !== -1
								? response.uDKCapability
								: false;
						this.hasUDKCapability = inputAccessoriesCapability.isUdkAvailable;
						this.localCacheService.setLocalCacheValue(
							LocalStorageKey.InputAccessoriesCapability,
							inputAccessoriesCapability
						);
					}
				}
				if (this.hasUDKCapability) {
					this.getUDKTypeList();
				}
			}
		} catch (error) {
			this.logger.error('ngOnInit: ', error.message);
		}
	}
	public onChange(item) {
		this.selectedValue = item;
		// reset udkFormSubmitted to false
		this.udkFormSubmitted = false;
		if (this.selectedValue.value === 1) {
			this.hideApplyForDefault = false;
		}
		if (this.selectedValue.value === 4) {
			if (this.fileList.length > 0 || this.applicationList.length > 0) {
				this.setUDKTypeList('0', '0', 'LAUNCH_APPLICATION_FILE', '');
				this.keyboardService.GetUDKTypeList().then((value: any) => {
					try {
						if (
							value &&
							value.UDKType &&
							value.UDKType.length &&
							value.UDKType[0].FileList &&
							value.UDKType[0].FileList.length &&
							value.UDKType[0].FileList[0].Setting
						) {
							const previousAppsFiles = value.UDKType[0].FileList[0].Setting;
							this.applicationList = [];
							this.fileList = [];
							for (const data of previousAppsFiles) {
								if (data.type === '1') {
									this.applicationList.push({ value: data.value, key: data.key });
								} else {
									this.fileList.push({ value: data.value, key: data.key });
								}
							}
							if (previousAppsFiles.length > 0) {
								this.showUDFSetSuccessMessage(OPEN_APPLICATIONS_OR_FILES.str);
							}
						}
					} catch (error) {}
				});
			}
		}
	}

	initValues(udkActionInfo: UDKActionInfo) {
		switch (this.udkActionInfo.index) {
			case 1:
				this.selectedValue = this.userDefinedKeyOptions[this.udkActionInfo.index];
				this.applicationList = this.udkActionInfo.applicationList;
				this.fileList = this.udkActionInfo.fileList;
				this.userDefinedKeyOptions = this.commonService.removeObjFromUserDefined(
					this.userDefinedKeyOptions,
					1
				);
				break;
			case 2:
				this.selectedValue = this.userDefinedKeyOptions[this.udkActionInfo.index];
				this.url = this.udkActionInfo.actionValue;
				this.userDefinedKeyOptions = this.commonService.removeObjFromUserDefined(
					this.userDefinedKeyOptions,
					1
				);
				break;
			case 3:
				this.selectedValue = this.userDefinedKeyOptions[this.udkActionInfo.index];
				this.keyCode = this.udkActionInfo.actionValue;
				this.keyCodeValue = this.keyCode;
				const stringToSplit = this.keyCode.split(' ');
				let mappedString = '';
				for (const index of stringToSplit) {
					mappedString = mappedString + '+ ' + Object(this.keyboardMappedValues)[index];
					this.counter++;
				}
				mappedString = mappedString.substring(1);
				this.keyCode = mappedString;
				this.userDefinedKeyOptions = this.commonService.removeObjFromUserDefined(
					this.userDefinedKeyOptions,
					1
				);
				break;
			case 4:
				this.selectedValue = this.userDefinedKeyOptions[this.udkActionInfo.index];
				this.description = this.udkActionInfo.actionValue;
				this.userDefinedKeyOptions = this.commonService.removeObjFromUserDefined(
					this.userDefinedKeyOptions,
					1
				);
				break;
		}
	}
	checkDropDown(userDefineDrop: any, i, event) {
		if (event && event.keyCode === 9) {
			if (i === this.userDefinedKeyOptions.length - 1) {
				userDefineDrop.close();
			}
		}
	}

	public initialize() {
		try {
			if (this.keyboardService.isShellAvailable) {
				this.keyboardService
					.Initialize()
					.then((value: any) => {
						this.logger.info('keyboard initialize here -------------.>');
					})
					.catch((error) => {
						this.logger.error('keyboard initialize error here', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('keyboard initialize error here' + error.message);
			return EMPTY;
		}
	}
	public getUDKTypeList() {
		try {
			if (this.keyboardService.isShellAvailable) {
				this.keyboardService
					.GetUDKTypeList()
					.then((value: any) => {
						this.logger.info('keyboard getUDKTypeList here -------------.>');
						this.udkActionInfo = new UDKActionInfo(value);
						this.initValues(this.udkActionInfo);
					})
					.catch((error) => {
						this.logger.error('keyboard getUDKTypeList error here', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('keyboard getUDKTypeList error here' + error.message);
			return EMPTY;
		}
	}

	public setUDKTypeList(
		type: string,
		actionType: string,
		settingKey: string,
		settingValue: string
	) {
		try {
			if (this.keyboardService.isShellAvailable) {
				this.keyboardService
					.setUserDefinedKeySetting(type, actionType, settingKey, settingValue)
					.then((value: any) => {
						if (!(settingKey === 'LAUNCH_APPLICATION_FILE')) {
							this.showUDFSetSuccessMessage(settingKey);
							this.udkFormSubmitted = false;
							this.userDefinedKeyOptions = this.commonService.removeObjFromUserDefined(
								this.userDefinedKeyOptions,
								1
							);
							this.logger.info('keyboard setUDKTypeList here -------------.>');
						}
					})
					.catch((error) => {
						this.logger.error('keyboard setUDKTypeList error here', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('keyboard setUDKTypeList error here', error.message);
			return EMPTY;
		}
	}

	public setApplication(selectedUDK: string, appSelectorType: string, applicationOrFile: string) {
		try {
			if (this.keyboardService.isShellAvailable) {
				this.keyboardService
					.AddApplicationOrFiles(selectedUDK, appSelectorType)
					.then((value: any) => {
						this.udkFormSubmitted = false;
						this.userDefinedKeyOptions = this.commonService.removeObjFromUserDefined(
							this.userDefinedKeyOptions,
							1
						);
						const applicationValue = value.UDKType[0].FileList[0].Setting[0].value;
						const applicationKey = value.UDKType[0].FileList[0].Setting[0].key;
						if (applicationOrFile === '4') {
							const applicationList = {
								value: applicationValue,
								key: applicationKey,
							};
							if (
								this.applicationList.find((test) => test.key === applicationKey) ===
								undefined
							) {
								if (applicationValue.length) {
									this.applicationList.push(applicationList);
								}
							}
						} else {
							const fileList = { value: applicationValue, key: applicationKey };
							if (
								this.fileList.find((test) => test.key === applicationKey) ===
								undefined
							) {
								if (applicationValue.length) {
									this.fileList.push(fileList);
								}
							}
						}
					})
					.catch((error) => {
						this.logger.error('AddApplicationOrFiles error here', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('keyboard AddApplicationOrFiles error here', error.message);
			return EMPTY;
		}
	}

	public deleteApplicationOrFile(
		udkType: string,
		itemId: string,
		displayName: string,
		index,
		selectedDropdownType
	) {
		try {
			if (this.keyboardService.isShellAvailable) {
				this.keyboardService
					.DeleteUDKApplication(udkType, itemId, displayName)
					.then((value: any) => {
						this.udkFormSubmitted = false;
						this.userDefinedKeyOptions = this.commonService.removeObjFromUserDefined(
							this.userDefinedKeyOptions,
							1
						);
						if (selectedDropdownType === 'APPLICATIONS') {
							this.applicationList.splice(index, 1);
						} else {
							this.fileList.splice(index, 1);
						}
					})
					.catch((error) => {
						this.logger.error('AddApplicationOrFiles error here', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('keyboard AddApplicationOrFiles error here', error.message);
			return EMPTY;
		}
	}
	udkSubmit(value: number) {
		this.logger.debug('UserDefinedKeyComponent.udkSubmit function called');
		this.udkFormSubmitted = true;
		switch (value) {
			case 2:
				if (this.isURLValidate(this.url)) {
					this.setUDKTypeList('0', OPEN_WEB.value, OPEN_WEB.str, this.url);
				} else {
					this.showUDFSetFailedMessage(OPEN_WEB.str);
				}
				break;
			case 3:
				if (this.description && this.description.length > 0) {
					this.setUDKTypeList('0', INPUT_TEXT.value, INPUT_TEXT.str, this.description);
				}
				break;
			case 4:
				this.setApplication('0', OPEN_APPLICATIONS.value, String(value));
				break;
			case 5:
				this.setApplication('0', OPEN_FILES.value, String(value));
				break;
			case 6:
				if (this.keyCode && this.keyCode.length > 0) {
					this.setUDKTypeList(
						'0',
						INVOKE_KEY_SEQUENCE.value,
						INVOKE_KEY_SEQUENCE.str,
						this.keyCodeValue
					);
				}
				break;
		}
	}

	public onKeydown(event) {
		if ((event.ctrlKey && event.key === 'Enter') || event.key === 'Enter') {
			event.preventDefault();
		}
	}
	public async invokeKeySequence(event) {
		event.preventDefault();
		if (event.keyCode === 255 || (event.keyCode >= 173 && event.keyCode <= 222)) {
			event.preventDefault();
			event.key = '';
		} else if (await this.checkSpecialKeyFileExistAndDelete()) {
			event.preventDefault();
			event.key = '';
		}
		if (event.key) {
			this.counter++;
			if (this.counter <= 5) {
				this.keyCode =
					this.keyCode + '+ ' + Object(this.keyboardMappedValues)[event.keyCode];
				this.keyCodeValue = this.keyCodeValue + ' ' + event.keyCode;
			} else {
				this.deleteKeyFocus.nativeElement.focus();
			}
		}
		if (this.counter === 1) {
			if (this.keyCode.startsWith('+')) {
				this.keyCode = this.keyCode.substring(1);
			}
			this.keyCodeValue = this.keyCodeValue.substring(1);
		}
	}
	public resetInvokeSequence(event) {
		if (event.keyCode === 13 || event.pointerType === 'mouse' || event.type === 'click') {
			this.keyCode = '';
			this.counter = 0;
			this.keyCodeValue = '';
		}
		event.preventDefault();
	}
	/**
	 * hide UDF set or error message after 5 seconds
	 */
	private hideUDFMessage() {
		setTimeout(() => {
			this.isUDFSetFailedVisible = false;
			this.isUDFSetSuccessVisible = false;
		}, 5000);
	}

	private showUDFSetSuccessMessage(action: string) {
		this.isUDFSetSuccessVisible = true;
		this.hideUDFMessage();
	}

	private showUDFSetFailedMessage(action: string) {
		if (action === OPEN_WEB.str) {
			this.isUDFSetFailedVisible = true;
			this.hideUDFMessage();
		}
	}

	private isURLValidate(url: string): boolean {
		if (url && url.length > 0) {
			return this.regExForUrlWithParam.test(url);
		}
		return false;
	}

	async checkSpecialKeyFileExistAndDelete() {
		const specialKeyFileName = 'specialkey.txt';
		const path = Windows.Storage.ApplicationData.current.localFolder.path;
		let specialKeyFile = null;
		let wasSpecialKeyPressed = false;
		try {
			const storageFolder = Windows.Storage.ApplicationData.current.localFolder;
			specialKeyFile = await storageFolder.getFileAsync(specialKeyFileName);
			wasSpecialKeyPressed = true;
		} catch (error) {
			wasSpecialKeyPressed = false;
		}
		if (wasSpecialKeyPressed) {
			if (specialKeyFile != null) {
				await specialKeyFile.deleteAsync();
			}
			return wasSpecialKeyPressed;
		}
		return false;
	}

	ngOnDestroy() {
		this.keyboardService.EndSpecialKeyMonitor();
	}
}
