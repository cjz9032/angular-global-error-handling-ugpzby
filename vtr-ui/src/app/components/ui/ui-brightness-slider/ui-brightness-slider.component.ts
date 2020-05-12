import { Component, OnInit, Input, Output, EventEmitter, AfterContentChecked } from '@angular/core';
import { Options, ChangeContext, ValueToPositionFunction, PointerType } from 'ng5-slider';

@Component({
	selector: 'vtr-ui-brightness-slider',
	templateUrl: './ui-brightness-slider.component.html',
	styleUrls: ['./ui-brightness-slider.component.scss']
})
export class UiBrightnessSliderComponent implements OnInit, AfterContentChecked {
	@Input() lightingData: any;
	public options: Options;

	@Input() enableSlider;
	@Input() lightingBrightness: any;
	@Input() ariaLabelValue = 'Brightness';
	@Input() value = 1; // initial slider value
	@Input() minValue = 1; // slider minimum end value
	@Input() maxValue = 4; // slider maximum end value
	@Input() step = 1; // ticks or steps to change on each slide
	@Input() minValueLegend = ''; // label to display at the start of slider
	@Input() maxValueLegend = ''; // label to display at the end of slider
	@Input() legendPositionFunction: ValueToPositionFunction; // function to handle legend position for Eye Care
	@Input() stepsArray: Array<any>; // array with legend value for Eye care
	@Input() manualRefresh = new EventEmitter<void>();
	@Input() metricsId = '';
	@Input() vtrMetricEnabled: any;
	@Output() onSliderChanged: EventEmitter<ChangeContext> = new EventEmitter();
	triggerFocus: EventEmitter<PointerType> = new EventEmitter<PointerType>();
	pointerType: any = PointerType;

	constructor() { }

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
			floor: Number(this.minValue), // min value
			ceil: Number(this.maxValue), // max value
			step: Number(this.step), // value to change on each slide, default is 1
			ariaLabel: this.ariaLabelValue
		};
	}

	public dragEnd($event: any) {
		this.onSliderChanged.emit($event.value);
	}

	onFocusSlider($event: any) {
		const elem = document.getElementsByClassName('brightness_slider')[0] as HTMLElement;
		if ($event.which === 9) {
			elem.setAttribute('role', '');
			elem.setAttribute('role', 'radiogroup');
		}
	}

	onMouseSlider() {
		const elem = document.getElementsByClassName('brightness_slider')[0] as HTMLElement;
		elem.setAttribute('role', '');
		elem.setAttribute('role', 'slider');
	}
}
