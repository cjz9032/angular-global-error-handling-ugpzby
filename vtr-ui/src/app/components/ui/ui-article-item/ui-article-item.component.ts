import { Component, OnInit, AfterViewInit, Input, ViewChild } from '@angular/core';
import { SupportService } from '../../../services/support/support.service';
import { CardService } from 'src/app/services/card/card.service';
import { SupportContentStatus } from 'src/app/enums/support-content-status.enum';

@Component({
	selector: 'vtr-ui-article-item',
	templateUrl: './ui-article-item.component.html',
	styleUrls: ['./ui-article-item.component.scss']
})
export class UIArticleItemComponent implements OnInit, AfterViewInit {

	SupportContentStatus = SupportContentStatus;
	@Input() item: any;
	@Input() index: any;
	@Input() tabIndex: number;
	@Input() articleType: string;
	@ViewChild('articleItemDiv', { static: true }) articleItemDiv: any;

	itemCategory = '';
	ratio = 420 / 430;

	metricsDatas: {
		viewOrder: number
		pageNumber: number
	};

	constructor(
		private supportService: SupportService,
		public cardService: CardService,
	) {
		this.metricsDatas = this.supportService.metricsDatas;
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
			return this.cardService.linkClicked(this.item.ActionType, this.item.ActionLink);
		} else {
			this.cardService.openArticleModal(this.item.Id);
			return false;
		}
	}

}
