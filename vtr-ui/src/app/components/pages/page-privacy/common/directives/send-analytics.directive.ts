import { Directive, ElementRef, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { GetParentForAnalyticsService } from '../services/get-parent-for-analytics.service';
import { AnalyticsService, ItemTypes } from '../services/analytics/analytics.service';

@Directive({
	selector: '[vtrSendAnalytics]'
})
export class SendAnalyticsDirective implements OnInit, OnDestroy {
	private viewEvents = [ItemTypes.PageView, ItemTypes.ArticleView];
	myCurrentElement = this.el.nativeElement;

	@Input() metricsEvent: string; // ItemType
	@Input() metricsItem: string; // ItemName
	@Input() metricsValue?: string; // ItemValue
	@Input() metricsParam?: object; // ItemParm
	@Input() pageContext?: string; // PageContext
	@Input() metricsParent?: string; // ItemParent
	@Input() customPageName?: string;

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
		if (this.metricsEvent !== ItemTypes.ItemClick && this.metricsEvent !== ItemTypes.ArticleClick) {
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
		if (this.viewEvents.includes(this.metricsEvent as ItemTypes)) {
			this.pageInitTime = +Date.now();
		}
	}

	ngOnDestroy() {
		if (this.viewEvents.includes(this.metricsEvent as ItemTypes)) {
			this.pageDestroyTime = +Date.now();
			this.pageDuration = Math.round((this.pageDestroyTime - this.pageInitTime) / 1000);

			const dataToSendOnPageView = {
				PageContext: this.pageContext,
				PageDuration: this.pageDuration,
			};

			this.analyticsService.sendPageViewData(dataToSendOnPageView, this.customPageName, this.metricsEvent);
		}
	}
}
