import { Injectable, NgZone } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IdleService {
  queue: any[] = [];
  scheduleTimer: any;

  constructor(
	  private ngZone: NgZone
  ) {
  }

  public start() {
	this.ngZone.onMicrotaskEmpty.subscribe(() => {
		this.trigger();
	});
  }

  private trigger() {
	if (!this.scheduleTimer) {
		this.scheduleTimer = setTimeout(() => {
			this.scheduleTimer = null;
			if (!this.ngZone.hasPendingMicrotasks) {
				this.execute();
			}
		}, 500);
	}
  }

  private execute() {
	if (this.queue.length > 0) {
		this.queue.forEach((scheduleItem) => {
			if (scheduleItem
				&& scheduleItem.task
				&& scheduleItem.isRunInZone) {
				this.ngZone.run(() => {
					scheduleItem.task.call(scheduleItem.taskOwner);
				});
			}
			if (scheduleItem
				&& scheduleItem.task
				&& !scheduleItem.isRunInZone) {
				this.ngZone.runOutsideAngular(() => {
					scheduleItem.task.call(scheduleItem.taskOwner);
				});
			}
		});
	}
  }

  public schedule(taskKey, isRunInZone, task, taskOwner) {
	this.queue.push({ taskKey, isRunInZone, task, taskOwner });
  }
}
