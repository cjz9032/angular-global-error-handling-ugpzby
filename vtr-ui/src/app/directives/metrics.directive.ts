import {Directive, ElementRef, HostListener, Input} from '@angular/core';
import {VantageShellService} from '../services/vantage-shell/vantage-shell.service';
import {ActivatedRoute} from '@angular/router';
import {VieworderService} from '../services/view-order/vieworder.service';
import {DeviceService} from '../services/device/device.service';

export interface MetricsData {
	ItemType: string;
	ItemName?: string;
	ItemParent?: string;
	ItemParm?: string;
	ItemValue?: string;
	viewOrder?: number;
	ItemID?: string;
	ItemCategory?: string;
	ItemPosition?: string;
	PageNumber?: string;
	SettingParent?: string;
	SettingName?: string;
	SettingValue?: string;
	SettingParm?: string;
}


declare var window;

@Directive({
	selector: '[vtrMetrics]'
})
export class MetricsDirective {

	private metrics: any;

	constructor(private deviceService: DeviceService,
				private el: ElementRef,
				private shellService: VantageShellService,
				private activatedRoute: ActivatedRoute,
				private viewOrderService: VieworderService) {
		this.metrics = shellService.getMetrics();

	}


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
	@Input() metricsPageNumber = '1';

	@Input() metricsSettingName: string;
	@Input() metricsSettingParm: string;
	@Input() metricsSettingValue: string;

	ComposeMetricsData() {
		const data: any = {};
		const eventName = this.metricsEvent.toLowerCase();
		switch (eventName) {
			case 'featureclick' :
			case 'itemClick': {
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
				if (typeof this.viewOrderService[this.metricsParent] === 'undefined') {

					this.viewOrderService[this.metricsParent] = 0;
				}
				data.viewOrder = (++this.viewOrderService[this.metricsParent]);
				if (this.metricsItemID) {
					data.ItemID = this.metricsItemID;
				}
				if (this.metricsItemCategory) {
					data.ItemCategory = this.metricsItemCategory;
				}
				if (this.metricsItemPosition) {
					data.ItemPosition = this.metricsItemPosition;
				}
				if (!this.metricsPageNumber) {
					data.pageNumber = '1';
				}
				if (this.metricsPageNumber) {
					data.PageNumber = this.metricsPageNumber;
				}
				break;
			}
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


		if (!this.metricsParent) {
			this.metricsParent = this.activatedRoute.snapshot.data['pageName'];
		}
		const data = this.ComposeMetricsData();

		/** to prefix the item type with btn, a ,div etc **/
			data.ItemName = this.getTagName(target) + data.ItemName;


		if (this.metrics && this.metrics.sendAsync) {
			this.metrics.sendAsync(data);
		}

		// for debug
		console.log('------reporting metrics------\n'.concat(JSON.stringify(data)));
	}


	getTagName(target) {
		const tagName = target.tagName;
		switch (tagName) {
			case 'A':
				return 'a.';
			case 'BUTTON':
				return 'btn.';
			default:
				return '';
		}
	}
}
