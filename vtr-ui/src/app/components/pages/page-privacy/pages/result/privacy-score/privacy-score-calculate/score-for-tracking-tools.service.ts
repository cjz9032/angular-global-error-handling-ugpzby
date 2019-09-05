import { Injectable } from '@angular/core';
import { coefficients } from './coefficients';
import { catchError, filter, map, startWith } from 'rxjs/operators';
import { FeaturesStatuses } from '../../../../userDataStatuses';
import { of } from 'rxjs';
import { FigleafOverviewService, FigleafSettings } from '../../../../common/services/figleaf-overview.service';
import { AppStatusesService } from '../../../../common/services/app-statuses/app-statuses.service';
import { ScoreCalculate } from './score-calculate.interface';

@Injectable({
	providedIn: 'root'
})
export class ScoreForTrackingToolsService implements ScoreCalculate {

	constructor(
		private appStatusesService: AppStatusesService,
	) {
	}

	getScore() {
		const defaultValue = (coefficients.trackingTools * coefficients.withoutScan) as number;

		return this.appStatusesService.globalStatus$.pipe(
			filter((appStatuses) => appStatuses.websiteTrackersResult !== FeaturesStatuses.undefined),
			map((appStatuses) => Number((appStatuses.websiteTrackersResult === FeaturesStatuses.none)) * coefficients.trackingTools),
			startWith(defaultValue),
			catchError((err) => of(defaultValue)),
		);
	}
}
