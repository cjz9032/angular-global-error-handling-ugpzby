import { Injectable } from '@angular/core';
import { keyBy, mapValues } from 'lodash';
import { DeviceService } from '../device/device.service';
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
		// dashboard
		{
			featureId: AppSearch.FeatureIds.SystemUpdate.pageId,
			isApplicable: async () => this.isSystemUpdateApplicable(),
		},
	];

	constructor(
		private deviceService: DeviceService,
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
}
