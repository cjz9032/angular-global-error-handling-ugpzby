import { Injectable } from '@angular/core';
import * as phoenix from '@lenovo/tan-client-bridge';
import { CommonService } from '../common/common.service';

@Injectable({
	providedIn: 'root'
})
export class WindowsHelloService {
	isRS5OrLater: boolean;
	securityAdvisor: phoenix.SecurityAdvisor;
	constructor(
		private commonService: CommonService
	) { }

	showWindowsHello(windowsHello: phoenix.WindowsHello): boolean {
		const version = this.commonService.getWindowsVersion();
		if (version === 0) {
			this.isRS5OrLater = true;
		} else {
			this.isRS5OrLater = this.commonService.isRS5OrLater();
		}
		if (this.isRS5OrLater && windowsHello.fingerPrintStatus) {
			return true;
		}
		return false;
	}

}
