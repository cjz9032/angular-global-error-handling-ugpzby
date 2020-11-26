import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class TimerService {
	private counter: number;
	private timer: any;
	constructor() {}

	/**
	 * start timer from 0
	 */
	public start(interval = 1000) {
		this.counter = 0;
		this.timer = setInterval(() => {
			this.counter += 1;
		}, interval);
	}

	/**
	 * stop timer and return counter value
	 */
	public stop(): number {
		if (this.timer) {
			clearInterval(this.timer);
			this.timer = null;
		}
		return this.counter;
	}
}
