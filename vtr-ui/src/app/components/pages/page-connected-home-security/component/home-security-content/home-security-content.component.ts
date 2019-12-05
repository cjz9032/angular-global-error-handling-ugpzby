import { Component, Input, OnInit } from '@angular/core';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalArticleDetailComponent } from 'src/app/components/modal/modal-article-detail/modal-article-detail.component';
import { CMSService } from 'src/app/services/cms/cms.service';
import { DeviceLocationPermission } from 'src/app/data-models/home-security/device-location-permission.model';

@Component({
	selector: 'vtr-home-security-content',
	templateUrl: './home-security-content.component.html',
	styleUrls: ['./home-security-content.component.scss']
})
export class HomeSecurityContentComponent implements OnInit {
	@Input() page: string;
	@Input() location: DeviceLocationPermission;
	@Input() permission: any;
	peaceOfMindArticleId = '988BE19B75554E09B5A914D5F803C3F3';
	peaceOfMindArticleCategory: string;


	constructor(
		public dialogService: DialogService,
		public modalService: NgbModal,
		private cmsService: CMSService,
	) {	}

	ngOnInit(): void {
		this.fetchCMSArticles();
	}

	fetchCMSArticles() {
		this.cmsService.fetchCMSArticle(this.peaceOfMindArticleId, { Lang: 'EN', GEO: 'US' }).then((response: any) => {
			if (response && response.Results && response.Results.Category) {
				this.peaceOfMindArticleCategory = response.Results.Category.map((category: any) => category.Title).join(' ');
			}
		});
	}

	openPeaceOfMindArticle(): void {
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

		articleDetailModal.componentInstance.articleId = this.peaceOfMindArticleId;
	}
}
