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

	fillFeatureClickEvent(data: any) {
		data.ItemType = 'FeatureClick';
		data.ItemName = this.metricsTranslateService.translate(this.metricsItem);
		data.ItemParent = this.metricsParent;
		if (this.metricsParam) {
			data.ItemParm = this.metricsParam;
		}
		if (this.metricsValue !== undefined) {
			data.ItemValue = this.metricsValue;
		}
	}

	fillArticleClickEvent(data: any) {
		data.ItemType = 'ArticleClick';
		data.ItemName = this.metricsTranslateService.translate(this.metricsItem);
		data.ItemParent = this.metricsParent;
		if (this.viewOrderService[this.metricsParent] === undefined) {
			this.viewOrderService[this.metricsParent] = 0;
		}
		data.ItemParm = this.metricsParam;
		data.viewOrder = (++this.viewOrderService[this.metricsParent]);
		data.ItemID = this.metricsItemID;
		data.ItemCategory = this.metricsItemCategory;
		data.ItemPosition = this.metricsItemPosition;
		data.PageNumber = this.metricsPageNumber || 1;
	}

	fillSettingUpdateEvent(data: any) {
		data.ItemType = 'SettingUpdate';
		data.SettingParent = this.metricsParent;
		data.SettingName = this.metricsSettingName;
		data.SettingValue = this.metricsSettingValue;
		if (this.metricsSettingParm) {
			data.SettingParm = this.metricsSettingParm;
		}
	}
	composeMetricsData() {
		const data: any = {};
		const eventName = this.metricsEvent.toLowerCase();
		switch (eventName) {
			case 'featureclick':
			case 'FeatureClick':
			case 'ItemClick':
			case 'itemclick': {
				this.fillFeatureClickEvent(data);
				break;
			}

			case 'articleclick':
			case 'ArticleClick':
			case 'docclick': {
				this.fillArticleClickEvent(data);
				break;
			}

			case 'settingupdate': {
				this.fillSettingUpdateEvent(data);
				break;
			}
			default:
				// fill all data for unknown event
				this.fillFeatureClickEvent(data);
				this.fillArticleClickEvent(data);
				this.fillSettingUpdateEvent(data);
				data.ItemType = eventName;
				break;
		}
		return data;
	}

	@HostListener('click', ['$event'])
	async onclick(event) {
        // prevent default event propogation for more than 1 click stop event propagation
        if (event.detail > 1 && this.metricsItem !== 'btn.collapse') {
			event.preventDefault();
			event.stopPropagation();
			return;
		}

        // Only for first click (when event.detail ===1 )log the metrics and propagate event
        if (!this.metricsParent) {
			this.metricsParent = this.activatedRoute.snapshot.data.pageName;
		}

		if (!this.metricsEvent) {
			this.metricsEvent = 'unknown';
			this.devService.writeLog('sending metric, missing event name');
		}

		if (!this.metricsParent) {
			this.metricsParent = 'unknown';
			this.devService.writeLog('sending metric, missing event parent');
		}

        const data = this.composeMetricsData();
        if (this.metrics && this.metrics.sendAsync) {
			try {
                await this.metrics.sendAsync(data);
            } catch (ex) {
				this.devService.writeLog('sending metric breaks with exception:' + ex);
			}
		}
    }
}
