import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, map, switchMap, take, timeout } from 'rxjs/operators';

export enum TasksName {
	scoreScanAction = 'scoreScanAction',
	privacyAppInstallationAction = 'privacyAppInstallationAction',
	scanBreachesAction = 'scanBreachesAction',
	getNonPrivateStoragesAction = 'getNonPrivateStoragesAction',
	getTrackingDataAction = 'getTrackingDataAction'
}

export const STANDART_TIMEOUT_FOR_TASK = 120000;

@Injectable()
export class TaskActionWithTimeoutService {
	private taskActionsStart$ = {
		[TasksName.scoreScanAction]: new Subject<number>(),
		[TasksName.privacyAppInstallationAction]: new Subject<number>(),
		[TasksName.scanBreachesAction]: new Subject<number>(),
		[TasksName.getNonPrivateStoragesAction]: new Subject<number>(),
		[TasksName.getTrackingDataAction]: new Subject<number>(),
	};

	private taskActionsFinished$ = {
		[TasksName.scoreScanAction]: new Subject(),
		[TasksName.privacyAppInstallationAction]: new Subject(),
		[TasksName.scanBreachesAction]: new Subject(),
		[TasksName.getNonPrivateStoragesAction]: new Subject(),
		[TasksName.getTrackingDataAction]: new Subject(),
	};

	startAction(actionName: TasksName) {
		this.taskActionsStart$[actionName].next(Date.now());
	}

	finishedAction(actionName: TasksName) {
		this.taskActionsFinished$[actionName].next();
	}

	private getTaskDuration(timeStart) {
		return(Date.now() - timeStart) / 1000;
	}

	taskTimeWatcher(taskName: TasksName, due = STANDART_TIMEOUT_FOR_TASK): Observable<{TaskDuration: number, TaskResult?: string}> {
		return this.taskActionsStart$[taskName]
			.pipe(
				switchMap((startTime) => {
					return this.taskActionsFinished$[taskName].pipe(
						debounceTime(500),
						map(() => ({TaskDuration: this.getTaskDuration(startTime)})),
						take(1),
						timeout(due),
						catchError(() => of({
							TaskResult: 'Timeout',
							TaskDuration: this.getTaskDuration(startTime)
						}))
					);
				})
			);
	}
}
