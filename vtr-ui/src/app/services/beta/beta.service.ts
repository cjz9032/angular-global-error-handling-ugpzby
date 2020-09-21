import { Injectable } from '@angular/core';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { CommonService } from '../common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { SegmentConst } from '../self-select/self-select.service';
import { LocalCacheService } from '../local-cache/local-cache.service';

export enum BetaStatus {
	On,
	Off
}

@Injectable({
	providedIn: 'root'
})
export class BetaService {
	private betaUser;
	private _betaFeatureAvailable = false;

	constructor(
		private vantageShellService: VantageShellService,
		private localCacheService: LocalCacheService,
		private commonService: CommonService
	) {
		if (this.vantageShellService) {
			this.betaUser = this.vantageShellService.getBetaUser();
		}
		this.commonService.removeLocalStorageValue(LocalStorageKey.BetaUser);
	}

	public get betaFeatureAvailable() {
		return this._betaFeatureAvailable;
	}

	public set betaFeatureAvailable(value: boolean) {
		this._betaFeatureAvailable = value;
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

	public async showBetaFeature(): Promise<boolean> {
		const segment = await this.localCacheService.getLocalCacheValue(LocalStorageKey.LocalInfoSegment);
		return this.getBetaStatus() === BetaStatus.On && segment !== SegmentConst.Commercial;
	}

	public setBetaStatus(value: BetaStatus) {
		const preStoredValue = value === BetaStatus.On;
		this.commonService.setLocalStorageValue(LocalStorageKey.BetaTag, preStoredValue);
		if (this.betaUser) {
			this.betaUser.setBetaUser(preStoredValue);
		}
	}
}
