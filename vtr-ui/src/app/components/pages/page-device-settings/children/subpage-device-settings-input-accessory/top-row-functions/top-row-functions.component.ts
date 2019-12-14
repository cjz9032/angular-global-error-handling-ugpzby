import { Component, OnInit, OnDestroy } from '@angular/core';
import { InputAccessoriesService } from 'src/app/services/input-accessories/input-accessories.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { EMPTY } from 'rxjs';
import { TopRowFunctionsCapability } from 'src/app/data-models/device/top-row-functions-capability';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';

@Component({
	selector: 'vtr-top-row-functions',
	templateUrl: './top-row-functions.component.html',
	styleUrls: ['./top-row-functions.component.scss']
})
export class TopRowFunctionsComponent implements OnInit, OnDestroy {

	public topRowKeyObj: TopRowFunctionsCapability;
	public showAdvancedSection = false;
	public topRowFunInterval: any;
	private isCacheFound = false;

	constructor(
		private keyboardService: InputAccessoriesService,
		private logger: LoggerService,
		private commonService: CommonService
	) { }

	ngOnInit() {
		this.topRowKeyObj = this.commonService.getLocalStorageValue(LocalStorageKey.TopRowFunctionsCapability, undefined);
		if (this.topRowKeyObj) {
			this.isCacheFound = true;
			this.getAllStatuses();
		} else {
			this.topRowKeyObj = new TopRowFunctionsCapability();
			this.getFunctionCapabilities();
		}

		this.getFunctionCapabilities();
	}

	ngOnDestroy() {
		clearTimeout(this.topRowFunInterval);
		// store in cache
		this.commonService.setLocalStorageValue(LocalStorageKey.TopRowFunctionsCapability, this.topRowKeyObj);
	}

	public getFunctionCapabilities() {
		try {
			if (this.keyboardService.isShellAvailable) {
				Promise.all([
					this.keyboardService.getTopRowFnLockCapability(),
					this.keyboardService.getTopRowFnStickKeyCapability(),
					this.keyboardService.getTopRowPrimaryFunctionCapability(),
				]).then((res: Array<boolean>) => {
					this.topRowKeyObj.fnLockCap = res[0];
					this.topRowKeyObj.stickyFunCap = res[1];
					this.topRowKeyObj.primaryFunCap = res[2];
					if (!this.isCacheFound) {
						this.getAllStatuses();
					}
					this.setTopRowStatusCallback();
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
	public onChangeKeyType(value: boolean) {
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

}
