import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { VantageShellService } from '../services/vantage-shell/vantage-shell.service';


declare var window;
@Directive({
	selector: '[vtrMetrics]'
})
export class MetricsDirective {
	constructor(private el: ElementRef, private shellService: VantageShellService) {
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

	@HostListener('click') onclick() {
		const location = window.location.href.substring(window.location.href.indexOf('#') + 2).split('/').join('.');
		console.log('++++++++++++', location);

		if (this.metrics && this.metrics.sendAsync) {
			const data: any = {
				ItemName: this.metricsItem,
				ItemType: this.metricsEvent,
				ItemParent: location ? location + '.' + this.metricsParent : this.metricsParent,
			};
			if (this.metricsParam) {
				data.ItemParam = this.metricsParam;
			}
			if (this.metricsValue) {
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
				ItemParent: location ? location + '.' + this.metricsParent : this.metricsParent,
			};
			if (this.metricsParam) {
				data.ItemParam = this.metricsParam;
			}
			if (this.metricsValue) {
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
