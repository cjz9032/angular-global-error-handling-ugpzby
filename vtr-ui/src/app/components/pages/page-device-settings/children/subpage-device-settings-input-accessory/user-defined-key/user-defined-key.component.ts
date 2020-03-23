import { Component, OnInit } from '@angular/core';
import { InputAccessoriesService } from 'src/app/services/input-accessories/input-accessories.service';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { TranslateService } from '@ngx-translate/core';
import { UDKActionInfo, INPUT_TEXT, OPEN_WEB, OPEN_APPLICATIONS_OR_FILES, OPEN_FILES, INVOKE_KEY_SEQUENCE, OPEN_APPLICATIONS } from './UDKActionInfo';
import { InputAccessoriesCapability } from 'src/app/data-models/input-accessories/input-accessories-capability.model';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { EMPTY } from 'rxjs';
import { keyboardMap } from './keyboardKeysMapping';


@Component({
	selector: 'vtr-user-defined-key',
	templateUrl: './user-defined-key.component.html',
	styleUrls: ['./user-defined-key.component.scss']
})
export class UserDefinedKeyComponent implements OnInit {

	title = 'device.deviceSettings.inputAccessories.title';
	udkActionInfo: UDKActionInfo;
	hasUDKCapability = false;
	public machineType: number;
	public description: string;
	public url: string;
	public hideApplyForDefault = false;
	public udkFormSubmitted = false;
	userDefinedKeyOptions: any[] = [];
	public selectedValue: any;
	public isUDFSetSuccessVisible = false;
	public isUDFSetFailedVisible = false;
	public applicationList = [];
	public fileList = [];
	public keyCode = '';
	public keyCodeValue = '';
	public applicationType: string;
	public counter = 0;
	public keyboardMappedValues = [];
	private regExForUrlWithParam = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;

	constructor(
		private keyboardService: InputAccessoriesService,
		private translateService: TranslateService,
		private logger: LoggerService,
		private commonService: CommonService
	) {
		this.userDefinedKeyOptions = [
			{
				title: 'device.deviceSettings.inputAccessories.userDefinedKey.dropDown.options.option1',
				value: 1,
				path: '1',
				actionType: ''
			},
			{
				title: 'device.deviceSettings.inputAccessories.userDefinedKey.dropDown.options.option2',
				value: 2,
				path: '2',
				actionType: INPUT_TEXT.str
			},
			{
				title: 'device.deviceSettings.inputAccessories.userDefinedKey.dropDown.options.option3',
				value: 3,
				path: '3',
				actionType: OPEN_WEB.str
			}
			// {
			// 	title: 'device.deviceSettings.inputAccessories.userDefinedKey.dropDown.options.option4',
			// 	value: 4,
			// 	path: '4',
			// 	actionType: OPEN_APPLICATIONS_OR_FILES.str
			// },
			// {
			// 	title: 'device.deviceSettings.inputAccessories.userDefinedKey.dropDown.options.option5',
			// 	value: 5,
			// 	path: '5',
			// 	actionType: INVOKE_KEY_SEQUENCE.str
			// }
		];
		this.selectedValue = this.userDefinedKeyOptions[0];
	}

	ngOnInit() {
		this.keyboardMappedValues = keyboardMap;
		this.getUDKCapability();
	}

	async getUDKCapability(){
		try {
			this.machineType = this.commonService.getLocalStorageValue(LocalStorageKey.MachineType);
			if (this.machineType === 1) {
				let inputAccessoriesCapability: InputAccessoriesCapability = this.commonService.getLocalStorageValue(LocalStorageKey.InputAccessoriesCapability);
				if (inputAccessoriesCapability && inputAccessoriesCapability.isUdkAvailable) {
					this.hasUDKCapability = inputAccessoriesCapability.isUdkAvailable;
				} else {
					inputAccessoriesCapability = new InputAccessoriesCapability();
					 const response = await this.keyboardService.GetAllCapability();
						if (response) {
							inputAccessoriesCapability.isUdkAvailable = (Object.keys(response).indexOf('uDKCapability') !== -1) ? response.uDKCapability : false;
							this.hasUDKCapability = inputAccessoriesCapability.isUdkAvailable;
							this.commonService.setLocalStorageValue(LocalStorageKey.InputAccessoriesCapability, inputAccessoriesCapability);
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
	}

	initValues(udkActionInfo: UDKActionInfo) {
		switch (this.udkActionInfo.index) {
			case 1:
				this.selectedValue = this.userDefinedKeyOptions[this.udkActionInfo.index];
				this.url = this.udkActionInfo.actionValue;
				this.userDefinedKeyOptions = this.commonService.removeObjFrom(this.userDefinedKeyOptions, '1');
				break;
			case 2:
				this.selectedValue = this.userDefinedKeyOptions[this.udkActionInfo.index];
				this.description = this.udkActionInfo.actionValue;
				this.userDefinedKeyOptions = this.commonService.removeObjFrom(this.userDefinedKeyOptions, '1');
				break;
			// case 3:
			//     this.selectedValue = this.userDefinedKeyOptions[this.udkActionInfo.index];
			//     this.applicationList = this.udkActionInfo.applicationList;
			//     this.fileList = this.udkActionInfo.fileList;
			//     this.userDefinedKeyOptions = this.commonService.removeObjFrom(this.userDefinedKeyOptions, '1');
			//     break;
			// case 4:
			//     this.selectedValue = this.userDefinedKeyOptions[this.udkActionInfo.index];
			//     this.keyCode = this.udkActionInfo.actionValue;
			//     this.keyCodeValue=this.keyCode;
			//     var splitted = this.keyCode.split(" ");
			//     var mappedString="";
			//     for(let i = 0; i < splitted.length; i++)
			//         {
			//             this.keyboardMappedValues[splitted[i]] = this.keyboardMappedValues[splitted[i]] ? this.keyboardMappedValues[splitted[i]].charAt(0).toUpperCase() + this.keyboardMappedValues[splitted[i]].substr(1).toLowerCase() : ''
			//             mappedString = mappedString + "+ " +  this.keyboardMappedValues[splitted[i]];
			//             this.counter++;
			//             }
			//         mappedString = mappedString.substring(1);
			//         this.keyCode=mappedString;
			//         this.userDefinedKeyOptions = this.commonService.removeObjFrom(this.userDefinedKeyOptions, '1');
			//         break;
		}
	}
	checkDropDown(userDefineDrop: any, i, event) {
		if (event && event.keyCode === 9) {
			if (i === this.userDefinedKeyOptions.length - 1) {
				userDefineDrop.close();
			}
		}
	}

	public getUDKTypeList() {
		try {
			if (this.keyboardService.isShellAvailable) {
				this.keyboardService.GetUDKTypeList()
					.then((value: any) => {
						this.logger.info('keyboard getUDKTypeList here -------------.>', value);
						this.logger.info(value);
						this.udkActionInfo = new UDKActionInfo(value);
						this.initValues(this.udkActionInfo);
					}).catch(error => {
						this.logger.error('keyboard getUDKTypeList error here', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('keyboard getUDKTypeList error here' + error.message);
			return EMPTY;
		}
	}

	public setUDKTypeList(type: string, actionType: string, settingKey: string, settingValue: string) {
		try {
			if (this.keyboardService.isShellAvailable) {
				this.keyboardService.setUserDefinedKeySetting(type, actionType, settingKey, settingValue)
					.then((value: any) => {
						this.showUDFSetSuccessMessage(settingKey);
						this.udkFormSubmitted = false;
						this.userDefinedKeyOptions = this.commonService.removeObjFrom(this.userDefinedKeyOptions, '1');
						this.logger.info('keyboard setUDKTypeList here -------------.>', value);
					}).catch(error => {
						this.logger.error('keyboard setUDKTypeList error here', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('keyboard setUDKTypeList error here', error.message);
			return EMPTY;
		}
	}

	//     public setApplication(selectedUDK: string,appSelectorType: string,applicationOrFile) {
	// 		try {
	// 			if (this.keyboardService.isShellAvailable) {
	// 				this.keyboardService.AddApplicationOrFiles(selectedUDK,appSelectorType)
	// 					.then((value: any) => {
	// 						this.udkFormSubmitted = false;
	// 						this.userDefinedKeyOptions = this.commonService.removeObjFrom(this.userDefinedKeyOptions, '1');
	// 						const applicationValue = value.UDKType[0].FileList[0].Setting[0].value;
	// 						const applicationKey = value.UDKType[0].FileList[0].Setting[0].key;
	// 						if(applicationOrFile=='4'){
	// 							let applicationList = {value:applicationValue,key:applicationKey};
	//                             if (this.applicationList.find((test) => test.key === applicationKey) === undefined) {
	//                                  this.applicationList.push(applicationList);
	// 							   }
	// 						}
	// 						else{
	// 							let fileList = {value:applicationValue,key:applicationKey};
	//                             if (this.fileList.find((test) => test.key === applicationKey) === undefined) {
	//                                  this.fileList.push(fileList);
	// 							   }
	// 						}
	// 					}).catch(error => {
	// 						this.logger.error('AddApplicationOrFiles error here', error.message);
	// 						return EMPTY;
	// 					});
	// 			}
	// 		} catch (error) {
	// 			this.logger.error('keyboard AddApplicationOrFiles error here', error.message);
	// 			return EMPTY;
	// 		}
	// 	}

	// public deleteApplicationOrFile(udkType: string,itemId: string,displayName: string,index,selectedDropdownType) {
	// 		try {
	// 			if (this.keyboardService.isShellAvailable) {
	// 				this.keyboardService.DeleteUDKApplication(udkType,itemId,displayName)
	// 					.then((value: any) => {
	// 						this.udkFormSubmitted = false;
	// 						this.userDefinedKeyOptions = this.commonService.removeObjFrom(this.userDefinedKeyOptions, '1');
	// 						if(selectedDropdownType=='APPLICATIONS'){
	// 							this.applicationList.splice(index,1);
	// 						}
	// 						else{
	// 							this.fileList.splice(index,1);
	// 						}
	// 					}).catch(error => {
	// 						this.logger.error('AddApplicationOrFiles error here', error.message);
	// 						return EMPTY;
	// 					});
	// 			}
	// 		} catch (error) {
	// 			this.logger.error('keyboard AddApplicationOrFiles error here', error.message);
	// 			return EMPTY;
	// 		}
	// 	}
	udkSubmit(value: number) {
		this.logger.debug('UserDefinedKeyComponent.udkSubmit function called', value);
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
			// case 4:
			//     this.setApplication('0',OPEN_APPLICATIONS.value,value);
			//     break;
			// case 5:
			//     this.setApplication('0',OPEN_FILES.value,value);
			//     break;
			// case 6:
			//     if(this.keyCode && this.keyCode.length>0){
			//         this.setUDKTypeList('0', INVOKE_KEY_SEQUENCE.value, INVOKE_KEY_SEQUENCE.str,this.keyCodeValue);
			//         }
		}
	}

	public onKeydown(event) {
		if ((event.ctrlKey && event.key === 'Enter') || event.key === 'Enter') {
			event.preventDefault();
		}
	}

	public invokeKeySequence(event) {
		event.preventDefault();
		if (event.keyCode === 255 || (event.keyCode >= 186 && event.keyCode <= 222) || event.keyCode === 8) {
			event.preventDefault();
			event.key = ''
		}
		if (event.key) {
			this.counter++;
			if (this.counter <= 5) {
				this.keyCode = this.keyCode + '+ ' + event.key;
				this.keyCodeValue = this.keyCodeValue + ' ' + event.keyCode;
			}
		}
		if (this.counter == 1) {
			if (this.keyCode.startsWith('+')) {
				this.keyCode = this.keyCode.substring(1);
			}
			this.keyCodeValue = this.keyCodeValue.substring(1);
		}

	}
	public resetInvokeSequence(event) {
		this.keyCode = '';
		this.counter = 0;
		this.keyCodeValue = '';
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
}
