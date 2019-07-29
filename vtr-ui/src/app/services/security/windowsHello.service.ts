import { Injectable } from '@angular/core';
import * as phoenix from '@lenovo/tan-client-bridge';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { CommonService } from '../common/common.service';

@Injectable({
	providedIn: 'root'
})
export class WindowsHelloService {
	isRS5OrLater: boolean;
	constructor(
		private vantageShell: VantageShellService,
		private commonService: CommonService) {}

	showWindowsHello(): boolean {
		const windowsHello: phoenix.WindowsHello = this.vantageShell.getSecurityAdvisor().windowsHello;
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
