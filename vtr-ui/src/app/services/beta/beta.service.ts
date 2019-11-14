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
		let isBetaUser = this.commonService.getLocalStorageValue(LocalStorageKey.BetaUser);
		if (typeof isBetaUser === 'boolean') {
			return isBetaUser;
		} else if (this.betaUser) {
			return this.betaUser.getBetaUser().then((result) => {
				isBetaUser = result;
				this.commonService.setLocalStorageValue(LocalStorageKey.BetaUser, isBetaUser);
				return isBetaUser;
			}).catch(() => {
				return false;
			});
		}
		return false;
	}

	public setBetaStatus(value: boolean) {
		if (this.vantageShellService) {}
		this.commonService.setLocalStorageValue(LocalStorageKey.BetaUser, value);
		if (this.betaUser) {
			this.betaUser.setBetaUser(value);
		}
	}

}
