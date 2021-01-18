import { Injectable } from '@angular/core';
import { keyBy, mapValues } from 'lodash';
import { DeviceService } from '../device/device.service';
import { AppSearch } from './model/feature-ids.model';
import { IApplicableDetector as IApplicableDetector } from './model/interface.model';
import FeatureIds = AppSearch.FeatureIds;
@Injectable({
	providedIn: 'root',
})
export class FeatureApplicableDetections {
	private detectionFuncMap = {};
	private detectionFuncList: IApplicableDetector[] = [
		// dashboard
		{
			featureId: FeatureIds.Dashboard.pageId,
			isApplicable: () => {
				return this.isDashboardApplicable();
			}
		}
	];

	constructor(private deviceService: DeviceService) {
		this.detectionFuncMap = mapValues(keyBy(this.detectionFuncList, 'featureId'), 'isApplicable');
	}

	public isFeatureApplicable(featureId: string) {
		return this.detectionFuncMap[featureId]?.();
	}

	private isDashboardApplicable() {
		return !this.deviceService.isGaming;
	}
}
