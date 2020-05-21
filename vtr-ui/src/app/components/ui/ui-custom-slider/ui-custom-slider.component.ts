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
	// @Input() hasTicks = false;
	// @Input() ticks = [3500, 5500, 6000];
	@Input() ariaLabel = 'slider';
	// show current value in tooltip, for example ECM current temperature value like 6500K
	@Input() showTip = false; // displays value when slider is dragged.
	@Input() tipSuffix = ''; // add

	// fires on every value change
	@Output() valueChange = new EventEmitter<number>();
	// fires when dragging is complemented
	@Output() dragEnd = new EventEmitter<number>();
	// fires when slider dragging starts
	@Output() dragStart = new EventEmitter<number>();

	@ViewChild('sliderBubble', { static: false }) sliderBubble: ElementRef;
	@ViewChild('rangeSlider', { static: false }) rangeSlider: ElementRef;

	// public ticksArray = [];
	public isTooltipHidden = true;
	public tipValue = '0';
	constructor() { }

	ngOnInit() {
		// if (this.hasTicks) {
		// 	this.calculateTicks();
		// }
	}

	// ngAfterViewInit() {
	// if (this.sliderBubble) {
	// 	this.setBubbleValue(this.rangeSlider.nativeElement, this.sliderBubble.nativeElement);
	// }
	// }

	// private calculateTicks() {
	// 	const noOfTicks = (this.max - this.min) / this.step;
	// 	let tickValue = this.min;
	// 	for (let index = 0; index <= noOfTicks; index++) {
	// 		if (index > 0) {
	// 			tickValue += this.step;
	// 		}
	// 		const isVisible = this.ticks.indexOf(tickValue) >= 0;
	// 		this.ticksArray[index] = { value: tickValue, isVisible };
	// 	}
	// }

	/**
	 *  This event is fired when user changes slider value by dragging or by keyboard
	 * @param $event currently selected value
	 */
	public onInputChange($event: any) {
		const value = $event.target.valueAsNumber;
		this.value = value;
		this.valueChange.emit(value);

		if (this.sliderBubble && this.showTip) {
			this.setBubbleValue($event.target, this.sliderBubble.nativeElement);
		}
	}

	public onDragStart($event) {
		const value = $event.target.valueAsNumber;
		this.value = value;
		this.dragStart.emit(value);

		if (this.sliderBubble && this.showTip) {
			this.isTooltipHidden = false;
			this.setBubbleValue($event.target, this.sliderBubble.nativeElement);
		}
	}

	public onDragEnd($event) {
		this.isTooltipHidden = true;
		const value = $event.target.valueAsNumber;
		this.value = value;
		this.dragEnd.emit(value);
	}

	private setBubbleValue(rangeSlider, sliderBubble) {
		// return;
		let newPlace = 0;
		const value = this.value;
		const noOfChar = value.toString(10).length;
		const suffixLength = this.tipSuffix.length;
		const bubbleOffset = (5 /* each digit width */ * (noOfChar + suffixLength)) + 18; // 3px both side margin
		const width = (rangeSlider.offsetWidth - bubbleOffset);
		const min = rangeSlider.min ? rangeSlider.min : 0;
		const max = rangeSlider.max ? rangeSlider.max : 100;
		const newPoint = Number(((value - min)) / (max - min));
		if (newPoint <= 0) {
			newPlace = 1;
		}
		else {
			newPlace = Math.floor(width * newPoint);
		}
		sliderBubble.style.left = newPlace + 'px';
		this.tipValue = `${this.value}${this.tipSuffix}`;
		// sliderBubble.innerHTML = `${this.value}${this.tipSuffix}`;
		// console.log({ newPlace, value, newPoint, bubbleOffset, width });
	}
	// added for narrator reading
	getLegend() {
		// let position= this.min===0 && this.step
		const val = (this.min === 0 ? this.step + this.value : this.value);
		const position = val / this.step;
		let legend = this.minLegend;
		switch (position) {
			case 1: legend = this.minLegend
				break;
			case 2: legend = this.midLegend?.length > 0 ? this.midLegend : legend;
				break;
			case 3: legend = this.maxLegend?.length > 0 ? this.maxLegend : this.midLegend;
				break;
		}
		return legend;
	}
}
