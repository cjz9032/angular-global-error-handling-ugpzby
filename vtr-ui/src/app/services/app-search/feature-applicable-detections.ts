import { Injectable } from '@angular/core';
import { keyBy, mapValues } from 'lodash';

import { DeviceService } from '../device/device.service';
import { HypothesisService } from '../hypothesis/hypothesis.service';
import { LocalCacheService } from '../local-cache/local-cache.service';
import { LocalInfoService } from '../local-info/local-info.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { SegmentConst, SegmentConstHelper } from '../self-select/self-select.service';
import { SystemUpdateService } from '../system-update/system-update.service';
import { AppSearch } from './model/feature-ids.model';
import { IApplicableDetector as IApplicableDetector } from './model/interface.model';

@Injectable({
	providedIn: 'root',
})
export class FeatureApplicableDetections {
	private detectionFuncMap = {};
	private detectionFuncList: IApplicableDetector[] = [
		// dashboard
		{
			featureId: AppSearch.FeatureIds.Dashboard.pageId,
			isApplicable: async () => this.isDashboardApplicable(),
		},
		// system update
		{
			featureId: AppSearch.FeatureIds.SystemUpdate.pageId,
			isApplicable: async () => this.isSystemUpdateApplicable(),
		},
		// MySecurity
		{
			featureId: AppSearch.FeatureIds.MySecurity.pageId,
			isApplicable: async () => this.isMySecurityApplicable(),
		},
		// AntiVirus
		{
			featureId: AppSearch.FeatureIds.AntiVirus.pageId,
			isApplicable: async () => this.isAntiVirusApplicable(),
		},
		// PasswordHealth
		{
			featureId: AppSearch.FeatureIds.PasswordHealth.pageId,
			isApplicable: async () => this.isPasswordHealthAndVpnSecurityApplicable(),
		},
		// WifiSecurity
		{
			featureId: AppSearch.FeatureIds.WifiSecurity.pageId,
			isApplicable: async () => this.isWifiSecurityApplicable(),
		},
		// VPNSecurity
		{
			featureId: AppSearch.FeatureIds.VpnSecurity.pageId,
			isApplicable: async () => this.isPasswordHealthAndVpnSecurityApplicable(),
		},
		// HomeSecurity
		{
			featureId: AppSearch.FeatureIds.HomeSecurity.pageId,
			isApplicable: async () => this.isHomeSecurityApplicable(),
		},
	];

	constructor(
		private deviceService: DeviceService,
		private hypSettings: HypothesisService,
		private localCacheService: LocalCacheService,
		private localInfoService: LocalInfoService,
		private systemUpdateService: SystemUpdateService
	) {
		this.detectionFuncMap = mapValues(
			keyBy(this.detectionFuncList, 'featureId'),
			'isApplicable'
		);
	}

	public async isFeatureApplicable(featureId: string) {
		return await this.detectionFuncMap[featureId]?.();
	}

	private isDashboardApplicable() {
		return !this.deviceService.isGaming;
	}

	private isSystemUpdateApplicable() {
		return this.systemUpdateService.isSystemUpdateEnabled();
	}

	private isMySecurityApplicable() {
		const segment = this.localCacheService.getLocalCacheValue(LocalStorageKey.LocalInfoSegment);
		if (
			(SegmentConstHelper.includedInCommonConsumer(segment) ||
				segment === SegmentConst.SMB) &&
			!this.deviceService.isArm &&
			!this.deviceService.isSMode
		) {
			return true;
		}
		return false;
	}

	private isAntiVirusApplicable() {
		const segment: SegmentConst = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.LocalInfoSegment
		);
		if (
			!this.deviceService.isArm &&
			!this.deviceService.isSMode &&
			!this.deviceService.isGaming &&
			segment !== SegmentConst.Commercial
		) {
			return true;
		}
		return false;
	}

	private isPasswordHealthAndVpnSecurityApplicable() {
		let isCN: boolean;
		this.localInfoService.getLocalInfo().then((result) => {
			if (result.GEO === 'cn') {
				isCN = true;
			}
			isCN = false;
		});
		const segment: SegmentConst = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.LocalInfoSegment
		);
		if (
			!isCN &&
			!this.deviceService.isArm &&
			!this.deviceService.isSMode &&
			!this.deviceService.isGaming &&
			segment !== SegmentConst.Commercial
		) {
			return true;
		}
		return false;
	}

	private isWifiSecurityApplicable() {
		const wsCacheState = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.SecurityShowWifiSecurity
		);
		if (!this.deviceService.isArm && !this.deviceService.isSMode && wsCacheState) {
			return true;
		}
		return false;
	}

	private async isHomeSecurityApplicable() {
		const locale = this.deviceService.machineInfo.locale;
		const country = this.deviceService.machineInfo.country;
		const chsHypsis = await this.hypSettings
			.getFeatureSetting('ConnectedHomeSecurity')
			.then((result) => (result || '').toString() === 'true');
		const chsAvailability =
			country.toLowerCase() === 'us' && locale.startsWith('en') && chsHypsis;
		const segment: SegmentConst = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.LocalInfoSegment
		);
		if (
			chsAvailability &&
			!this.deviceService.isArm &&
			!this.deviceService.isSMode &&
			!this.deviceService.isGaming &&
			segment !== SegmentConst.Commercial
		) {
			return true;
		}
		return false;
	}
}
