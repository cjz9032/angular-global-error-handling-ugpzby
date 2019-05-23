import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	EventEmitter,
	NgZone,
	OnInit,
	Output
} from '@angular/core';
import { Permit } from '../services/one-click-scan-steps.service';
import { interval, Subject, timer } from 'rxjs';
import { animationFrame } from 'rxjs/internal/scheduler/animationFrame';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';

const DURATION_FOR_PROGRESS_BAR_MS = 4000;

@Component({
	selector: 'vtr-scanning',
	templateUrl: './scanning.component.html',
	styleUrls: ['./scanning.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScanningComponent implements OnInit, Permit {
	@Output() allow = new EventEmitter<boolean>();
	private progressTime = new Subject();
	progressTime$ = this.progressTime.asObservable();

	constructor(
		private changeDetectorRef: ChangeDetectorRef,
		private zone: NgZone
	) {}

	ngOnInit() {
		this.startCalculateProgressTime();
	}

	allowEmitter() {
		this.allow.emit(true);
	}

	disallowEmitter() {
		this.allow.emit(false);
	}

	private startCalculateProgressTime() {
		try {
			const oldTime = window.performance.now();

			this.zone.runOutsideAngular(() => {
				interval(0, animationFrame).pipe(
					takeUntil(timer(DURATION_FOR_PROGRESS_BAR_MS)),
					map(() => {
						const newTime = window.performance.now();
						const diff = Math.round(newTime - oldTime);
						const val = Math.round(diff / DURATION_FOR_PROGRESS_BAR_MS * 100);
						return val > 100 ? 100 : val;
					}),
					distinctUntilChanged()
				).subscribe((val) => {
					this.progressTime.next(val);
					this.changeDetectorRef.detectChanges();
				});
			});
		} catch (error) {
			console.error(error.message);
		}
	}
}
