import {Directive, ElementRef, HostListener, Input} from '@angular/core';
import {VantageShellService} from '../services/vantage-shell/vantage-shell.service';
import {ActivatedRoute} from "@angular/router";
import {VieworderService} from "../services/view-order/vieworder.service";


declare var window;

@Directive({
	selector: '[vtrMetrics]'
})
export class MetricsDirective {

	constructor(private el: ElementRef, private shellService: VantageShellService,private activatedRoute:ActivatedRoute,private viewOrderService:VieworderService) {
		this.metrics = shellService.getMetrics();
	}

	private metrics: any;

	@Input() metricsItem: string;
	@Input() metricsEvent: string;
	@Input() metricsValue: string;
	@Input() metricsParent: string;
	@Input() metricsParam: string;

	// DocClick used
	@Input() metricsItemID: string;
	@Input() metricsItemCategory: string;
	@Input() metricsItemPosition: string;
	@Input() metricsViewOrder: string;
	@Input() metricsPageNumber: string;

	@Input() metricsSettingName: string;
	@Input() metricsSettingParm: string;
	@Input() metricsSettingValue: string;

	ComposeMetricsData() {
		const data: any = {
		};
		const eventName = this.metricsEvent.toLowerCase();
		switch (eventName) {
			case 'featureclick':
			case 'itemclick': {
				data.ItemType = 'FeatureClick';
				data.ItemName = this.metricsItem;
				data.ItemParent = this.metricsParent;
				if (this.metricsParam) {
					data.ItemParm = this.metricsParam;
				}
				if (typeof this.metricsValue !== 'undefined') {
					data.ItemValue = this.metricsValue;
				}
			}
			break;
			case 'articleclick':
			case 'docclick': {
				data.ItemType = 'ArticleClick';
				data.ItemParent = this.metricsParent;
				if(typeof this.viewOrderService[this.metricsParent]==='undefined'){

					this.viewOrderService[this.metricsParent]=0;
				}
				data.viewOrder=(++this.viewOrderService[this.metricsParent]);
				if (this.metricsItemID) {
					data.ItemID = this.metricsItemID;
				}
				if (this.metricsItemCategory) {
					data.ItemCategory = this.metricsItemCategory;
				}
				if (this.metricsItemPosition) {
					data.ItemPosition = this.metricsItemPosition;
				}
				if (this.metricsPageNumber) {
					data.PageNumber = this.metricsPageNumber;
				}
			}
			break;
			case 'settingupdate': {
				data.ItemType = 'SettingUpdate';
				data.SettingParent = this.metricsParent;
				data.SettingName = this.metricsSettingName;
				data.SettingValue = this.metricsSettingValue;
				if (this.metricsSettingParm) {
					data.SettingParm = this.metricsSettingParm;
				}
			}
		}
		return data;
	}

	@HostListener('click', ['$event.target'])
	onclick(target) {
		if(!this.metricsParent){
			this.metricsParent = this.activatedRoute.snapshot.data['pageName'];
		}
		const data = this.ComposeMetricsData();
		if (this.metrics && this.metrics.sendAsync) {
			this.metrics.sendAsync(data);
		}
	}


}
