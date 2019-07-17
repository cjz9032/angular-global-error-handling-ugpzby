import {Injectable} from '@angular/core';
import {distinctUntilChanged, map} from 'rxjs/operators';
import {CountNumberOfIssuesService} from './count-number-of-issues.service';
import {UserDataGetStateService} from './user-data-get-state.service';
import {MockWindows} from '../../utils/moked-api';
import {FeaturesStatuses} from '../../userDataStatuses';
import {CommunicationWithFigleafService} from '../../utils/communication-with-figleaf/communication-with-figleaf.service';


export interface WidgetCounters {
	breachedAccountsScan: null | number;
	websiteTrackersScan: null | number;
	nonPrivatePasswordsScan: null | number;
}

function getCountOfIssues(status: FeaturesStatuses, issuesCount) {
	switch (status) {
		case FeaturesStatuses.exist:
			return issuesCount;
		case FeaturesStatuses.none:
			return 0;
		case FeaturesStatuses.undefined:
			return null;
		default:
			return null;
	}
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
		private communicationWithFigleafService: CommunicationWithFigleafService,
	) {
		countNumberOfIssuesService.websiteTrackersCount.pipe(
			map((issueCount) => getCountOfIssues(this.userDataGetStateService.websiteTrackersResult, issueCount)),
			distinctUntilChanged()
		).subscribe((count) => {
			this.updateWidgetCounters({websiteTrackersScan: count});
		});
		countNumberOfIssuesService.breachedAccountsCount.pipe(
			map((issueCount) => getCountOfIssues(this.userDataGetStateService.breachedAccountsResult, issueCount)),
			distinctUntilChanged()
		).subscribe((count) => {
			this.updateWidgetCounters({breachedAccountsScan: count});
		});
		countNumberOfIssuesService.nonPrivatePasswordCount.pipe(
			map((issueCount) => getCountOfIssues(this.userDataGetStateService.nonPrivatePasswordResult, issueCount)),
			distinctUntilChanged()
		).subscribe((count) => {
			this.updateWidgetCounters({nonPrivatePasswordsScan: count});
		});
	}

	updateWidgetCounters(updateData) {
		if (!this.communicationWithFigleafService.isFigleafInstalled) {
			this.widgetCounters = {
				...this.widgetCounters,
				...updateData,
			};
			this.writeWidgetDataFile();
		}
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
