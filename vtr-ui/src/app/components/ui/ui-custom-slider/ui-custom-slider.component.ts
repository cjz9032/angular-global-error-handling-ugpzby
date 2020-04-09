import {
	Component,
	OnInit,
	Input,
	Output,
	EventEmitter,
	ElementRef,
	ViewChild,
	AfterViewInit,
} from '@angular/core';

@Component({
	selector: 'vtr-ui-custom-slider',
	templateUrl: './ui-custom-slider.component.html',
	styleUrls: ['./ui-custom-slider.component.scss'],
})
export class UiCustomSliderComponent implements OnInit, AfterViewInit {
	@Input() isDisabled = false;
	@Input() sliderId = 'rangeSlider';
	@Input() value = 1; // initial slider value
	@Input() min = 0; // slider start/minimum value
	@Input() max = 10; // slider end/maximum value
	@Input() step = 1; // ticks or steps to change on each slide
	@Input() minLegend = ''; // label to display at the start of slider
	@Input() midLegend = ''; // label to display at the center of slider
	@Input() maxLegend = ''; // label to display at the end of slider

	@Input() metricsItem;
	@Input() metricsEvent = 'featureClick';
	@Input() metricsValue;

	@Output() sliderChange: any = new EventEmitter();
	@Output() valueChanged: any = new EventEmitter();
	@Output() refresh: any = new EventEmitter();

	@ViewChild('sliderBubble', { static: false }) sliderBubble: ElementRef;
	@ViewChild('rangeSlider', { static: false }) rangeSlider: ElementRef;

	constructor() { }

	ngOnInit() { }

	ngAfterViewInit() {
		if (this.sliderBubble) {
			this.setBubbleValue(this.rangeSlider.nativeElement, this.sliderBubble.nativeElement);
		}
	}

	/**
	 * This event is fired after mouse is released after dragging the slider or by keyboard.
	 * @param $event currently selected value
	 */
	public onValueChange($event: any) {
		this.valueChanged.emit($event.target);
	}

	/**
	 *  This event is fired when user changes slider value by dragging or by keyboard
	 * @param $event currently selected value
	 */
	public onInputChange($event: any) {
		this.value = $event.target.value;
		this.sliderChange.emit($event.target);
		if (this.sliderBubble) {
			this.setBubbleValue($event.target, this.sliderBubble.nativeElement);
		}
	}

	private setBubbleValue(rangeSlider, sliderBubble) {
		return;
		let newPlace = 0;
		const value = this.value;
		const noOfChar = value.toString(10).length;
		const bubbleOffset = (5 /* each digit width */ * noOfChar) + 18; // 3px both side margin
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
		sliderBubble.innerHTML = this.value;
		// console.log({ newPlace, value, newPoint, bubbleOffset, width });
	}
}
