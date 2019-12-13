import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, map, switchMap, take, tap, timeout } from 'rxjs/operators';

export enum TasksName {
	scoreScanAction = 'scoreScanAction',
	privacyAppInstallationAction = 'AppInstallationAction',
	scanBreachesAction = 'scanBreachesAction',
	getNonPrivateStoragesAction = 'getNonPrivateStoragesAction',
	getTrackingDataAction = 'getTrackingDataAction'
}

export const STANDARD_TIMEOUT_FOR_TASK = 120000;

@Injectable({
	providedIn: 'root'
})
export class TaskActionWithTimeoutService {
	private taskActionsStart$ = this.createSubjectsFromTasksName<number>();
	private taskActionsFinished$ = this.createSubjectsFromTasksName<string>();

	startAction(actionName: TasksName) {
		this.taskActionsStart$[actionName].next(Date.now());
	}

	finishedAction(actionName: TasksName, value = null) {
		this.taskActionsFinished$[actionName].next(value);
	}

	private getTaskDuration(timeStart) {
		return Math.round((Date.now() - timeStart) / 1000);
	}

	taskTimeWatcher(taskName: TasksName, due = STANDARD_TIMEOUT_FOR_TASK): Observable<{TaskDuration: number, TaskResult?: string}> {
		return this.taskActionsStart$[taskName]
			.pipe(
				switchMap((startTime) => {
					return this.taskActionsFinished$[taskName].pipe(
						debounceTime(500),
						map((taskActionResult) => ({
							TaskDuration: this.getTaskDuration(startTime),
							TaskResult: taskActionResult || null
						})),
						take(1),
						timeout(due),
						catchError(() => of({
							TaskResult: 'Timeout',
							TaskDuration: this.getTaskDuration(startTime)
						}))
					);
				}),
				tap((res) => console.log('for Mars analytics >>>>', res))
			);
	}

	private createSubjectsFromTasksName<T>(): {[TaskName in TasksName]: Subject<T>} {
		return Object.keys(TasksName).reduce((prev, key) => this.createSubject<number>(prev, key), {});
	}

	private createSubject<T>(prev, key: string) {
		return {
			...prev,
			[TasksName[key]]: new Subject<T>()
		};
	}
}
