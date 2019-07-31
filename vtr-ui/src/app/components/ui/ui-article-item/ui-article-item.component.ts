import { Component, OnInit, AfterViewInit, Input, ViewChild } from '@angular/core';
import { SupportService } from '../../../services/support/support.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalArticleDetailComponent } from '../../modal/modal-article-detail/modal-article-detail.component';

@Component({
	selector: 'vtr-ui-article-item',
	templateUrl: './ui-article-item.component.html',
	styleUrls: ['./ui-article-item.component.scss']
})
export class UIArticleItemComponent implements OnInit, AfterViewInit {

	@Input() item: any;
	@Input() index: any;
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

	showArticleDetails() {
		this.metricsDatas.viewOrder++;

		const articleDetailModal: NgbModalRef = this.modalService.open(ModalArticleDetailComponent, {
			backdrop: true,
			size: 'lg',
			centered: true,
			windowClass: 'Article-Detail-Modal',
			keyboard: false
		});
		if (this.articleType === 'content') {
			articleDetailModal.componentInstance.articleId = this.item.ActionLink;
		} else {
			articleDetailModal.componentInstance.articleId = this.item.Id;
		}
	}
}
