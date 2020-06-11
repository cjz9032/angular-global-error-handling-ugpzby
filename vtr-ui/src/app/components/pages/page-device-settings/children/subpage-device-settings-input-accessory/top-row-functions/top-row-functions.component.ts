import { AppEvent } from './../../../../../../enums/app-event.enum';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { InputAccessoriesService } from 'src/app/services/input-accessories/input-accessories.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { EMPTY } from 'rxjs';
import { TopRowFunctionsCapability } from 'src/app/data-models/device/top-row-functions-capability';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { UiRoundedRectangleRadioModel } from 'src/app/components/ui/ui-rounded-rectangle-custom-radio-list/ui-rounded-rectangle-radio-list.model';
import { UiCircleRadioWithCheckBoxListModel } from 'src/app/components/ui/ui-circle-radio-with-checkbox-list/ui-circle-radio-with-checkbox-list.model';

@Component({
	selector: 'vtr-top-row-functions',
	templateUrl: './top-row-functions.component.html',
	styleUrls: ['./top-row-functions.component.scss']
})
export class TopRowFunctionsComponent implements OnInit, OnChanges, OnDestroy {

	@ViewChild('adv') adv: ElementRef

	public topRowKeyObj: TopRowFunctionsCapability;
	public showAdvancedSection = false;
	public topRowFunInterval: any;
	public isCacheFound = false;
	public functionLockUIModel: Array<UiCircleRadioWithCheckBoxListModel> = [];
	public readonly TRUE = 'true';
	public readonly FALSE = 'false';
	public topRowFunctionKeysUIModel: Array<UiRoundedRectangleRadioModel> = [];

	private readonly functionKeyId = 'thinkpad-function-key-radio-button';
	private readonly specialKeyId = 'thinkpad-special-key-radio-button';

	constructor(
		private keyboardService: InputAccessoriesService,
		private logger: LoggerService,
		private commonService: CommonService
	) { }
	ngOnChanges(changes: SimpleChanges): void {
		if (changes.topRowKeyObj) {
			this.setUpTopRowFunctionsKeysUIModel();
		}
	}

	ngOnInit() {
		this.topRowKeyObj = this.commonService.getLocalStorageValue(LocalStorageKey.TopRowFunctionsCapability, undefined);
		if (this.topRowKeyObj) {
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
		// store in cache
		this.commonService.setLocalStorageValue(LocalStorageKey.TopRowFunctionsCapability, this.topRowKeyObj);
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
					this.updateFunctionLockUIModel()
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
			this.onChangeKeyType(value);
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
			this.topRowKeyObj.fnLockStatus = res;
		});
	}
	public getStatusOfStickyFun() {
		this.keyboardService.getFnStickKeyStatus().then(res => {
			this.topRowKeyObj.stickyFunStatus = res;
		});
	}
	public getStatusOfPrimaryFun() {
		this.keyboardService.getPrimaryFunctionStatus().then(res => {
			this.topRowKeyObj.primaryFunStatus = res;
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

	public onChangeKeyType($event: UiRoundedRectangleRadioModel) {
		const value = $event.value as boolean;
		this.topRowKeyObj.stickyFunStatus = value;
		this.keyboardService.setFnStickKeyStatus(value).then(res => {
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
		this.functionLockUIModel = [];

		const { primaryFunStatus, fnLockStatus } = this.topRowKeyObj;

		this.functionLockUIModel.push({
			componentId: this.specialKeyId,
			label: `device.deviceSettings.inputAccessories.inputAccessory.topRowFunctions.subSection.radioButton.sFunKey`,
			value: 'special-key',
			isChecked: (primaryFunStatus && fnLockStatus) || (!primaryFunStatus && !fnLockStatus) ? true : false,
			isDisabled: false,
			processIcon: true,
			customIcon: 'Special-function',
			hideIcon: true,
			processLabel: false,
		});
		this.functionLockUIModel.push({
			componentId: this.functionKeyId,
			label: `device.deviceSettings.inputAccessories.inputAccessory.topRowFunctions.subSection.radioButton.fnKey`,
			value: 'function-key',
			isChecked: (primaryFunStatus && fnLockStatus) || (!primaryFunStatus && !fnLockStatus) ? false : true,
			isDisabled: false,
			processIcon: true,
			customIcon: 'F1-F12-funciton',
			hideIcon: true,
			processLabel: false,
		});
	}

	onFunctionLockRadioChange($event: UiCircleRadioWithCheckBoxListModel) {
		if ($event) {
			const componentId = $event.componentId.toLowerCase();
			if (componentId === this.specialKeyId) {
				this.onChangeFunType(this.topRowKeyObj.primaryFunStatus);
			} else if (componentId === this.functionKeyId) {
				this.onChangeFunType(!this.topRowKeyObj.primaryFunStatus);
			}
		}
	}

	setUpTopRowFunctionsKeysUIModel() {
		const uniqueName = 'top-Row-Functions';

		this.topRowFunctionKeysUIModel = [{
			componentId: 'nMehod_show',
			label: 'device.deviceSettings.inputAccessories.inputAccessory.topRowFunctions.subSectionThree.radioButton.nMehod',
			value: false,
			isChecked: this.topRowKeyObj.stickyFunStatus === false,
			isDisabled: false,
			metricsValue: 'radio.top-row-fn.normal-key'
		},
		{
			componentId: 'fnKeyMehod_show',
			label: 'device.deviceSettings.inputAccessories.inputAccessory.topRowFunctions.subSectionThree.radioButton.fnKeyMehod',
			value: true,
			isChecked: this.topRowKeyObj.stickyFunStatus === true,
			isDisabled: false,
			metricsValue: 'radio.top-row-fn.fn-sticky-Key'
		}];
	}

	switchFocusToShowAdv() {
		setTimeout(() => {
			this.adv.nativeElement.focus()
		}, 0)
	}

}
