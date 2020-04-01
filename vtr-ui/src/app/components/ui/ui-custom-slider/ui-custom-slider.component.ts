import {
	Component,
	OnInit,
	Input,
	Output,
	EventEmitter,
} from '@angular/core';

@Component({
	selector: 'vtr-ui-custom-slider',
	templateUrl: './ui-custom-slider.component.html',
	styleUrls: ['./ui-custom-slider.component.scss']
})
export class UiCustomSliderComponent implements OnInit {
	@Input() isDisabled = false;
	@Input() sliderId = 'rangeSlider';
	@Input() value = 0; // initial slider value
	@Input() min = 0; // slider minimum end value
	@Input() max = 10; // slider maximum end value
	@Input() step = 1; // ticks or steps to change on each slide
	@Input() minLegend = ''; // label to display at the start of slider
	@Input() midLegend = ''; // label to display at the center of slider
	@Input() maxLegend = ''; // label to display at the end of slider

	@Output() sliderChange: any = new EventEmitter();
	@Output() valueChanged: any = new EventEmitter();

	constructor() { }

	ngOnInit() { }

	/**
	 * This event is fired after mouse is released after dragging the slider or by keyboard.
	 * @param value currently selected value
	 */
	public onValueChange(value: number) {
		this.valueChanged.emit(value);
	}

	/**
	 *  This event is fired when user changes slider value by dragging or by keyboard
	 * @param value currently selected value
	 */
	public onInputChange(value: number) {
		this.sliderChange.emit(value);
	}
}
