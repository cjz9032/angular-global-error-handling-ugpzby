import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	EventEmitter,
	Input,
	NgZone,
	OnDestroy,
	OnInit,
	Output
} from '@angular/core';
import { OneClickScanSteps, Permit } from '../services/one-click-scan-steps.service';
import { interval, merge, Subject, timer } from 'rxjs';
import { animationFrame } from 'rxjs/internal/scheduler/animationFrame';
import { distinctUntilChanged, filter, map, takeUntil } from 'rxjs/operators';
import { instanceDestroyed } from '../../../utils/custom-rxjs-operators/instance-destroyed';

const DURATION_FOR_ONE_SLIDE_MS = 2000;
const NUMBER_OF_STEPS = 100;
@Component({
	selector: 'vtr-scanning',
	templateUrl: './scanning.component.html',
	styleUrls: ['./scanning.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScanningComponent implements OnInit, OnDestroy, Permit {
	@Input() scanSteps: OneClickScanSteps[] = [];
	@Output() allow = new EventEmitter<boolean>();
	readonly oneClickScanSteps = OneClickScanSteps;
	currentSlide: OneClickScanSteps;
	sliderForShow;

	private progressTime = new Subject<number>();
	progressTime$ = this.progressTime.asObservable();

	constructor(
		private changeDetectorRef: ChangeDetectorRef,
		private zone: NgZone
	) {}

	ngOnInit() {
		this.sliderForShow = this.makeSliderForShow();
		this.sliderForShow();

		this.startCalculateProgressTime(this.calculateProgressTime(this.scanSteps));

		this.progressTime$.pipe(
			takeUntil(instanceDestroyed(this)),
			filter((val) => val > NUMBER_OF_STEPS - 1),
		).subscribe(() => this.allowEmitter());

		this.progressTime$.pipe(
			takeUntil(instanceDestroyed(this)),
			map((val) => Math.round(val)),
			distinctUntilChanged(),
			filter((val) => val > 1),
			filter((val) => (Math.round(val) % (NUMBER_OF_STEPS / this.scanSteps.length)) === 0 ),
		).subscribe(() => {
			this.sliderForShow();
		});
	}

	ngOnDestroy() {}

	allowEmitter() {
		this.allow.emit(true);
	}

	disallowEmitter() {
		this.allow.emit(false);
	}

	private startCalculateProgressTime(durationProgressTime) {
		try {
			const oldTime = window.performance.now();

			this.zone.runOutsideAngular(() => {
				interval(0, animationFrame).pipe(
					takeUntil(
						merge(
							timer(durationProgressTime),
							instanceDestroyed(this)
						)
					),
					map(() => {
						const newTime = window.performance.now();
						const diff = Math.round(newTime - oldTime);
						const val = (diff / durationProgressTime * NUMBER_OF_STEPS);
						return val > NUMBER_OF_STEPS ? NUMBER_OF_STEPS : val;
					}),
					distinctUntilChanged()
				).subscribe((val) => {
					this.progressTime.next(val);
					this.changeDetectorRef.detectChanges();
				});
			});
		} catch (error) {}
	}

	private calculateProgressTime(scanSteps: OneClickScanSteps[]): number {
		return scanSteps.length * DURATION_FOR_ONE_SLIDE_MS;
	}

	private makeSliderForShow() {
		const slidesForShow = [...this.scanSteps];

		return () => {
			const nextSlide = slidesForShow.shift();
			this.currentSlide = nextSlide ? nextSlide : this.currentSlide;
		};
	}
}
