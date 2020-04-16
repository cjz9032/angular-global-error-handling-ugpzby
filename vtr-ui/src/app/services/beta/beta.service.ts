import { Injectable } from '@angular/core';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { CommonService } from '../common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { SegmentConst } from '../self-select/self-select.service';

export enum BetaStatus {
	On,
	Off
}

@Injectable({
	providedIn: 'root'
})
export class BetaService {
	private betaUser;
	public betaFeatureAvailable = false;
	constructor(
		private vantageShellService: VantageShellService,
		private commonService: CommonService
	) {
		if (this.vantageShellService) {
			this.betaUser = this.vantageShellService.getBetaUser();
		}
		this.commonService.removeLocalStorageValue(LocalStorageKey.BetaUser);
	}

	public getBetaStatus(): BetaStatus {
		const storedBetaStatus = this.commonService.getLocalStorageValue(LocalStorageKey.BetaTag, 'init');
		if (storedBetaStatus === 'init') {
			this.setBetaStatus(BetaStatus.Off);
			return BetaStatus.Off;
		} else {
			return storedBetaStatus ? BetaStatus.On : BetaStatus.Off;
		}
	}

	public showBetaFeature(): boolean {
		const segment = this.commonService.getLocalStorageValue(LocalStorageKey.LocalInfoSegment);
		return this.getBetaStatus() === BetaStatus.On && segment !== SegmentConst.Commercial;
	}

	public setBetaStatus(value: BetaStatus) {
		const preStoredValue = value === BetaStatus.On;
		this.commonService.setLocalStorageValue(LocalStorageKey.BetaTag, preStoredValue);
		if (this.betaUser) {
			this.betaUser.setBetaUser(preStoredValue);
		}
	}

	checkBetaFeatureAvailable(menu) {
		this.betaFeatureAvailable = this.anyBetaFeatureAvailable(menu);
	}

	anyBetaFeatureAvailable(menu: any): boolean {
		let result = false;
		if (menu && menu.length && menu.length > 0)
		{
			for (let i = 0; i < menu.length; i++) {
				const element = menu[i];
				if (element.beta && !element.hide) {
					result = true;
					break;
				}
				if (element.subitems && element.subitems.length > 0
					&& this.anyBetaFeatureAvailable(element.subitems)) {
					result = true;
					break;
				}

			}
		}
		return result;
	}
}
