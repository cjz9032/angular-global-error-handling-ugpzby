import { Component, ElementRef, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { EMPTY } from 'rxjs';
import { UiCircleRadioWithCheckBoxListModel } from 'src/app/components/ui/ui-circle-radio-with-checkbox-list/ui-circle-radio-with-checkbox-list.model';
import { UiRoundedRectangleRadioModel } from 'src/app/components/ui/ui-rounded-rectangle-custom-radio-list/ui-rounded-rectangle-radio-list.model';
import { TopRowFunctionsCapability } from 'src/app/data-models/device/top-row-functions-capability';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { CommonService } from 'src/app/services/common/common.service';
import { InputAccessoriesService } from 'src/app/services/input-accessories/input-accessories.service';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { AppEvent } from './../../../../../../enums/app-event.enum';

@Component({
	selector: 'vtr-top-row-functions',
	templateUrl: './top-row-functions.component.html',
	styleUrls: ['./top-row-functions.component.scss']
})
export class TopRowFunctionsComponent implements OnInit, OnChanges, OnDestroy {

	@ViewChild('adv') adv: ElementRef;

	public topRowKeyObj: TopRowFunctionsCapability;
	public showAdvancedSection = false;
	public topRowFunInterval: any;
	public isCacheFound = false;
	public topRowFunctionUIModel: Array<UiCircleRadioWithCheckBoxListModel> = [];
	public readonly TRUE = 'true';
	public readonly FALSE = 'false';
	public functionKeyTypeUIModel: Array<UiRoundedRectangleRadioModel> = [];

	private readonly functionKeyId = 'thinkpad-function-key-radio-button';
	private readonly specialKeyId = 'thinkpad-special-key-radio-button';
	private readonly NORMAL_KEY = 'nMehod_show';
	private readonly STICKY_KEY = 'fnKeyMehod_show';

	constructor(
		private keyboardService: InputAccessoriesService,
		private logger: LoggerService,
		private commonService: CommonService,
		private localCacheService: LocalCacheService
	) { }
	ngOnChanges(changes: SimpleChanges): void {
		if (changes.topRowKeyObj) {
			this.setUpTopRowFunctionsKeysUIModel();
		}
	}

	ngOnInit() {
		const topRowKeyObj = this.localCacheService.getLocalCacheValue(LocalStorageKey.TopRowFunctionsCapability, undefined);
		if (topRowKeyObj) {
			this.topRowKeyObj = topRowKeyObj;
			this.isCacheFound = true;
			this.getAllStatuses();
		} else {
			this.topRowKeyObj = new TopRowFunctionsCapability();
		}

		this.getFunctionCapabilities();
		this.setUpTopRowFunctionsKeysUIModel();
	}

	ngOnDestroy() {
		clearTimeout(this.topRowFunInterval);
	}

	public async getFunctionCapabilities() {
		try {
			if (this.keyboardService.isShellAvailable) {
				await Promise.all([
					this.keyboardService.getTopRowFnLockCapability(),
					this.keyboardService.getTopRowFnStickKeyCapability(),
					this.keyboardService.getTopRowPrimaryFunctionCapability(),
				]).then((res: Array<boolean>) => {
					this.topRowKeyObj.fnLockCap = res[0];
					this.topRowKeyObj.stickyFunCap = res[1];
					this.topRowKeyObj.primaryFunCap = res[2];
					this.getAllStatuses();
					this.setTopRowStatusCallback();
					this.localCacheService.setLocalCacheValue(LocalStorageKey.TopRowFunctionsCapability, this.topRowKeyObj);
					this.logger.info('TopRowFunctionsComponent.getFunctionCapabilities', this.topRowKeyObj);
				});
			}
		} catch (error) {
			this.logger.error('getFunctionCapabilities', error.message);
			return EMPTY;
		}
	}

	private setTopRowStatusCallback() {
		this.topRowFunInterval = setInterval(() => {
			if (!this.topRowKeyObj.stickyFunStatus) {
				this.getAllStatuses();
			}
		}, 30000);
	}
	updateCustomKeyEvents($event) {
		this.logger.info('topRowKeys', { $event });
		const value = $event.value;
		const { customeEvent } = $event;
		if (customeEvent === AppEvent.LEFT || customeEvent === AppEvent.RIGHT) {
			this.onFunctionKeyTypeChange(value);
		}
	}
	public getAllStatuses() {
		if (this.topRowKeyObj) {
			if (this.topRowKeyObj.fnLockCap) {
				this.getStatusOfFnLock();
			}
			if (this.topRowKeyObj.stickyFunCap) {
				this.getStatusOfStickyFun();
			}
			if (this.topRowKeyObj.primaryFunCap) {
				this.getStatusOfPrimaryFun();
			}
		}
	}
	public getStatusOfFnLock() {
		this.keyboardService.getFnLockStatus().then(res => {
			this.logger.info('TopRowFunctionsComponent.getStatusOfFnLock', res);
			this.topRowKeyObj.fnLockStatus = res;
			this.localCacheService.setLocalCacheValue(LocalStorageKey.TopRowFunctionsCapability, this.topRowKeyObj);
			this.updateFunctionLockUIModel();
		});
	}
	public getStatusOfStickyFun() {
		this.keyboardService.getFnStickKeyStatus().then(res => {
			this.logger.info('TopRowFunctionsComponent.getStatusOfStickyFun', res);
			this.topRowKeyObj.stickyFunStatus = res;
			this.localCacheService.setLocalCacheValue(LocalStorageKey.TopRowFunctionsCapability, this.topRowKeyObj);
			this.updateTopRowFunctionsKeysUIModel();
		});
	}
	public getStatusOfPrimaryFun() {
		this.keyboardService.getPrimaryFunctionStatus().then(res => {
			this.logger.info('TopRowFunctionsComponent.getStatusOfPrimaryFun', res);
			this.topRowKeyObj.primaryFunStatus = res;
			this.localCacheService.setLocalCacheValue(LocalStorageKey.TopRowFunctionsCapability, this.topRowKeyObj);
			this.updateFunctionLockUIModel();
		});
	}

	public onChangeFunType(value: boolean) {
		this.keyboardService.setFnLock(value).then(res => {
			this.getAllStatuses();
		});
	}
	public updateFocusAndSelection(event, value) {
		const { switchEVent } = event;
		if (switchEVent === AppEvent.LEFT || switchEVent === AppEvent.RIGHT) {
			this.onChangeFunType(value);
		}
	}

	public onFunctionKeyTypeChange($event: UiRoundedRectangleRadioModel) {
		const value = $event.value as boolean;
		this.topRowKeyObj.stickyFunStatus = value;
		this.keyboardService.setFnStickKeyStatus(value).then(res => {
			// if normal key selected get latest status of top row
			if ($event.componentId.toLowerCase() === this.NORMAL_KEY.toLowerCase()) {
				this.getAllStatuses();
			}
			// if sticky key selected then remove checked icon from top row
			else if ($event.componentId.toLowerCase() === this.STICKY_KEY.toLowerCase()) {
				this.topRowFunctionUIModel.forEach((model) => {
					model.isChecked = false;
				});
			}
		});
	}

	public rebootToggleOnOff(event) {
		this.keyboardService.setPrimaryFunction(event.switchValue).then((res: any) => {
			if (res.RebootRequired === true) {
				this.keyboardService.restartMachine();
			}
		});
	}

	updateFunctionLockUIModel() {
		this.topRowFunctionUIModel = [];

		const { primaryFunStatus, fnLockStatus } = this.topRowKeyObj;
		const topRowStatus = (primaryFunStatus && fnLockStatus) || (!primaryFunStatus && !fnLockStatus);
		const stickyKeyEnabled = this.topRowKeyObj.stickyFunStatus;

		this.topRowFunctionUIModel.push({
			componentId: this.specialKeyId,
			label: `device.deviceSettings.inputAccessories.inputAccessory.topRowFunctions.subSection.radioButton.sFunKey`,
			value: 'special-key',
			isChecked: stickyKeyEnabled ? false : topRowStatus,
			isDisabled: false,
			processIcon: true,
			customIcon: 'Special-function',
			hideIcon: true,
			processLabel: false,
			metricsItem: 'radio.top-row-fn.special-function'
		});
		this.topRowFunctionUIModel.push({
			componentId: this.functionKeyId,
			label: `device.deviceSettings.inputAccessories.inputAccessory.topRowFunctions.subSection.radioButton.fnKey`,
			value: 'function-key',
			isChecked: stickyKeyEnabled ? false : !topRowStatus,
			isDisabled: false,
			processIcon: true,
			customIcon: 'F1-F12-funciton',
			hideIcon: true,
			processLabel: false,
			metricsItem: 'radio.top-row-fn.function-key'
		});
	}

	onTopRowFunctionRadioChange($event: UiCircleRadioWithCheckBoxListModel) {
		if ($event) {
			const componentId = $event.componentId.toLowerCase();
			if (componentId === this.specialKeyId) {
				this.onChangeFunType(this.topRowKeyObj.primaryFunStatus);
			} else if (componentId === this.functionKeyId) {
				this.onChangeFunType(!this.topRowKeyObj.primaryFunStatus);
			}
		}
	}

	private setUpTopRowFunctionsKeysUIModel() {
		const stickyKeyEnabled = this.topRowKeyObj.stickyFunStatus;
		this.functionKeyTypeUIModel = [{
			componentId: this.NORMAL_KEY,
			label: 'device.deviceSettings.inputAccessories.inputAccessory.topRowFunctions.subSectionThree.radioButton.nMehod',
			value: false,
			isChecked: !stickyKeyEnabled,
			isDisabled: false,
			metricsItem: 'radio.top-row-fn.normal-key'
		},
		{
			componentId: this.STICKY_KEY,
			label: 'device.deviceSettings.inputAccessories.inputAccessory.topRowFunctions.subSectionThree.radioButton.fnKeyMehod',
			value: true,
			isChecked: stickyKeyEnabled,
			isDisabled: false,
			metricsItem: 'radio.top-row-fn.fn-sticky-Key'
		}];
	}

	private updateTopRowFunctionsKeysUIModel() {
		const stickyKeyEnabled = this.topRowKeyObj.stickyFunStatus;
		this.functionKeyTypeUIModel.forEach((model) => {
			switch (model.componentId) {
				case 'nMehod_show':
					model.isChecked = !stickyKeyEnabled;
					break;
				case 'fnKeyMehod_show':
					model.isChecked = stickyKeyEnabled;
					break;
				default:
					break;
			}
		});
	}

	switchFocusToShowAdv() {
		setTimeout(() => {
			this.adv.nativeElement.focus();
		}, 0);
	}

}
