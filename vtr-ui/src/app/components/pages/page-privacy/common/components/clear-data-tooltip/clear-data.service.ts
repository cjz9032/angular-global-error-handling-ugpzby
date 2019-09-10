import { Injectable } from '@angular/core';
import { Features } from '../nav-tabs/nav-tabs.service';
import { ClearBreachesService } from './clear-data-strategy/clear-breaches.service';
import { ClearTrackersService } from './clear-data-strategy/clear-trackers.service';

@Injectable({
	providedIn: 'root'
})
export class ClearDataService {
	private strategy: {[feature in Features]: () => void} = {
		[Features.breaches]: this.clearBreachesService.clearData.bind(this.clearBreachesService),
		[Features.passwords]: this.clearTrackersService.clearData.bind(this.clearTrackersService),
		[Features.trackers]: this.clearTrackersService.clearData.bind(this.clearTrackersService),
	};

	constructor(
		private clearBreachesService: ClearBreachesService,
		private clearTrackersService: ClearTrackersService
	) {	}

	clearData(feature: Features) {
		this.strategy[feature]();
	}
}
