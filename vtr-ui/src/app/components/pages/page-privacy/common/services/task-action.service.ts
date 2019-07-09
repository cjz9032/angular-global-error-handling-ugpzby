import { Injectable } from '@angular/core';
import { AnalyticsService } from './analytics.service';
import { UserDataGetStateService } from './user-data-get-state.service';
import { merge } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import { PrivacyScoreService } from '../../pages/result/privacy-score/privacy-score.service';
import { snake2PascalCase } from '../../utils/helpers';
import { TaskActionWithTimeoutService, TasksName } from './analytics/task-action-with-timeout.service';

const INSTALLED_TIMEOUT_FOR_TASK = 24 * 60 * 60 * 1000;

@Injectable()
export class TaskActionService {
	constructor(
		private analyticsService: AnalyticsService,
		private userDataGetStateService: UserDataGetStateService,
		private privacyScoreService: PrivacyScoreService,
		private taskActionWithTimeoutService: TaskActionWithTimeoutService,
	) {
		merge(
			this.taskActionWithTimeoutService.taskTimeWatcher(TasksName.privacyAppInstallationAction, INSTALLED_TIMEOUT_FOR_TASK).pipe(
				map((value) => {
					return {
						...value,
						TaskName: 'PrivacyAppInstallation',
						TaskResult: value.TaskResult === 'Timeout' ? 'Timeout' : 'Installed',
					};
				})
			),
			this.taskActionWithTimeoutService.taskTimeWatcher(TasksName.scoreScanAction).pipe(
				withLatestFrom(this.privacyScoreService.newPrivacyScore$),
				map(([value, score]) => {
					const {privacyLevel} = this.privacyScoreService.getStaticDataAccordingToScore(score);

					return {
						...value,
						TaskName: 'ScoreScan',
						TaskResult: value.TaskResult === 'Timeout' ? 'Timeout' : snake2PascalCase(privacyLevel),
					};
				})
			),
			this.taskActionWithTimeoutService.taskTimeWatcher(TasksName.scanBreachesAction).pipe(
				map((value) => {
					return {
						...value,
						TaskName: 'BreachedAccountsScan',
						TaskResult: value.TaskResult === 'Timeout' ? 'Timeout' : this.userDataGetStateService.getUserDataStatus().breachedAccountsResult,
					};
				})
			),
			this.taskActionWithTimeoutService.taskTimeWatcher(TasksName.getNonPrivateStoragesAction).pipe(
				map((value) => {
					return {
						...value,
						TaskName: 'NonPrivatePasswordsScan',
						TaskResult: this.userDataGetStateService.getUserDataStatus().nonPrivatePasswordResult,
					};
				})
			),
			this.taskActionWithTimeoutService.taskTimeWatcher(TasksName.getTrackingDataAction).pipe(
				map((value) => {
					return {
						...value,
						TaskName: 'WebsiteTrackersScan',
						TaskResult: this.userDataGetStateService.getUserDataStatus().websiteTrackersResult,
					};
				})
			),
		).subscribe((result) => {
			const taskActionData = {
				...result,
				TaskCount: 1,
			};
			this.analyticsService.sendTaskActionData(taskActionData);
		});
	}
}
