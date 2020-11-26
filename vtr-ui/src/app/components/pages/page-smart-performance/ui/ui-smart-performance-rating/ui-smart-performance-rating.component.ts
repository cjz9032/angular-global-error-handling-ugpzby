import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'vtr-ui-smart-performance-rating',
	templateUrl: './ui-smart-performance-rating.component.html',
	styleUrls: ['./ui-smart-performance-rating.component.scss'],
})
export class UiSmartPerformanceRatingComponent implements OnInit {
	@Input() isLight = false;
	@Input() hidePointer = false;
	@Input() hideStatus = false;
	@Input() leftAnimator = '0%';

	lineArray: number[] = [];
	numberArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

	constructor() {}

	ngOnInit(): void {
		this.initLines();
	}

	initLines() {
		this.lineArray = [];
		for (let i = 0; i < 110; i++) {
			this.lineArray.push(i);
		}
	}
}
