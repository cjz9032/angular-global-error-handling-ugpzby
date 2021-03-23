import { Component, Input, OnInit } from '@angular/core';
import { SubscriptionState } from 'src/app/enums/smart-performance.enum';
import { SmartPerformanceService } from 'src/app/services/smart-performance/smart-performance.service';

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
	@Input() rating = 0;

	SubscriptionState = SubscriptionState;

	lineArray: number[] = [];
	numberArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

	constructor(
		public smartPerformanceService: SmartPerformanceService,
	) { }

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
