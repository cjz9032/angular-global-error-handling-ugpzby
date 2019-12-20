import { Component, OnInit } from '@angular/core';
import { InputAccessoriesService } from 'src/app/services/input-accessories/input-accessories.service';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { TranslateService } from '@ngx-translate/core';
import { UDKActionInfo, INPUT_TEXT, OPEN_WEB } from './UDKActionInfo';
import { InputAccessoriesCapability } from 'src/app/data-models/input-accessories/input-accessories-capability.model';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { EMPTY } from 'rxjs';


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
	public isUDFSetSuccessVisible = false;
	public isUDFSetFailedVisible = false;
	private regExForUrlWithParam = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;

	userDefinedKeyOptions: any[] = [];

	public selectedValue: any;
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
			}];
		this.selectedValue = this.userDefinedKeyOptions[0];
	}

	ngOnInit() {
		try {
			this.machineType = this.commonService.getLocalStorageValue(LocalStorageKey.MachineType);
			if (this.machineType === 1) {
				const inputAccessoriesCapability: InputAccessoriesCapability = this.commonService.getLocalStorageValue(LocalStorageKey.InputAccessoriesCapability);
				this.hasUDKCapability = inputAccessoriesCapability.isUdkAvailable;
				if (this.hasUDKCapability) {
					this.getUDKTypeList();
				}
			} else {
				this.hasUDKCapability = false;
			}
		} catch (error) {
			console.log('ngOnInit: ', error.message);
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
		}
	}

	public getUDKTypeList() {
		try {
			if (this.keyboardService.isShellAvailable) {
				this.keyboardService.GetUDKTypeList()
					.then((value: any) => {
						console.log('keyboard getUDKTypeList here -------------.>', value);
						console.log(value);
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
						console.log('keyboard setUDKTypeList here -------------.>', value);
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

	udkSubmit(value: number) {
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
				this.setUDKTypeList('0', INPUT_TEXT.value, INPUT_TEXT.str, this.description);
		}
		console.log('submit called');
	}
	public onKeydown(event) {
		if ((event.ctrlKey && event.key === 'Enter') || event.key === 'Enter') {
			event.preventDefault();
		}
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
