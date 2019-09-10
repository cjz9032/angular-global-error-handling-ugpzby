import { Injectable } from '@angular/core';
import { Features } from '../nav-tabs/nav-tabs.service';
import { ClearBreachesService } from './clear-data-strategy/clear-breaches.service';
import { ClearTrackersService } from './clear-data-strategy/clear-trackers.service';
import { ClearPasswordService } from './clear-data-strategy/clear-password.service';

@Injectable({
	providedIn: 'root'
})
export class ClearDataService {
	private strategy: {[feature in Features]: () => void} = {
		[Features.breaches]: this.clearBreachesService.clearData.bind(this.clearBreachesService),
		[Features.passwords]: this.clearPasswordService.clearData.bind(this.clearPasswordService),
		[Features.trackers]: this.clearTrackersService.clearData.bind(this.clearTrackersService),
	};

	constructor(
		private clearBreachesService: ClearBreachesService,
		private clearTrackersService: ClearTrackersService,
		private clearPasswordService: ClearPasswordService
	) {	}

	clearData(feature: Features) {
		this.strategy[feature]();
	}
}
