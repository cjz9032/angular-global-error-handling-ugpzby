import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Options, ChangeContext } from 'ng5-slider';

@Component({
	selector: 'vtr-ui-range-slider',
	templateUrl: './ui-range-slider.component.html',
	styleUrls: ['./ui-range-slider.component.scss']
})
export class UiRangeSliderComponent implements OnInit {
	// package url https://angular-slider.github.io/ng5-slider/demos

	public options: Options;

	@Input() value = 0; // initial slider value
	@Input() minValue = 0; // slider minimum end value
	@Input() maxValue = 0; // slider maximum end value
	@Input() step = 1; // ticks or steps to change on each slide

	@Output() change: EventEmitter<number> = new EventEmitter();
	@Output() valueChange: EventEmitter<number> = new EventEmitter();

	constructor() { }

	ngOnInit() {
		this.options = {
			showSelectionBar: true,
			hideLimitLabels: true,
			hidePointerLabels: true,
			floor: this.minValue, // min value
			ceil: this.maxValue, // max value
			step: this.step // value to change on each slide, default is 1
		};
	}

	/**
	 * This event is fired when value property is changed programmatically.
	 * Its two way binding event
	 * @param $event event data from ng5-slider component
	 */
	public onValueChange($event: ChangeContext) {
		this.valueChange.emit($event.value);
	}

	/**
	 *  This event is fired when user changes slider value by dragging or by keyboard
	 * @param $event event data from ng5-slider component
	 */
	public onChange($event: ChangeContext) {
		this.change.emit($event.value);
	}
}
