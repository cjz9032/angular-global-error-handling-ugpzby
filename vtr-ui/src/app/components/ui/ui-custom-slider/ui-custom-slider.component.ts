import {
	Component,
	OnInit,
	Input,
	Output,
	EventEmitter,
	ElementRef,
	ViewChild,
	AfterViewInit,
	OnDestroy,
} from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';

@Component({
	selector: 'vtr-ui-custom-slider',
	templateUrl: './ui-custom-slider.component.html',
	styleUrls: ['./ui-custom-slider.component.scss'],
})
export class UiCustomSliderComponent implements OnInit, AfterViewInit, OnDestroy {
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

	@Output() sliderChange = new EventEmitter<number>();
	@Output() valueChanged = new EventEmitter<number>();

	@ViewChild('sliderBubble', { static: false }) sliderBubble: ElementRef;
	@ViewChild('rangeSlider', { static: false }) rangeSlider: ElementRef;

	private valueChangedSubject: Subject<number>;

	constructor() { }

	ngOnInit() {
		this.valueChangedSubject = new Subject();
		this.valueChangedSubject.pipe(debounceTime(500)).subscribe((value: number) => {
			this.valueChanged.emit(value);
		});
	}

	ngOnDestroy() {
		if (this.valueChangedSubject) {
			this.valueChangedSubject.unsubscribe();
		}
	}

	ngAfterViewInit() {
		if (this.sliderBubble) {
			this.setBubbleValue(this.rangeSlider.nativeElement, this.sliderBubble.nativeElement);
		}
	}

	/**
	 *  This event is fired when user changes slider value by dragging or by keyboard
	 * @param $event currently selected value
	 */
	public onInputChange($event: any) {
		const value = $event.target.valueAsNumber;
		this.value = value;
		this.sliderChange.emit(value);
		this.valueChangedSubject.next(value);
		// if (this.sliderBubble) {
		// 	this.setBubbleValue($event.target, this.sliderBubble.nativeElement);
		// }
	}

	private setBubbleValue(rangeSlider, sliderBubble) {
		// return;
		// let newPlace = 0;
		// const value = this.value;
		// const noOfChar = value.toString(10).length;
		// const bubbleOffset = (5 /* each digit width */ * noOfChar) + 18; // 3px both side margin
		// const width = (rangeSlider.offsetWidth - bubbleOffset);
		// const min = rangeSlider.min ? rangeSlider.min : 0;
		// const max = rangeSlider.max ? rangeSlider.max : 100;
		// const newPoint = Number(((value - min)) / (max - min));
		// if (newPoint <= 0) {
		// 	newPlace = 1;
		// }
		// else {
		// 	newPlace = Math.floor(width * newPoint);
		// }
		// sliderBubble.style.left = newPlace + 'px';
		// sliderBubble.innerHTML = this.value;
		// console.log({ newPlace, value, newPoint, bubbleOffset, width });
	}
}
