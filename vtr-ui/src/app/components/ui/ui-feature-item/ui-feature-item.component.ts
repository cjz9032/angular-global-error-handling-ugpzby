import { Component, Self, ElementRef, OnInit, AfterViewInit, Input, ViewChild } from '@angular/core';
import { DisplayService } from '../../../services/display/display.service';
import { SupportService } from '../../../services/support/support.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalArticleDetailComponent } from '../../modal/modal-article-detail/modal-article-detail.component';

@Component({
	selector: 'vtr-ui-feature-item',
	templateUrl: './ui-feature-item.component.html',
	styleUrls: ['./ui-feature-item.component.scss']
})
export class UiFeatureItemComponent implements OnInit, AfterViewInit {


	@Input() item: any;
	@Input() index: any;
	@ViewChild('articleItemDiv', { static: true }) articleItemDiv;

	ratioX = 1;
	ratioY = 0.5;
	ratio = 1;
	containerHeight = 100;
	containerHeights: number[];

	resizeListener;

	metricsDatas: {
		viewOrder: number
		pageNumber: number
	};

	constructor(
		@Self() private element: ElementRef,
		private displayService: DisplayService,
		private supportService: SupportService,
		public modalService: NgbModal
	) {
		this.metricsDatas = this.supportService.metricsDatas;
	}

	ngOnInit() {
		this.resizeListener = this.displayService.windowResizeListener().subscribe((event) => {
			this.calcHeight();
		});
	}

	ngAfterViewInit() {
		const self = this;
		const delay = setInterval(() => {
			if (this.item) {
				this.calcHeight();
				clearInterval(delay);
			}
		}, 200);
	}

	calcHeight() {
		const thisElement = this.articleItemDiv.nativeElement;
		if (this.item.Thumbnail === '') {
			thisElement.style.height = thisElement.clientWidth * 160 / 430 + 'px';
		} else if (this.item.Title === '') {
			thisElement.style.height = thisElement.clientWidth * 283 / 430 + 'px';
		} else {
			thisElement.style.height = thisElement.clientWidth * 420 / 430 + 'px';
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

		articleDetailModal.componentInstance.articleId = this.item.ActionLink;
	}
}
