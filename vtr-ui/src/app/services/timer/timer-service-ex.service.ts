import { Injectable } from '@angular/core';

class Duration {
	private start;
	constructor(private timerService: any) {
		this.start = timerService.getTick();
	}

	public getDuration(): number {
		return this.timerService.getTick() - this.start;
	}
}

@Injectable({
  providedIn: 'root'
})
export class TimerServiceEx {
	private counter = 0;
	constructor() {
		setInterval(() => {
			this.counter += 1;
		}, 1000);
	}

	public getTick() {
		return this.counter;
	}

	public getActiveCounter() {
		return new Duration(this);
	}
}

