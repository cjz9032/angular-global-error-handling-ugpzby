import {Directive, ElementRef, HostListener, Input} from '@angular/core';
import {VantageShellService} from '../services/vantage-shell/vantage-shell.service';
import {ActivatedRoute} from "@angular/router";


declare var window;

@Directive({
	selector: '[vtrMetrics]'
})
export class MetricsDirective {
	constructor(private el: ElementRef, private shellService: VantageShellService,private activatedRoute:ActivatedRoute) {
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


	@HostListener('click', ['$event.target'])
	onclick(target) {

		this.metricsItem = typeof this.metricsItem === 'string' ? this.metricsItem.split(" ").join("").toLowerCase().replace(/[`~!@#$%^&*()_|+\-=?;:'",<>\{\}\[\]\\\/]/gi, '').substr(0, 25) : this.metricsItem;
		this.metricsEvent = typeof this.metricsEvent === 'string' ? this.metricsEvent.split(" ").join("").toLowerCase() : this.metricsEvent;
		this.metricsValue = typeof this.metricsValue === 'string' ? this.metricsValue.split(" ").join("").toLowerCase() : this.metricsValue;
		if(!this.metricsParent){
			this.metricsParent = this.activatedRoute.snapshot.data['pageName'];
		}
		this.metricsParam = typeof this.metricsParam === 'string' ? this.metricsParam.split(" ").join("").toLowerCase() : this.metricsParam;
		if (this.metrics && this.metrics.sendAsync) {
			const data: any = {
				ItemName: this.metricsItem,
				ItemType: this.metricsEvent,
				ItemParent:this.metricsParent,
			};
			if (this.metricsParam) {
				data.ItemParam = this.metricsParam;
			}

			if (typeof this.metricsValue !== 'undefined') {
				data.metricsValue = this.metricsValue;
			}
			if (this.metricsItemID) {
				data.ItemID = this.metricsItemID;
			}
			if (this.metricsItemCategory) {
				data.ItemCategory = this.metricsItemCategory;
			}
			if (this.metricsItemPosition) {
				data.ItemPosition = this.metricsItemPosition;
			}
			if (this.metricsViewOrder) {
				data.ViewOrder = this.metricsViewOrder;
			}
			if (this.metricsPageNumber) {
				data.PageNumber = this.metricsPageNumber;
			}
			this.metrics.sendAsync(data);
		}

		// just for debugging, would be removed in the future
		{
			const data: any = {
				ItemName: this.metricsItem,
				ItemType: this.metricsEvent,
				ItemParent:this.metricsParent,
			};
			if (this.metricsParam) {
				data.ItemParam = this.metricsParam;
			}
			if (typeof this.metricsValue !== 'undefined') {
				data.metricsValue = this.metricsValue;
			}
			if (this.metricsItemID) {
				data.ItemID = this.metricsItemID;
			}
			if (this.metricsItemCategory) {
				data.ItemCategory = this.metricsItemCategory;
			}
			if (this.metricsItemPosition) {
				data.ItemPosition = this.metricsItemPosition;
			}
			if (this.metricsViewOrder) {
				data.ViewOrder = this.metricsViewOrder;
			}
			if (this.metricsPageNumber) {
				data.PageNumber = this.metricsPageNumber;
			}

			console.log('Sending the metrics [ItemType : ' + this.metricsEvent + ']\n' + JSON.stringify(data));
		}
	}


}
