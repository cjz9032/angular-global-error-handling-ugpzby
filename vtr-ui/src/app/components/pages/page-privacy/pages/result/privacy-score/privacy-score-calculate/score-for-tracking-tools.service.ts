import { Injectable } from '@angular/core';
import { coefficients } from './coefficients';
import { catchError, map, startWith } from 'rxjs/operators';
import { FeaturesStatuses } from '../../../../userDataStatuses';
import { of } from 'rxjs';
import { AppStatusesService } from '../../../../core/services/app-statuses/app-statuses.service';
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
			map((appStatuses) => {
				const isExist = appStatuses.websiteTrackersResult !== FeaturesStatuses.undefined && appStatuses.websiteTrackersResult !== FeaturesStatuses.error;
				return isExist ? Number((appStatuses.websiteTrackersResult === FeaturesStatuses.none)) * coefficients.trackingTools : defaultValue;
			}),
			startWith(defaultValue),
			catchError((err) => of(defaultValue)),
		);
	}
}
