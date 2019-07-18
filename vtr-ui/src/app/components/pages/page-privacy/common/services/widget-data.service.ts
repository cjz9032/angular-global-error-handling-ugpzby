import { Injectable } from '@angular/core';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { getDisplayedCountValueOfIssues } from '../../utils/helpers';
import { CountNumberOfIssuesService } from './count-number-of-issues.service';
import { UserDataGetStateService } from './user-data-get-state.service';
import { MockWindows } from '../../utils/moked-api';


export interface WidgetCounters {
	breachedAccountsScan: null | number;
	websiteTrackersScan: null | number;
	nonPrivatePasswordsScan: null | number;
}

@Injectable({
	providedIn: 'root'
})
export class WidgetDataService {
	windows = window['Windows'] || MockWindows;

	private widgetCounters: WidgetCounters = {
		breachedAccountsScan: null,
		websiteTrackersScan: null,
		nonPrivatePasswordsScan: null,
	};

	constructor(
		private countNumberOfIssuesService: CountNumberOfIssuesService,
		private userDataGetStateService: UserDataGetStateService,
	) {
		countNumberOfIssuesService.websiteTrackersCount.pipe(
			map((issueCount) => (getDisplayedCountValueOfIssues(this.userDataGetStateService.websiteTrackersResult, issueCount)) || null),
			distinctUntilChanged()
		).subscribe((count) => {
			this.updateWidgetCounters({websiteTrackersScan: count});
		});
		countNumberOfIssuesService.breachedAccountsCount.pipe(
			map((issueCount) => (getDisplayedCountValueOfIssues(this.userDataGetStateService.breachedAccountsResult, issueCount)) || null),
			distinctUntilChanged()
		).subscribe((count) => {
			this.updateWidgetCounters({breachedAccountsScan: count});
		});
		countNumberOfIssuesService.nonPrivatePasswordCount.pipe(
			map((issueCount) => (getDisplayedCountValueOfIssues(this.userDataGetStateService.nonPrivatePasswordResult, issueCount)) || null),
			distinctUntilChanged()
		).subscribe((count) => {
			this.updateWidgetCounters({nonPrivatePasswordsScan: count});
		});
	}

	updateWidgetCounters(updateData) {
		this.widgetCounters = {
			...this.widgetCounters,
			...updateData,
		};
		this.writeWidgetDataFile();
	}

	writeWidgetDataFile() {
		const dataToWrite = JSON.stringify({counters: this.widgetCounters});

		const localFolder = this.windows.Storage.ApplicationData.current.localFolder;
		localFolder.createFileAsync('widget_data', this.windows.Storage.CreationCollisionOption.replaceExisting)
			.then((sampleFile) => {
				return this.windows.Storage.FileIO.writeTextAsync(sampleFile, dataToWrite);
			})
			.done();
	}
}
