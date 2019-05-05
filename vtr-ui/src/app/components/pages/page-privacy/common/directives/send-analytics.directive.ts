import { Directive, ElementRef, HostListener, Input, OnInit, OnDestroy } from '@angular/core';
import { GetParentForAnalyticsService } from '../services/get-parent-for-analytics.service';
import { AnalyticsService } from '../services/analytics.service';

@Directive({
	selector: '[vtrSendAnalytics]'
})
export class SendAnalyticsDirective implements OnInit, OnDestroy {
	myCurrentElement = this.el.nativeElement;

	@Input() metricsEvent: string; // ItemType
	@Input() metricsItem: string; // ItemName
	@Input() metricsValue: string; // ItemValue
	@Input() metricsParam: string | object; // ItemParm
	@Input() pageContext: string; // PageContext

	pageDuration: number;

	private pageInitTime: number;
	private pageDestroyTime: number;

	constructor(
		private el: ElementRef,
		private getParentForAnalyticsService: GetParentForAnalyticsService,
		private analyticsService: AnalyticsService,
	) {
	}

	@HostListener('click', ['$event']) onClick() {
		const ItemParent = this.getParentForAnalyticsService.getParentName(this.myCurrentElement);

		const dataToSendOnItemClick = {
			ItemName: this.metricsItem,
			ItemParm: this.metricsParam,
			ItemParent,
			ItemValue: this.metricsValue,
		};

		this.analyticsService.sendItemClickData(dataToSendOnItemClick);
	}

	ngOnInit() {
		if (this.metricsEvent === 'PageView') {
			this.pageInitTime = +Date.now();
		}
	}

	ngOnDestroy() {
		this.pageDestroyTime = +Date.now();
		this.pageDuration = this.pageDestroyTime - this.pageInitTime;

		const dataToSendOnPageView = {
			PageContext: this.pageContext,
			PageDuration: this.pageDuration,
		};

		this.analyticsService.sendPageViewData(dataToSendOnPageView);
	}
}
