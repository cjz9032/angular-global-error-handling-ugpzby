import {
	Component,
	OnInit,
	Input,
	Output,
	EventEmitter,
	ElementRef,
	ViewChild,
	OnDestroy,
} from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';

@Component({
	selector: 'vtr-ui-custom-slider',
	templateUrl: './ui-custom-slider.component.html',
	styleUrls: ['./ui-custom-slider.component.scss'],
})
export class UiCustomSliderComponent implements OnInit, OnDestroy {
	@Input() metricsItem;
	@Input() metricsEvent = 'featureClick';
	@Input() metricsValue;
	@Input() isDisabled = false;
	@Input() sliderId = 'rangeSlider';
	@Input() value = 55; // initial slider value
	@Input() min = 1; // slider start/minimum value
	@Input() max = 100; // slider end/maximum value
	@Input() step = 1; // ticks or steps to change on each slide
	@Input() minLegend = ''; // label to display at the start of slider
	@Input() midLegend = ''; // label to display at the center of slider
	@Input() maxLegend = ''; // label to display at the end of slider
	@Input() hasTicks = false;
	@Input() ticks = [1, 55, 65, 100];

	@Output() sliderChange = new EventEmitter<number>();
	@Output() valueChanged = new EventEmitter<number>();

	@ViewChild('sliderBubble', { static: false }) sliderBubble: ElementRef;
	@ViewChild('rangeSlider', { static: false }) rangeSlider: ElementRef;

	private valueChangedSubject: Subject<number>;
	public ticksArray = [];
	constructor() { }

	ngOnInit() {
		this.valueChangedSubject = new Subject();
		this.valueChangedSubject.pipe(debounceTime(500)).subscribe((value: number) => {
			this.valueChanged.emit(value);
		});

		if (this.hasTicks) {
			this.calculateTicks();
		}
	}

	ngOnDestroy() {
		if (this.valueChangedSubject) {
			this.valueChangedSubject.unsubscribe();
		}
	}

	private calculateTicks() {
		const noOfTicks = (this.max - this.min) / this.step;
		let tickValue = this.min;
		for (let index = 0; index <= noOfTicks; index++) {
			if (index > 0) {
				tickValue += this.step;
			}
			const isVisible = this.ticks.indexOf(tickValue) >= 0;
			this.ticksArray[index] = { value: tickValue, isVisible };
		}
	}


	/**
	 *  This event is fired when user changes slider value by dragging or by keyboard
	 * @param $event currently selected value
	 */
	public onInputChange($event: any) {
		const value = $event.target.valueAsNumber;
		this.value = value;
		this.sliderChange.emit(value);
		this.valueChangedSubject.next(value);
	}
}
