import { Injectable } from '@angular/core';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { CommonService } from '../common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';

@Injectable({
	providedIn: 'root'
})
export class BetaService {
	private betaUser;
	constructor(
		private vantageShellService: VantageShellService,
		private commonService: CommonService
	) {
		if (this.vantageShellService) {
			this.betaUser = this.vantageShellService.getBetaUser();
		}
	}

	public getBetaStatus(): boolean {
		this.commonService.removeLocalStorageValue(LocalStorageKey.BetaUser);
		let isBetaUser = this.commonService.getLocalStorageValue(LocalStorageKey.BetaTag, 'init');
		if (isBetaUser === 'init') {
			isBetaUser = false;
			this.setBetaStatus(false);
		}
		return isBetaUser;
	}

	public setBetaStatus(value: boolean) {
		this.commonService.setLocalStorageValue(LocalStorageKey.BetaTag, value);
		if (this.betaUser) {
			this.betaUser.setBetaUser(value);
		}
	}

}
