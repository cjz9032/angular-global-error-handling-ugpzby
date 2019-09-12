import { Component, OnInit, Input, Output, EventEmitter, AfterContentChecked } from '@angular/core';
import { Options, ChangeContext, ValueToPositionFunction, PointerType } from 'ng5-slider';

@Component({
	selector: 'vtr-ui-brightness-slider',
	templateUrl: './ui-brightness-slider.component.html',
	styleUrls: [ './ui-brightness-slider.component.scss' ]
})
export class UiBrightnessSliderComponent implements OnInit, AfterContentChecked {
	@Input() lightingData: any;
	public options: Options;

	@Input() enableSlider;
	@Input() lightingBrightness: any;

	@Input() value = 1; // initial slider value
	@Input() minValue = 1; // slider minimum end value
	@Input() maxValue = 4; // slider maximum end value
	@Input() step = 1; // ticks or steps to change on each slide
	@Input() minValueLegend = ''; // label to display at the start of slider
	@Input() maxValueLegend = ''; // label to display at the end of slider
	@Input() legendPositionFunction: ValueToPositionFunction; // function to handle legend position for Eye Care
	@Input() stepsArray: Array<any>; // array with legend value for Eye care
	@Input() manualRefresh = new EventEmitter<void>();
	@Output() change: EventEmitter<ChangeContext> = new EventEmitter();
	@Output() setLightingBrightness: EventEmitter<ChangeContext> = new EventEmitter();
	triggerFocus: EventEmitter<PointerType> = new EventEmitter<PointerType>();
	pointerType: any = PointerType;

	constructor() {}

	ngAfterContentChecked() {
		this.options = Object.assign({}, this.options, { disabled: this.enableSlider });
	}

	ngOnInit() {
		this.options = {
			showSelectionBar: true,
			disabled: this.enableSlider,
			hideLimitLabels: true,
			hidePointerLabels: true,
			showTicks: this.stepsArray && this.stepsArray.length > 0,
			customValueToPosition: this.legendPositionFunction,
			stepsArray: this.stepsArray,
			floor: this.minValue, // min value
			ceil: this.maxValue, // max value
			step: this.step, // value to change on each slide, default is 1
			ariaLabel: 'Brightness'
		};
	}

	/**
	 * This event is fired when value property is changed programmatically.
	 * Its two way binding event
	 * @param $event event data from ng5-slider component
	 */
	public onValueChange($event: ChangeContext) {
		this.setLightingBrightness.emit($event);
		setTimeout(() => {
			let element: HTMLElement = document.getElementById('sliderDetailsEle') as HTMLElement;
			element.focus();
			this.triggerFocus.emit(PointerType.Min);
		}, 500);
	}

	/**
	 *  This event is fired when user changes slider value by dragging or by keyboard
	 * @param $event event data from ng5-slider component
	 */
	public onChange($event: ChangeContext) {
		this.change.emit($event);
		setTimeout(() => {
			let element: HTMLElement = document.getElementById('sliderDetailsEle') as HTMLElement;
			element.focus();
			this.triggerFocus.emit(PointerType.Min);
		}, 500);
	}

	public onSliderChanged(event: any) {}
}
