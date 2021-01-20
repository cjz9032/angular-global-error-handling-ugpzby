import { Injectable } from '@angular/core';
import { keyBy, mapValues, toLower } from 'lodash';

import { DeviceService } from '../device/device.service';
import { HypothesisService } from '../hypothesis/hypothesis.service';
import { LocalCacheService } from '../local-cache/local-cache.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { SegmentConst, SegmentConstHelper } from '../self-select/self-select.service';
import { LoggerService } from '../logger/logger.service';
import { SystemUpdateService } from '../system-update/system-update.service';
import { AppSearch } from './model/feature-ids.model';
import { IApplicableDetector as IApplicableDetector } from './model/interface.model';
import { HardwareScanService } from 'src/app/modules/hardware-scan/services/hardware-scan.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { DisplayService } from 'src/app/services/display/display.service';

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
		// Smart Performance
		{
			featureId: AppSearch.FeatureIds.SmartPerformance.pageId,
			isApplicable: async () => this.isSmartPerformanceApplicable(),
		},
		// Hardware Scan
		{
			featureId: AppSearch.FeatureIds.HardwareScan.pageId,
			isApplicable: async () => this.isHardwareScanApplicable(),
		},
		// Camera Settings
		{
			featureId: AppSearch.FeatureIds.CameraAndDisplay.cameraSettingsId,
			isApplicable: async () => this.isCameraSettingsApplicable()
		},
	];
	Windows: any;

	constructor(
		private deviceService: DeviceService,
		private hypSettings: HypothesisService,
		private localCacheService: LocalCacheService,
		private systemUpdateService: SystemUpdateService,
		private hardwareScanService: HardwareScanService,
		private logger: LoggerService,
		private vantageShellService: VantageShellService,
		private displayService: DisplayService,
	) {
		this.detectionFuncMap = mapValues(
			keyBy(this.detectionFuncList, 'featureId'),
			'isApplicable'
		);
		this.Windows = this.vantageShellService.getWindows();
	}

	public async isFeatureApplicable(featureId: string) {
		try {
			return await this.detectionFuncMap[featureId]?.();
		} catch (ex) {
			this.logger.error(`check applicable error:${JSON.stringify(featureId)}: ${ex.message}`);
			return false;
		}
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
		const locale = this.deviceService.machineInfo.locale;
		const segment: SegmentConst = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.LocalInfoSegment
		);
		if (
			toLower(locale) !== 'cn' &&
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

	private async isSmartPerformanceApplicable() {
		if (this.hypSettings) {
			return this.hypSettings.getFeatureSetting('SmartPerformance').then(
				(result) => (result || '').toString().toLowerCase() === 'true',
				() => false,
			);
		}
		return false;
	}

	private isHardwareScanApplicable() {
		return this.hardwareScanService.isAvailable();
	}

	private async isCameraSettingsApplicable() {
		const deviceInformation = this.Windows?.Devices.Enumeration.DeviceInformation;
		const deviceClass = this.Windows?.Devices.Enumeration.DeviceClass;
		let frontCameraCount = 0;
		const panel = this.Windows.Devices.Enumeration.Panel.front;
			const devices = await deviceInformation.findAllAsync(
				deviceClass.videoCapture
			);
			devices.forEach((cameraDeviceInfo) => {
				if (
					cameraDeviceInfo.enclosureLocation !== null &&
					cameraDeviceInfo.enclosureLocation.panel === panel
				) {
					frontCameraCount = frontCameraCount + 1;
				}
			});
		if (frontCameraCount <= 0) {
			return false;
		}
		const cameraSettingsRes = await this.displayService.getCameraSettingsInfo();
		if(!cameraSettingsRes) {
			return false;
		}
		return true;
	}
}
