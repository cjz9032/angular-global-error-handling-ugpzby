import { Injectable } from '@angular/core';
import { ScoreCalculate } from './score-calculate.interface';
import { catchError, map, startWith } from 'rxjs/operators';
import { coefficients } from './coefficients';
import { of } from 'rxjs';
import { FigleafOverviewService, FigleafSettings } from '../../../../core/services/figleaf-overview.service';

@Injectable({
	providedIn: 'root'
})
export class ScoreForMonitoringService implements ScoreCalculate {

	constructor(
		private figleafOverviewService: FigleafOverviewService,
	) {
	}

	private monitoringEnable$ = this.getFigleafSetting((settings: FigleafSettings) => settings.isBreachMonitoringEnabled);

	getScore() {
		return this.monitoringEnable$.pipe(
			startWith(false),
			map((isMonitoringEnable) => Number(isMonitoringEnable) * coefficients.breachMonitoring),
			catchError((err) => {
				return of(0);
			}),
		);
	}

	private getFigleafSetting(mapFunc) {
		return this.figleafOverviewService.figleafSettings$.pipe(
			map(mapFunc),
			startWith(false),
		);
	}
}
