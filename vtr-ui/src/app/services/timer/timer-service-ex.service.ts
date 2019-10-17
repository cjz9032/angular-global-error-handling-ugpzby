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
	private enableCounting = true;
	constructor() {
		window.addEventListener('focus', () => {
			this.onWindowFocus();
		});

		window.addEventListener('blur', () => {
			this.onWindowBlur();
		});

		document.addEventListener('visibilitychange', () => {
			if (document.hidden) {
				this.onInvisable();
			} else {
				this.onVisable();
			}
		});

		setInterval(() => {
			if (this.enableCounting) {
				this.counter += 1;
			}
		}, 1000);
	}

	private onWindowFocus(): void {
		this.onResume();
	}

	private onInvisable(): void {
		this.onResume();
	}

	private onWindowBlur(): void {
		this.onSuspend();
	}

	private onVisable(): void {
		this.onSuspend();
	}

	private onResume() {
		this.enableCounting = true;
	}

	private onSuspend() {
		this.enableCounting = false;
	}

	private getTick() {
		return this.counter;
	}

	public getActiveCounter() {
		return new Duration(this);
	}
}

