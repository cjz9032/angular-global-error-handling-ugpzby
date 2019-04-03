import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { CommonService } from '../common/common.service';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';

@Injectable({
	providedIn: 'root',
})
export class WindowsHelloGuardService implements CanActivate {
	constructor(private commonService: CommonService, private vantageShellService: VantageShellService) { }

	canActivate(): boolean {
		const windowsHello = this.vantageShellService.getSecurityAdvisor().windowsHello;
		return this.commonService.isRS5OrLater()
			&& (typeof windowsHello.facialIdStatus === 'string'
				|| typeof windowsHello.fingerPrintStatus === 'string');
	}
}
