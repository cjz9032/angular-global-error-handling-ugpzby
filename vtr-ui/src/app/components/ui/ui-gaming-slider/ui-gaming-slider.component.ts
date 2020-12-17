import { Component, OnInit, Input, ElementRef, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'vtr-ui-gaming-slider',
	templateUrl: './ui-gaming-slider.component.html',
	styleUrls: ['./ui-gaming-slider.component.scss'],
})
export class UiGamingSliderComponent implements OnInit {
	@Input() minValue: number;
	@Input() maxValue: number;
	@Input() step: number;
	@Input() currentVal: number;
	@Input() automationId: string;
	@Input() metricsId = '';
	@Input() ariaLabelValue: any;
	@Input() vtrMetricEnabled: any;
	@Output() onSliderChanged = new EventEmitter();

	constructor(private el: ElementRef) {}

	ngOnInit() {}
	public userChange($event: any) {
		this.onSliderChanged.emit(Number($event.target.value));
	}
}
