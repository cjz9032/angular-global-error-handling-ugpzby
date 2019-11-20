import { Injectable } from '@angular/core';
import { Features } from '../nav-tabs/nav-tabs.service';
import { ClearBreachesService } from '../../../feature/check-breached-accounts/services/clear-breaches.service';
import { ClearTrackersService } from '../../../feature/tracking-map/services/clear-trackers.service';
import { ClearPasswordService } from '../../../feature/non-private-password/services/clear-password.service';
import { ScanFeatures, WidgetDataService } from '../../services/widget-data.service';
import { ClearData } from './clear-data';

@Injectable({
	providedIn: 'root'
})
export class ClearDataService {
	private clearDataServices: { [feature in Features]: ClearData } = {
		[Features.breaches]: this.clearBreachesService,
		[Features.passwords]: this.clearPasswordService,
		[Features.trackers]: this.clearTrackersService,
	};

	private featuresNames = {
		[Features.breaches]: ScanFeatures.breachedAccountsScan,
		[Features.trackers]: ScanFeatures.websiteTrackersScan,
		[Features.passwords]: ScanFeatures.nonPrivatePasswordsScan,
	};

	constructor(
		private clearBreachesService: ClearBreachesService,
		private clearTrackersService: ClearTrackersService,
		private clearPasswordService: ClearPasswordService,
		private widgetDataService: WidgetDataService
	) {
	}

	clearData(feature: Features) {
		this.clearDataServices[feature].clearData();
		this.widgetDataService.updateWidgetCounters({[this.getFeatureName(feature)]: null});
	}

	getText(feature: Features) {
		return this.clearDataServices[feature].getText();
	}

	private getFeatureName(feature: Features): ScanFeatures {
		return this.featuresNames[feature];
	}
}
