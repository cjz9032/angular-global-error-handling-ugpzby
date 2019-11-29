import { Injectable } from '@angular/core';

interface IDuration {
	getDuration();
}

class FocusDuration implements IDuration {
	private start;
	constructor(private timerService: any) {
		this.start = timerService.getActiveFocusTick();
	}

	public getDuration(): number {
		return this.timerService.getActiveFocusTick() - this.start;
	}
}

class BlurDuration implements IDuration {
	private start;
	constructor(private timerService: any) {
		this.start = timerService.getActiveBlurTick();
	}

	public getDuration(): number {
		return this.timerService.getActiveBlurTick() - this.start;
	}
}

class SuspendDuration implements IDuration {
	private start;
	constructor(private timerService: any) {
		this.start = timerService.getSuspendTick();
	}

	public getDuration(): number {
		return this.timerService.getSuspendTick() - this.start;
	}
}

@Injectable({
  providedIn: 'root'
})
export class TimerServiceEx {
	private activeFocusCounter = 0;
	private activeBlurCounter = 0;
	private suspendCounter = 0;
	private suspendStart = -1;

	private appVisible = true;
	private appFocus = true;

	constructor() {
		document.addEventListener('visibilitychange', () => {
			if (document.hidden) {
				this.onInvisable();
			} else {
				this.onVisable();
			}
		});

		document.addEventListener('vantageLoseFocus', () => {
			this.appFocus = false;
		});

		document.addEventListener('vantageGetFocus', () => {
			this.appFocus = true;
		});

		setInterval(() => {
			if (this.appVisible) {
				if (this.appFocus) {	// vantage is visible and in focus
					this.activeFocusCounter += 1;
				} else {				// vantage is visible and out of focus
					this.activeBlurCounter += 1;
				}
			}
		}, 1000);
	}

	private onVisable() {
		if (this.suspendStart !== -1) {
			this.suspendCounter += Math.round((Date.now() - this.suspendStart) / 1000);
			this.suspendStart = -1;
		}
		this.appVisible = true;
	}

	private onInvisable() {
		this.suspendStart = Date.now();
		this.appVisible = false;
	}

	private getActiveFocusTick() {
		return this.activeFocusCounter;
	}

	private getActiveBlurTick() {
		return this.activeBlurCounter;
	}

	private getSuspendTick() {
		return this.suspendCounter;
	}

	public getFocusDurationCounter() {
		return new FocusDuration(this);
	}

	public getBlurDurationCounter() {
		return new BlurDuration(this);
	}

	public getSuspendDurationCounter() {
		return new SuspendDuration(this);
	}
}
