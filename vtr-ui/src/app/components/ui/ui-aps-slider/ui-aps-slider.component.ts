import {
	Component,
	OnInit,
	Input,
	Output,
	EventEmitter,
	AfterContentChecked,
} from '@angular/core';
import {
	Options,
	ChangeContext,
	ValueToPositionFunction
} from 'ng5-slider';

@Component({
	selector: 'vtr-ui-aps-slider',
	templateUrl: './ui-aps-slider.component.html',
	styleUrls: ['./ui-aps-slider.component.scss']
})
export class UiApsSliderComponent implements OnInit, AfterContentChecked {

	public options: Options;

	@Input() enableSlider: boolean;
	@Input() apsSliderId: string;

	@Input() onHoverSliderIcon: boolean; // on hover eyecare mode

	@Input() value = 0; // initial slider value
	@Input() minValue = 0; // slider minimum end value
	@Input() maxValue = 2; // slider maximum end value
	@Input() step = 1; // ticks or steps to change on each slide
	@Input() legends: string[]; // label to display at the start of slider
	@Input() legendPositionFunction: ValueToPositionFunction; // function to handle legend position for Eye Care
	@Input() stepsArray: Array<any>; // array with legend value for Eye care
	@Input() manualRefresh = new EventEmitter<void>();

	@Output() change: EventEmitter<ChangeContext> = new EventEmitter();
	@Output() valueChange: EventEmitter<ChangeContext> = new EventEmitter();
	@Output() valueChangeEnd: EventEmitter<ChangeContext> = new EventEmitter();


	constructor() { }

	ngAfterContentChecked() {
		this.options = Object.assign({}, this.options, {
			disabled: this.enableSlider
		});
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
			step: this.step // value to change on each slide, default is 1
		};
	}

	/**
	 * This event is fired when value property is changed programmatically.
	 * Its two way binding event
	 * @param $event event data from ng5-slider component
	 */
	public onValueChange($event: ChangeContext) {
		this.valueChange.emit($event);
	}

	/**
	 *  This event is fired when user changes slider value by dragging or by keyboard
	 * @param $event event data from ng5-slider component
	 */
	public onChange($event: ChangeContext) {
        this.change.emit($event);
    }

	public onSliderChanged(event: any) {}
	public dragEnd() {
		this.valueChangeEnd.emit();
	}

}
