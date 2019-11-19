import { Injectable } from '@angular/core';
import { Features } from '../nav-tabs/nav-tabs.service';
import { ClearBreachesService } from '../../../feature/check-breached-accounts/services/clear-breaches.service';
import { ClearTrackersService } from './clear-data-strategy/clear-trackers.service';
import { ClearPasswordService } from './clear-data-strategy/clear-password.service';
import { ScanFeatures, WidgetDataService } from '../../services/widget-data.service';

@Injectable({
	providedIn: 'root'
})
export class ClearDataService {
	private strategy: { [feature in Features]: () => void } = {
		[Features.breaches]: this.clearBreachesService.clearData.bind(this.clearBreachesService),
		[Features.passwords]: this.clearPasswordService.clearData.bind(this.clearPasswordService),
		[Features.trackers]: this.clearTrackersService.clearData.bind(this.clearTrackersService),
	};

	private texts: { [feature in Features]: {text: string, content: string} } = {
		[Features.breaches]: {
			text: 'Clear my breach results',
			content: 'Are you sure you want to clear the information about found breaches?'
		},
		[Features.trackers]: {
			text: 'Clear my tracking tools results',
			content: 'Are you sure you want to clear the information about found tracking tools?'
		},
		[Features.passwords]: {
			text: 'Clear my vulnerable passwords results',
			content: 'Are you sure you want to clear the information about found vulnerable passwords?'
		},
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
		this.strategy[feature]();
		this.widgetDataService.updateWidgetCounters({[this.getFeatureName(feature)]: null});
	}

	getFeatureName(feature: Features): ScanFeatures {
		return this.featuresNames[feature];
	}

	getText(feature: Features) {
		return this.texts[feature];
	}
}
