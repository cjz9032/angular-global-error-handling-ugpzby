import { Injectable } from '@angular/core';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { CommonService } from '../common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { SegmentConst } from '../self-select/self-select.service';
import { Subscription } from 'rxjs';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { MenuItem } from 'src/app/enums/menuItem.enum';

export enum BetaStatus {
	On,
	Off
}

@Injectable({
	providedIn: 'root'
})
export class BetaService {
	private betaUser;
	private subscription: Subscription;
	public betaFeatureAvailable = false;
	constructor(
		private vantageShellService: VantageShellService,
		private commonService: CommonService
	) {
		if (this.vantageShellService) {
			this.betaUser = this.vantageShellService.getBetaUser();
		}
		this.commonService.removeLocalStorageValue(LocalStorageKey.BetaUser);
		this.subscription = this.commonService.notification.subscribe((notification: AppNotification) => {
			this.onNotification(notification);
		});
	}

	private onNotification(notification: any) {
		if (notification) {
			switch (notification.type) {
				case MenuItem.MenuItemChange:
					const menu = notification.payload;
					this.betaFeatureAvailable = this.isAnyBetaFeatureAvailable(menu);
					break;
				default:
					break;
			}
		}
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

	isAnyBetaFeatureAvailable(menu) {
		let result = false;
		if (menu && menu.length && menu.length > 0)
		{
			menu.forEach(element => {
				if (element.beta && !element.hide) {
					result = true;
					return;
				}
				if (element.subitems && element.subitems.length > 0) {
					element.subitems.forEach(item => {
						if (item.beta && !item.hide) {
							result = true;
							return;
						}
					});
				}
			});
		}

		return result;
	}
}
