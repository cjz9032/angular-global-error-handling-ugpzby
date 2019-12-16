import { Injectable } from '@angular/core';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { CountNumberOfIssuesService } from './count-number-of-issues.service';
import { UserDataStateService } from './app-statuses/user-data-state.service';
import { MockWindows } from '../../utils/moked-api';
import { FeaturesStatuses } from '../../userDataStatuses';
import { CommunicationWithFigleafService } from '../../utils/communication-with-figleaf/communication-with-figleaf.service';

export enum ScanFeatures {
	breachedAccountsScan = 'breachedAccountsScan',
	websiteTrackersScan = 'websiteTrackersScan',
	nonPrivatePasswordsScan = 'nonPrivatePasswordsScan',
}

export type WidgetCounters = {
	[key in ScanFeatures]: null | number;
};

function getCountOfIssues(status: FeaturesStatuses, issuesCount: number): number | null {
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
		[ScanFeatures.breachedAccountsScan]: null,
		[ScanFeatures.websiteTrackersScan]: null,
		[ScanFeatures.nonPrivatePasswordsScan]: null,
	};

	constructor(
		private countNumberOfIssuesService: CountNumberOfIssuesService,
		private userDataGetStateService: UserDataStateService,
		private communicationWithFigleafService: CommunicationWithFigleafService,
	) {
	}

	startWrite() {
		this.countNumberOfIssuesService.websiteTrackersCount.pipe(
			map((issueCount) => getCountOfIssues(this.userDataGetStateService.websiteTrackersResult, issueCount)),
			distinctUntilChanged()
		).subscribe((count) => {
			this.updateWidgetCounters({[ScanFeatures.websiteTrackersScan]: count});
		});
		this.countNumberOfIssuesService.breachedAccountsCount.pipe(
			map((issueCount) => getCountOfIssues(this.userDataGetStateService.breachedAccountsResult, issueCount)),
			distinctUntilChanged()
		).subscribe((count) => {
			this.updateWidgetCounters({[ScanFeatures.breachedAccountsScan]: count});
		});
		this.countNumberOfIssuesService.nonPrivatePasswordCount.pipe(
			map((issueCount) => getCountOfIssues(this.userDataGetStateService.nonPrivatePasswordResult, issueCount)),
			distinctUntilChanged()
		).subscribe((count) => {
			this.updateWidgetCounters({[ScanFeatures.nonPrivatePasswordsScan]: count});
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
