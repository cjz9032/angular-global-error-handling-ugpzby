import { Directive, ElementRef, HostListener, Input, OnInit, OnDestroy } from '@angular/core';
import { GetParentForAnalyticsService } from '../services/get-parent-for-analytics.service';
import { AnalyticsService, ItemTypes } from '../services/analytics.service';

@Directive({
	selector: '[vtrSendAnalytics]'
})
export class SendAnalyticsDirective implements OnInit, OnDestroy {
	myCurrentElement = this.el.nativeElement;

	@Input() metricsEvent: string; // ItemType
	@Input() metricsItem: string; // ItemName
	@Input() metricsValue?: string; // ItemValue
	@Input() metricsParam?: string | object; // ItemParm
	@Input() pageContext?: string; // PageContext
	@Input() metricsParent?: string; // ItemParent

	pageDuration: number;

	private pageInitTime: number;
	private pageDestroyTime: number;

	constructor(
		private el: ElementRef,
		private getParentForAnalyticsService: GetParentForAnalyticsService,
		private analyticsService: AnalyticsService,
	) {
	}

	@HostListener('click', ['$event']) onClick($event) {
		if (this.metricsEvent !== ItemTypes.ItemClick) {
			return;
		}

		const ItemParent = this.getParentForAnalyticsService.getParentName(this.myCurrentElement);

		const dataToSendOnItemClick = {
			ItemName: this.metricsItem,
			ItemParm: this.metricsParam,
			ItemParent: this.metricsParent || ItemParent,
			ItemValue: this.metricsValue,
		};

		this.analyticsService.sendItemClickData(dataToSendOnItemClick);
	}

	ngOnInit() {
		if (this.metricsEvent === ItemTypes.PageView) {
			this.pageInitTime = +Date.now();
		}
	}

	ngOnDestroy() {
		if (this.metricsEvent === ItemTypes.PageView) {
			this.pageDestroyTime = +Date.now();
			this.pageDuration = (this.pageDestroyTime - this.pageInitTime) / 1000;

			const dataToSendOnPageView = {
				PageContext: this.pageContext,
				PageDuration: this.pageDuration,
			};

			this.analyticsService.sendPageViewData(dataToSendOnPageView);
		}
	}
}
