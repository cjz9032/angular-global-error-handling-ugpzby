import {
	Component,
	OnInit,
	Input,
	Output,
	EventEmitter,
	ElementRef,
	ViewChild,
} from '@angular/core';

@Component({
	selector: 'vtr-ui-custom-slider',
	templateUrl: './ui-custom-slider.component.html',
	styleUrls: ['./ui-custom-slider.component.scss'],
})
export class UiCustomSliderComponent implements OnInit {
	@Input() metricsItem;
	@Input() metricsEvent = 'featureClick';
	@Input() metricsValue;
	@Input() isDisabled = false;
	@Input() sliderId = 'rangeSlider';
	@Input() value = 1; // initial slider value
	@Input() min = 1; // slider start/minimum value
	@Input() max = 100; // slider end/maximum value
	@Input() step = 1; // ticks or steps to change on each slide
	@Input() minLegend = ''; // label to display at the start of slider
	@Input() midLegend = ''; // label to display at the center of slider
	@Input() maxLegend = ''; // label to display at the end of slider
	@Input() hasTicks = false;
	@Input() ticks = [1, 55, 65, 100];
	@Input() ariaLabel = 'slider';

	// fires on every value change
	@Output() valueChange = new EventEmitter<number>();
	// fires when dragging is complemented
	@Output() dragEnd = new EventEmitter<number>();
	// fires when slider dragging starts
	@Output() dragStart = new EventEmitter<number>();

	@ViewChild('sliderBubble', { static: false }) sliderBubble: ElementRef;
	@ViewChild('rangeSlider', { static: false }) rangeSlider: ElementRef;

	public ticksArray = [];
	constructor() { }

	ngOnInit() {
		if (this.hasTicks) {
			this.calculateTicks();
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
		this.valueChange.emit(value);
	}

	public onDragStart($event) {
		const value = $event.target.valueAsNumber;
		this.value = value;
		this.dragStart.emit(value);
	}

	public onDragEnd($event) {
		const value = $event.target.valueAsNumber;
		this.value = value;
		this.dragEnd.emit(value);
	}
}
