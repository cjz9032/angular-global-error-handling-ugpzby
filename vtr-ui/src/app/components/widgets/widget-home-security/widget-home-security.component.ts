import { Component } from '@angular/core';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalArticleDetailComponent } from 'src/app/components/modal/modal-article-detail/modal-article-detail.component';
import { CMSService } from 'src/app/services/cms/cms.service';

@Component({
	selector: 'vtr-widget-home-security',
	templateUrl: './widget-home-security.component.html',
	styleUrls: ['./widget-home-security.component.scss']
})
export class WidgetHomeSecurityComponent {
	peaceOfMindArticleId = '988BE19B75554E09B5A914D5F803C3F3';
	peaceOfMindArticleCategory: string;

	items = [
		'security.homeprotection.homesecurity.homeSecurityAffect1',
		'security.homeprotection.homesecurity.homeSecurityAffect2',
		'security.homeprotection.homesecurity.homeSecurityAffect3'
	];

	constructor(
		public dialogService: DialogService,
		public modalService: NgbModal,
		private cmsService: CMSService,
	) {
		this.fetchCMSArticles();
	}

	fetchCMSArticles() {
		this.cmsService.fetchCMSArticle(this.peaceOfMindArticleId, { Lang: 'EN' }).then((response: any) => {
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
