import { Injectable } from '@angular/core';
import { AnalyticsService } from './analytics.service';
import { merge } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import { PrivacyScoreService } from '../../../pages/result/privacy-score/privacy-score.service';
import { snake2PascalCase } from '../../../utils/helpers';
import { TaskActionWithTimeoutService, TasksName } from './task-action-with-timeout.service';
import { FeaturesStatuses } from '../../../userDataStatuses';
import { AppStatusesService } from '../app-statuses/app-statuses.service';

const INSTALLED_TIMEOUT_FOR_TASK = 24 * 60 * 60 * 1000;

@Injectable({
	providedIn: 'root'
})
export class TaskObserverService {
	constructor(
		private analyticsService: AnalyticsService,
		private appStatusesService: AppStatusesService,
		private privacyScoreService: PrivacyScoreService,
		private taskActionWithTimeoutService: TaskActionWithTimeoutService,
	) {
	}

	start() {
		merge(
			this.taskActionWithTimeoutService.taskTimeWatcher(TasksName.privacyAppInstallationAction, INSTALLED_TIMEOUT_FOR_TASK).pipe(
				map((value) => {
					return {
						...value,
						TaskName: TasksName.privacyAppInstallationAction,
						TaskResult: value.TaskResult === 'Timeout' ? 'Timeout' : 'Installed',
					};
				})
			),
			this.taskActionWithTimeoutService.taskTimeWatcher(TasksName.scoreScanAction).pipe(
				withLatestFrom(this.privacyScoreService.newPrivacyScore$),
				map(([ value, score ]) => {
					const { privacyLevel } = this.privacyScoreService.getStaticDataAccordingToScore(score, this.appStatusesService.getGlobalStatus().appState);
					const taskResult = value.TaskResult === null ? snake2PascalCase(privacyLevel) : value.TaskResult;

					const isHasError = Object.values(this.appStatusesService.getGlobalStatus())
						.filter((status) => status === FeaturesStatuses.error)
						.length > 0;

					return {
						...value,
						TaskName: 'ScoreScan',
						TaskResult: isHasError ? 'Error' : taskResult
					};
				})
			),
			this.taskActionWithTimeoutService.taskTimeWatcher(TasksName.scanBreachesAction).pipe(
				map((value) => {
					return {
						...value,
						TaskName: 'BreachedAccountsScan',
						TaskResult: value.TaskResult === 'Timeout' ? 'Timeout' : this.appStatusesService.getGlobalStatus().breachedAccountsResult,
					};
				})
			),
			this.taskActionWithTimeoutService.taskTimeWatcher(TasksName.getNonPrivateStoragesAction).pipe(
				map((value) => {
					return {
						...value,
						TaskName: 'NonPrivatePasswordsScan',
						TaskResult: this.appStatusesService.getGlobalStatus().nonPrivatePasswordResult,
					};
				})
			),
			this.taskActionWithTimeoutService.taskTimeWatcher(TasksName.getTrackingDataAction).pipe(
				map((value) => {
					return {
						...value,
						TaskName: 'WebsiteTrackersScan',
						TaskResult: this.appStatusesService.getGlobalStatus().websiteTrackersResult,
					};
				})
			),
		).subscribe((result) => {
			const taskActionData = {
				...result,
				TaskName: `Privacy.${result.TaskName}`,
				TaskCount: 1,
			};
			this.analyticsService.sendTaskActionData(taskActionData);
		});
	}
}
