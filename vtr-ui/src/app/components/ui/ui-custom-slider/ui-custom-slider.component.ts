import {
	Component,
	OnInit,
	Input,
	Output,
	EventEmitter,
	ElementRef,
	ViewChild,
} from '@angular/core';
import { CommonMetricsService } from 'src/app/services/common-metrics/common-metrics.service';

@Component({
	selector: 'vtr-ui-custom-slider',
	templateUrl: './ui-custom-slider.component.html',
	styleUrls: ['./ui-custom-slider.component.scss'],
})
export class UiCustomSliderComponent implements OnInit {
	@Input() metricsItem: string;
	@Input() isDisabled = false;
	@Input() sliderId = 'rangeSlider';
	@Input() value = 1; // initial slider value
	@Input() min = 1; // slider start/minimum value
	@Input() max = 100; // slider end/maximum value
	@Input() step = 1; // ticks or steps to change on each slide
	@Input() minLegend = ''; // label to display at the start of slider
	@Input() midLegend = ''; // label to display at the center of slider
	@Input() maxLegend = ''; // label to display at the end of slider
	@Input() ariaLabel = 'slider';
	// show current value in tooltip, for example ECM current temperature value like 6500K
	@Input() showTip = false; // displays value when slider is dragged.
	@Input() tipSuffix = ''; // add
	@Input() metricsParent: string;
	@Input() isMetricsEnabled = false;

	// fires on every value change
	@Output() valueChange = new EventEmitter<number>();
	// fires when dragging is complemented
	@Output() dragEnd = new EventEmitter<number>();
	// fires when slider dragging starts
	@Output() dragStart = new EventEmitter<number>();

	@ViewChild('sliderBubble', { static: false }) sliderBubble: ElementRef;
	@ViewChild('rangeSlider', { static: false }) rangeSlider: ElementRef;

	public isTooltipHidden = true;
	public tipValue = '0';
	constructor(private metrics: CommonMetricsService) {}

	ngOnInit() {}

	/**
	 *  This event is fired when user changes slider value by dragging or by keyboard
	 *
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
		if (this.isMetricsEnabled) {
			const itemName = this.metricsItem || `${this.sliderId}`;
			this.metrics.sendMetrics(value, itemName, this.metricsParent);
		}
	}

	private setBubbleValue(rangeSlider, sliderBubble) {
		let newPlace = 0;
		const value = this.value;
		const noOfChar = value.toString(10).length;
		const suffixLength = this.tipSuffix.length;
		const bubbleOffset = 5 /* each digit width */ * (noOfChar + suffixLength) + 18; // 3px both side margin
		const width = rangeSlider.offsetWidth - bubbleOffset;
		const min = rangeSlider.min ? rangeSlider.min : 0;
		const max = rangeSlider.max ? rangeSlider.max : 100;
		const newPoint = Number((value - min) / (max - min));
		if (newPoint <= 0) {
			newPlace = 1;
		} else {
			newPlace = Math.floor(width * newPoint);
		}
		sliderBubble.style.left = newPlace + 'px';
		this.tipValue = `${this.value}${this.tipSuffix}`;
	}
	// added for narrator reading
	getLegend() {
		const val = this.min === 0 ? this.step + this.value : this.value;
		const position = val / this.step;
		let legend = this.minLegend;
		switch (position) {
			case 1:
				legend = this.minLegend;
				break;
			case 2:
				legend = this.midLegend && this.midLegend.length > 0 ? this.midLegend : legend;
				break;
			case 3:
				legend =
					this.maxLegend && this.maxLegend.length > 0 ? this.maxLegend : this.midLegend;
				break;
		}
		return legend;
	}
}
