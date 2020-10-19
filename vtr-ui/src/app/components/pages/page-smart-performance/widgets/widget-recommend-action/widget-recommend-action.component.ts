import { Component, OnInit } from '@angular/core';
import { LocalInfoService } from 'src/app/services/local-info/local-info.service';
import { SmartPerformanceDialogService } from 'src/app/services/smart-performance/smart-performance-dialog.service';

@Component({
	selector: 'vtr-widget-recommend-action',
	templateUrl: './widget-recommend-action.component.html',
	styleUrls: ['./widget-recommend-action.component.scss']
})
export class WidgetRecommendActionComponent implements OnInit {

	isShowPrice = false;
	allHidePriceGEO = [
		'gb', // United Kingdom
		'ie', // Ireland
		'au', // Australia
		'nz', // New Zealand
		'sg', // Singapore
		'in', // INDIA
		'my', // Malaysia
		'hk', // Hong Kong
		'tw', // Taiwan
		'kr', // South Korea
		'jp', // Japan
		'th', // Thailand
	];

	constructor(
		private localInfoService: LocalInfoService,
		private smartPerformanceDialogService: SmartPerformanceDialogService,
	) { }

	ngOnInit(): void {
		this.localInfoService.getLocalInfo().then(localInfo => {
			if (!this.allHidePriceGEO.includes(localInfo.GEO)) {
				this.isShowPrice = true;
			}
		});
	}

	openSubscribeModal() {
		this.smartPerformanceDialogService.openSubscribeModal();
	}

}
