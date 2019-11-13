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

	public getBetaStatus(): Promise<boolean> {
		if (this.betaUser) {
			return this.betaUser.getBetaUser().then((result) => {
				return result;
			}).catch(() => {
				return false;
			});
		}
		return Promise.resolve(false);
	}

	public setBetaStatus(value: boolean) {
		if (this.betaUser) {
			this.betaUser.setBetaUser(value);
		}
	}

}
