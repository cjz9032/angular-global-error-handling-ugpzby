import { Directive, HostListener, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MetricConst, MetricEventName as EventName } from 'src/app/enums/metrics.enum';
import { MetricHelper } from 'src/app/services/metric/metrics.helper';
import { metricsMap } from 'src/app/services/metric/metrics.map';
import * as MetricEvents from 'src/app/services/metric/metrics.model';
import { DevService } from '../dev/dev.service';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { VieworderService } from '../view-order/vieworder.service';

/**
 * Hi all, this is a core file of metric implementation, before you change
 * this file, please estimate if your change affects the other component. And
 * it is better to let know or create a code review to me. I can help to review
 * yor change.
 * Mark Tao (taoxf1@lenovo.com)
 */
@Directive({
	selector: '[vtrMetrics]',
})
export class MetricsDirective {
	private metrics: any;

	constructor(
		shellService: VantageShellService,
		private activatedRoute: ActivatedRoute,
		private viewOrderService: VieworderService,
		private devService: DevService
	) {
		this.metrics = shellService.getMetrics();
	}

	@Input('vtrMetrics') composedItem: any;
	@Input() metricsItem: string;
	@Input() metricsEvent: string;
	@Input() metricsValue: any;
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

	getItemParent() {
		try {
			return (
				this.metricsParent ||
				this.activatedRoute.snapshot.data.pageName ||
				MetricConst.Unknown
			);
		} catch (e) {
			return MetricConst.Unknown;
		}
	}
	composeFeatureClickEvent(): MetricEvents.FeatureClick {
		return {
			ItemType: EventName.featureclick,
			ItemName: this.metricsItem,
			ItemParent: this.getItemParent(),
			ItemValue: this.metricsValue,
			ItemParm: this.metricsParam,
		};
	}
	composeArticleClickEvent(): MetricEvents.ArticleClick {
		if (this.viewOrderService[this.getItemParent()] === undefined) {
			this.viewOrderService[this.getItemParent()] = 0;
		}

		return {
			ItemType: EventName.articleclick,
			ItemName: this.metricsItem,
			ItemParent: this.getItemParent(),
			ItemParm: this.metricsParam,
			viewOrder: ++this.viewOrderService[this.getItemParent()],
			ItemID: this.metricsItemID,
			ItemCategory: this.metricsItemCategory,
			ItemPosition: this.metricsItemPosition,
			PageNumber: this.metricsPageNumber || 1,
		};
	}
	composeSettingUpdateEvent(): MetricEvents.SettingUpdate {
		return {
			ItemType: EventName.settingupdate,
			SettingParent: this.getItemParent(),
			SettingName: this.metricsSettingName,
			SettingValue: this.metricsSettingValue,
			SettingParm: this.metricsSettingParm,
		};
	}
	composeUnknownEvent(): any {
		return {
			ItemType: EventName.unknown,
			ItemName: this.metricsItem,
			ItemParent: this.getItemParent(),
			ItemValue: this.metricsValue,
			ItemParm: this.metricsParam,
			ItemID: this.metricsItemID,
			ItemCategory: this.metricsItemCategory,
			ItemPosition: this.metricsItemPosition,
			SettingName: this.metricsSettingName,
			SettingValue: this.metricsSettingValue,
			SettingParm: this.metricsSettingParm,
		};
	}
	composeMetricsEvent() {
		let data: any;
		const eventName = MetricHelper.normalizeEventName(this.metricsEvent);
		switch (eventName) {
			case EventName.featureclick: {
				data = this.composeFeatureClickEvent();
				break;
			}
			case EventName.articleclick: {
				data = this.composeArticleClickEvent();
				break;
			}
			case EventName.settingupdate: {
				data = this.composeSettingUpdateEvent();
				break;
			}
			default:
				data = this.composeUnknownEvent();
				break;
		}
		return data;
	}
	// (1)the this.composedItem could be null/undefined (2)string (3)IMetricEvent or (4) other type or wrap by a promise
	async parseComposedEvent() {
		let data: any;
		// composedItem could be a promise, the promise should return a metric id or a metric payload
		if (this.composedItem instanceof Promise) {
			data = await this.composedItem;
		} else {
			data = this.composedItem;
		}

		// composedItem could be a metric id, we would get the metric from the metric map
		if (typeof data === 'string') {
			const srcData = metricsMap[data];
			if (srcData) {
				data = { ...srcData }; // copy the object value in case of the data source in the map was tampered
			}
		}

		// if data is null/undefined or
		if (!data || !data.ItemType) {
			data = { ItemType: EventName.unknown, content: data };
		}

		// Normalize the item type
		data.ItemType = MetricHelper.normalizeEventName(data.ItemType);

		// automatically fill the item parent
		const tmpData: any = data;
		if (!data.SettingParent) {
			if (tmpData.ItemType === EventName.settingupdate) {
				tmpData.SettingParent = this.getItemParent();
			} else if (
				[EventName.featureclick, EventName.articleclick].indexOf(tmpData.ItemType) !== -1
			) {
				tmpData.ItemParent = this.getItemParent();
			}
		}

		return data;
	}

	private async metricReady() {
		return this.metrics.initializationResolved || this.metrics.initPromise;
	}

	@HostListener('click', ['$event'])
	async onclick(event) {
		if (!this.metrics || this.composedItem === false) {
			return;
		}

		await this.metricReady();
		if (!this.metrics.metricsEnabled) {
			return;
		}

		// prevent default event propogation for more than 1 click stop event propagation
		if (event.detail > 1 && this.metricsItem !== 'btn.collapse') {
			event.preventDefault();
			event.stopPropagation();
			return;
		}

		let data = null;
		if (this.composedItem && typeof this.composedItem !== 'boolean') {
			data = await this.parseComposedEvent();
		} else {
			data = this.composeMetricsEvent();
		}

		if (data && this.metrics && this.metrics.sendAsync) {
			try {
				await this.metrics.sendAsync(data);
			} catch (ex) {
				this.devService.writeLog('sending metric breaks with exception:' + ex);
			}
		}
	}
}
