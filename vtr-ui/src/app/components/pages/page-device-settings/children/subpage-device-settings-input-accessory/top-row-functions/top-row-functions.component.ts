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
				]).then((response: any[]) => {
					this.topRowKeyObj = {
						fnLockCap: response[0],
						stickyFunCap: response[1],
						primaryFunCap: response[2]
					};
					if (response[0]) {
						this.getStatusOfFnLock();
					}
					if (response[1]) {
						this.getStatusOfStickyFun();
					}
					if (response[2]) {
						this.getStatusOfPrimaryFun();
					}
				});
			}
		} catch (error) {
			this.logger.error('getFunctionCapabilities', error.message);
			return EMPTY;
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
}
