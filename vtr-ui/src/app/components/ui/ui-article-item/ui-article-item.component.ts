import { Component, OnInit, AfterViewInit, Input, ViewChild } from '@angular/core';
import { SupportService } from '../../../services/support/support.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalArticleDetailComponent } from '../../modal/modal-article-detail/modal-article-detail.component';
import { WinRT } from '@lenovo/tan-client-bridge';

@Component({
	selector: 'vtr-ui-article-item',
	templateUrl: './ui-article-item.component.html',
	styleUrls: ['./ui-article-item.component.scss']
})
export class UIArticleItemComponent implements OnInit, AfterViewInit {

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
		public modalService: NgbModal
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
		if (this.articleType === 'content') {
			if (!this.item.ActionType || this.item.ActionType !== 'Internal') {
				return;
			}
			if (this.item.ActionLink.indexOf('lenovo-vantage3:') === 0) {
				WinRT.launchUri(this.item.ActionLink);
			} else {
				this.showArticleDetails(this.item.ActionLink);
			}

			return false;
		} else {
			this.showArticleDetails(this.item.Id);
			return false;
		}
	}

	showArticleDetails(actionLink: string) {
		const articleDetailModal: NgbModalRef = this.modalService.open(ModalArticleDetailComponent, {
			backdrop: true,
			size: 'lg',
			centered: true,
			windowClass: 'Article-Detail-Modal',
			keyboard: false,
			beforeDismiss: () => {
				if (articleDetailModal.componentInstance.onBeforeDismiss) {
					articleDetailModal.componentInstance.onBeforeDismiss();
				}
				return true;
			}
		});
		articleDetailModal.componentInstance.articleId = actionLink;
	}
}
