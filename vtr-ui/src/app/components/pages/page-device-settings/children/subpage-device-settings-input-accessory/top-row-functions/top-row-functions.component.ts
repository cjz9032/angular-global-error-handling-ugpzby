import { Component, OnInit } from '@angular/core';
import { InputAccessoriesService } from 'src/app/services/input-accessories/input-accessories.service';
import { SystemUpdateService } from 'src/app/services/system-update/system-update.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { EMPTY } from 'rxjs';

@Component({
	selector: 'vtr-top-row-functions',
	templateUrl: './top-row-functions.component.html',
	styleUrls: ['./top-row-functions.component.scss']
})
export class TopRowFunctionsComponent implements OnInit {

	public topRowKeyObj: any = {};
	public showAdvancedSection = false;
	public topRowFunInterval: any;
	public responseData: any[] = [];

	constructor(
		private keyboardService: InputAccessoriesService,
		public systemUpdateService: SystemUpdateService,
		private logger: LoggerService
	) { }

	ngOnInit() {
		this.getFunctionCapabilities();
	}

	public getFunctionCapabilities() {
		try {
			if (this.keyboardService.isShellAvailable) {
				Promise.all([
					this.keyboardService.getTopRowFnLockCapability(),
					this.keyboardService.getTopRowFnStickKeyCapability(),
					this.keyboardService.getTopRowPrimaryFunctionCapability(),
				]).then((res: any[]) => {
					this.responseData = res;
					this.topRowKeyObj = {
						fnLockCap: this.responseData[0],
						stickyFunCap: this.responseData[1],
						primaryFunCap: this.responseData[2]
					};
					this.getAllStatuses();
					this.topRowFunInterval = setInterval(() => {
						this.getAllStatuses();
					}, 30000);
				});
			}
		} catch (error) {
			this.logger.error('getFunctionCapabilities', error.message);
			return EMPTY;
		}
	}

	public getAllStatuses() {
		if (this.responseData && this.responseData.length > 0) {
			if (this.responseData[0]) {
				this.getStatusOfFnLock();
			}
			if (this.responseData[1]) {
				this.getStatusOfStickyFun();
			}
			if (this.responseData[2]) {
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
		console.log('set funlock req here ------------->', value);
		this.keyboardService.setFnLock(value).then(res => {
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
				this.systemUpdateService.restartWindows();
			}
		});
	}

	ngOnDestroy() {
		clearTimeout(this.topRowFunInterval);
	}
}
