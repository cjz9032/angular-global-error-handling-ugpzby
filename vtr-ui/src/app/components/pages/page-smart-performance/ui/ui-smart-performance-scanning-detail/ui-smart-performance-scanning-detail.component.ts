import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { cloneDeep } from 'lodash';
import { SmartPerformanceService } from 'src/app/services/smart-performance/smart-performance.service';

@Component({
	selector: 'vtr-ui-smart-performance-scanning-detail',
	templateUrl: './ui-smart-performance-scanning-detail.component.html',
	styleUrls: ['./ui-smart-performance-scanning-detail.component.scss']
})
export class UiSmartPerformanceScanningDetailComponent implements OnInit, OnChanges {

	itemSliderCount = 0;
	itemSliderInterval: any;
	@Input() items: { key: string, isCurrent: boolean }[] = [];
	detailItems: { key: string, isCurrent: boolean }[] = [];


	constructor(
		public smartPerformanceService: SmartPerformanceService,
	) { }

	ngOnInit() {
		this.setDetailItems();
	}

	ngOnChanges(changes: any) {
		if (changes.items) {
			this.setDetailItems();
		}
	}

	setDetailItems() {
		if (this.items[this.items.length - 1]?.key !== this.detailItems[this.detailItems.length - 1]?.key ) {
			clearInterval(this.itemSliderInterval);
			this.itemSliderCount = 1;
			this.detailItems = cloneDeep(this.items);
			this.scrollItems();
		}
	}

	scrollItems() {
		this.itemSliderInterval = setTimeout(() => {
			this.detailItems.splice(0, 1);
			this.detailItems[0].isCurrent = true;
			this.itemSliderCount++;
			if (this.detailItems.length <= 1) {
				clearTimeout(this.itemSliderInterval);
			} else {
				this.scrollItems();
			}
		}, 2500 * this.itemSliderCount + 1000);
	}

}
