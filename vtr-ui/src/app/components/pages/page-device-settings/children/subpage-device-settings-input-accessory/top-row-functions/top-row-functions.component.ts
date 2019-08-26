import { Component, OnInit } from '@angular/core';
import { InputAccessoriesService } from 'src/app/services/input-accessories/input-accessories.service';
import { LoggerService } from 'src/app/services/logger/logger.service';

@Component({
	selector: 'vtr-top-row-functions',
	templateUrl: './top-row-functions.component.html',
	styleUrls: ['./top-row-functions.component.scss']
})
export class TopRowFunctionsComponent implements OnInit {

	public isHotKeys = true;
	public isFnKeys = false;
	public stickyFunStatus = false;
	public capabilitiesObj: any = {};

	constructor(
		private keyboardService: InputAccessoriesService,
		private logger: LoggerService,
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
					this.capabilitiesObj = {
						fnLockCap: response[0],
						stickyFunCap: response[1],
						primaryFunCap: response[2]
					};
					console.log('promise all resonse  here ------------->', this.capabilitiesObj);
					if (response[0]) {
						this.getStatusOfFnLock();
					}
				});
			}
		} catch (error) {
			this.logger.error(error.message);
		}
	}
	public getStatusOfFnLock() {
		this.keyboardService.getFnLockStatus().then(res => {
			console.log('getFnLockStatus------------>', res);
		});
	}

	public onChanggeKeyType(event: any, value: string) {
		if (value === '1') {
			this.isHotKeys = true;
			this.isFnKeys = false;
		} else {
			this.isHotKeys = false;
			this.isFnKeys = true;
		}
	}
	public onStickyFunToggle(event: any) {
		this.stickyFunStatus = event.switchValue;
	}
}
