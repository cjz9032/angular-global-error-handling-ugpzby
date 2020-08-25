import { Component, OnInit, AfterViewInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { SupportService } from '../../../services/support/support.service';
import { CardService } from 'src/app/services/card/card.service';
import { SupportContentStatus } from 'src/app/enums/support-content-status.enum';
import { MetricService } from 'src/app/services/metric/metrics.service';
import { FeatureContent } from 'src/app/data-models/common/feature-content.model';
import { ContentSource } from 'src/app/enums/content.enum';

@Component({
	selector: 'vtr-ui-article-item',
	templateUrl: './ui-article-item.component.html',
	styleUrls: ['./ui-article-item.component.scss']
})
export class UIArticleItemComponent implements OnInit, AfterViewInit, OnDestroy {

	SupportContentStatus = SupportContentStatus;
	@Input() index: any;
	@Input() tabIndex: number;
	@Input() articleType: string;
	@ViewChild('articleItemDiv', { static: false }) articleItemDiv: any;

	private innerItem: FeatureContent;
	private displayDetectionTaskId;

	itemCategory = '';
	ratio = 420 / 430;

	metricsDatas: {
		viewOrder: number
		pageNumber: number
	};

	constructor(
		private supportService: SupportService,
		public cardService: CardService,
		private metricsService: MetricService

	) {
		this.metricsDatas = this.supportService.metricsDatas;
	}

	@Input() set item(itemValue: any) {
		const preItem = this.item;
		this.innerItem = itemValue;

		if (preItem && preItem === itemValue.Id) {
			return;
		}

		if (!itemValue || !itemValue.DataSource || itemValue.DataSource === ContentSource.Local) {
			return;
		}

		this.metricsService.contentDisplayDetection.removeTask(this.displayDetectionTaskId);
		this.displayDetectionTaskId = this.metricsService.contentDisplayDetection.addTask(itemValue, () => this.articleItemDiv, () => this.index);
	}

	get item() {
		return this.innerItem;
	}

	ngOnInit() {
	}

	ngAfterViewInit() {
		const delay = setInterval(() => {
			if (this.item) {
				this.calcHeight();
				if (this.item.Category && this.item.Category.length > 0 && this.item.Category[0].Id) {
					this.itemCategory = this.item.Category[0].Id;
				}
				clearInterval(delay);
			}
		}, 100);
	}

	calcHeight() {
		if (this.item.Thumbnail === '') {
			this.ratio = 160 / 430;
		} else if (this.item.Title === '') {
			this.ratio = 283 / 430;
		} else {
			this.ratio = 420 / 430;
		}
	}

	clickContent() {
		this.metricsDatas.viewOrder++;
		if (this.articleType === SupportContentStatus.Content) {
			return this.cardService.linkClicked(this.item.ActionType, this.item.ActionLink, false, this.item.Title);
		} else {
			this.cardService.openArticleModal(this.item.Id, this.item.Title);
			return false;
		}
	}

	ngOnDestroy() {
		this.metricsService.contentDisplayDetection.removeTask(this.displayDetectionTaskId);
	}
}
