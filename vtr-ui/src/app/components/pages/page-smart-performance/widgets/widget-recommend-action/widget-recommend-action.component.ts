import { Component, OnInit } from '@angular/core';
import { SmartPerformanceDialogService } from 'src/app/services/smart-performance/smart-performance-dialog.service';
import { SmartPerformanceService } from 'src/app/services/smart-performance/smart-performance.service';

@Component({
	selector: 'vtr-widget-recommend-action',
	templateUrl: './widget-recommend-action.component.html',
	styleUrls: ['./widget-recommend-action.component.scss']
})
export class WidgetRecommendActionComponent implements OnInit {

	isShowPrice = false;
	monthlyPrice: any;
	yearlyPrice: any;

	constructor(
		private smartPerformanceDialogService: SmartPerformanceDialogService,
		private spService: SmartPerformanceService,
	) { }

	ngOnInit(): void {
		this.spService.getLocalePrice().then((priceData) => {
			if (priceData) {
				this.yearlyPrice = priceData.formatPrice;
				const mp = Math.ceil(priceData.price * 100 / 12) / 100;
				if (isNaN(this.yearlyPrice.substr(0, 1))) {
					this.monthlyPrice = priceData.symbol + mp;
				}
				else {
					this.monthlyPrice = mp + priceData.symbol;
				}
				this.isShowPrice = true;
			}
			else {
				this.isShowPrice = false;
			}
		});
	}

	openSubscribeModal() {
		this.smartPerformanceDialogService.openSubscribeModal();
	}

}
