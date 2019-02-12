import { Component, OnInit } from '@angular/core';
import { Options } from 'ng5-slider';

@Component({
	selector: 'vtr-range-slider',
	templateUrl: './range-slider.component.html',
	styleUrls: ['./range-slider.component.scss']
})
export class RangeSliderComponent implements OnInit {
	// package url https://angular-slider.github.io/ng5-slider/demos
	value = 5;
	options: Options = {
		showSelectionBar: true,
		hideLimitLabels: true,
		hidePointerLabels: true
	};
	constructor() {}

	ngOnInit() {}
}
