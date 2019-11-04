import {
	Directive,
	HostListener,
	Input
} from '@angular/core';
import {
	VantageShellService
} from '../services/vantage-shell/vantage-shell.service';
import {
	ActivatedRoute
} from '@angular/router';
import {
	VieworderService
} from '../services/view-order/vieworder.service';
import {
	DevService
} from '../services/dev/dev.service';
import {
	MetricsTranslateService
} from '../services/mertics-traslate/metrics-translate.service';

export interface MetricsData {
	ItemType: string;
	ItemName ? : string;
	ItemParent ? : string;
	ItemParm ? : string;
	ItemValue ? : string;
	viewOrder ? : number;
	ItemID ? : string;
	ItemCategory ? : string;
	ItemPosition ? : string;
	PageNumber ? : string;
	SettingParent ? : string;
	SettingName ? : string;
	SettingValue ? : string;
	SettingParm ? : string;
}


declare var window;

/**
 * Hi all, this is a core file of metric implementation, before you change
 * this file, please estimate if your change affects the other component. And
 * it is better to let know or create a code review to me. I can help to review
 * yor change.
 * Mark Tao (taoxf1@lenovo.com)
 */
@Directive({
	selector: '[vtrMetrics]'
})
export class MetricsDirective {
	private metrics: any;

	constructor(
		shellService: VantageShellService,
		private activatedRoute: ActivatedRoute,
		private viewOrderService: VieworderService,
		private devService: DevService,
		private metricsTranslateService: MetricsTranslateService
	) {
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

	composeMetricsData() {
		const data: any = {};
		const eventName = this.metricsEvent.toLowerCase();
		switch (eventName) {
			case 'featureclick':
			case 'FeatureClick':
			case 'ItemClick':
			case 'itemclick': {
				data.ItemType = 'FeatureClick';
				data.ItemName = this.metricsTranslateService.translate(this.metricsItem);
				data.ItemParent = this.metricsParent;
				if (this.metricsParam) {
					data.ItemParm = this.metricsParam;
				}
				if (typeof this.metricsValue !== 'undefined') {
					data.ItemValue = this.metricsValue;
				}
				break;
			}

			case 'articleclick':
			case 'ArticleClick':
			case 'docclick': {
				data.ItemType = 'ArticleClick';
				data.ItemName = this.metricsTranslateService.translate(this.metricsItem);
				data.ItemParent = this.metricsParent;
				if (typeof this.viewOrderService[this.metricsParent] === 'undefined') {
					this.viewOrderService[this.metricsParent] = 0;
				}
				data.ItemParm = this.metricsParam;
				data.viewOrder = (++this.viewOrderService[this.metricsParent]);
				data.ItemID = this.metricsItemID;
				data.ItemCategory = this.metricsItemCategory;
				data.ItemPosition = this.metricsItemPosition;
				data.PageNumber = this.metricsPageNumber || 1;
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
				break;
			}
		}
		return data;
	}

	@HostListener('click', ['$event'])
	async onclick(event) {
		console.log(" click number :: " + event.detail);

		// prevent default event propogation for more than 1 click stop event propagation
		if (event.detail > 1) {
			event.preventDefault();
			event.stopPropagation();
			return;
		}
		// Only for first click (when event.detail ===1 )log the metrics and propagate event
		if (!this.metricsParent) {
			this.metricsParent = this.activatedRoute.snapshot.data.pageName;
		}

		if (!this.metricsEvent || !this.metricsParent) {
			this.devService.writeLog('sending metric breaks, missing event name or parent');
			return;
		}

		const data = this.composeMetricsData();

		if (this.metrics && this.metrics.sendAsync) {
			try {
				console.log('metrics data ::-------------------------------*******', JSON.stringify(data));
				await this.metrics.sendAsync(data);
			} catch (ex) {
				this.devService.writeLog('sending metric breaks with exception:' + ex);
			}
		}

	}
}
