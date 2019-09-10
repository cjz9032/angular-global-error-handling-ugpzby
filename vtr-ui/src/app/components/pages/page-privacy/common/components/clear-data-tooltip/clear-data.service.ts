import { Injectable } from '@angular/core';
import { Features } from '../nav-tabs/nav-tabs.service';
import { ClearBreachesService } from './clear-data-strategy/clear-breaches.service';

@Injectable({
	providedIn: 'root'
})
export class ClearDataService {
	private strategy: {[feature in Features]: () => void} = {
		[Features.breaches]: this.clearBreachesService.clearData.bind(this.clearBreachesService),
		[Features.passwords]: this.clearBreachesService.clearData,
		[Features.trackers]: this.clearBreachesService.clearData,
	};

	constructor(
		private clearBreachesService: ClearBreachesService
	) {	}

	clearData(feature: Features) {
		this.strategy[feature]();
	}
}
