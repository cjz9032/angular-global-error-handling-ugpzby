import {
	Component,
	OnInit,
	Input,
	Output,
	EventEmitter,
	AfterContentChecked,
	OnDestroy
} from '@angular/core';
import { LoggerService } from 'src/app/services/logger/logger.service';

@Component({
	selector: 'vtr-ui-custom-slider',
	templateUrl: './ui-custom-slider.component.html',
	styleUrls: ['./ui-custom-slider.component.scss']
})
export class UiCustomSliderComponent
	implements OnInit, OnDestroy, AfterContentChecked {
	@Input() isDisabled = false;
	@Input() rangeSliderId = 'rangeSlider';
	@Input() value: Event | number = 0; // initial slider value
	@Input() min = 0; // slider minimum end value
	@Input() max = 10; // slider maximum end value
	@Input() step = 1; // ticks or steps to change on each slide
	@Input() minLegend = ''; // label to display at the start of slider
	@Input() midLegend = ''; // label to display at the center of slider
	@Input() maxLegend = ''; // label to display at the end of slider
	// @Input() stepsArray: Array<string> = []; // array with legend value for Eye care

	@Output() sliderChange: any = new EventEmitter();
	@Output() valueChange: any = new EventEmitter();
	@Output() valueChangeEnd: any = new EventEmitter();

	constructor(private loggerService: LoggerService) {}

	ngOnInit() {}

	ngOnDestroy() {}

	// ngOnChanges(changes: SimpleChanges): void {
	// 	if (changes.enableSlider) {
	// 		this.options = Object.assign({}, this.options, { disabled: this.enableSlider });
	// 	}
	// }
	ngAfterContentChecked() {}
	/**
	 * This event is fired when value property is changed programmatically.
	 * Its two way binding event
	 * @param $event event data from ng5-slider component
	 */
	public onValueChange($event: any) {
		this.valueChange.emit($event);
	}

	/**
	 *  This event is fired when user changes slider value by dragging or by keyboard
	 * @param $event event data from ng5-slider component
	 */
	public onChange($event: any) {
		this.sliderChange.emit($event);
	}

	public dragEnd($event: any) {
		this.valueChangeEnd.emit($event);
	}
}
