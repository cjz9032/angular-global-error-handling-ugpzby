import { Component, Input, OnInit } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalArticleDetailComponent } from '../../modal/modal-article-detail/modal-article-detail.component';
import { CMSService } from '../../../services/cms/cms.service';
import { CommonService } from 'src/app/services/common/common.service';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { NetworkStatus } from 'src/app/enums/network-status.enum';

@Component({
	selector: 'vtr-widget-security',
	templateUrl: './widget-security.component.html',
	styleUrls: ['./widget-security.component.scss']
})
export class WidgetSecurityComponent implements OnInit {
	@Input() percentValue: number = this.percentValue || 100;
	articleId = '1C95D1D5D20D4888AC043821E7355D35';
	articleCategory: string;
	isOnline: boolean;

	security = {
		title: [
			'security.landing.fully',
			'security.landing.notFully',
		],
		subTitle: [
			'security.landing.fullyDesc',
			'security.landing.notFullyDesc',
		],
		subTitle2: [
			'',
			''
		]
	};
	constructor(
		public modalService: NgbModal,
		private cmsService: CMSService,
		public commonService: CommonService
	) {
		this.fetchCMSArticleCategory();
	}

	ngOnInit() {
		this.isOnline = this.commonService.isOnline;
		this.commonService.notification.subscribe((notification: AppNotification) => {
			this.onNotification(notification);
		});
	}

	fetchCMSArticleCategory() {
		this.cmsService.fetchCMSArticle(this.articleId, {'Lang': 'EN'}).then((response: any) => {
			if (response && response.Results && response.Results.Category) {
				this.articleCategory = response.Results.Category.map((category: any) => category.Title).join(' ');
			}
		});
	}

	buttonClick() {
		const articleDetailModal: NgbModalRef = this.modalService.open(ModalArticleDetailComponent, {
			size: 'lg',
			centered: true,
			windowClass: 'Article-Detail-Modal'
		});

		articleDetailModal.componentInstance.articleId = this.articleId;
	}

	private onNotification(notification: AppNotification) {
		if (notification) {
			switch (notification.type) {
				case NetworkStatus.Online:
				case NetworkStatus.Offline:
					this.isOnline = notification.payload.isOnline;
					break;
				default:
					break;
			}
		}
	}
}
