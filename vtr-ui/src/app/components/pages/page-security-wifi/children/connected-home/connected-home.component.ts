import { Component, Input, EventEmitter, OnInit } from '@angular/core';
import { WifiHomeViewModel } from 'src/app/data-models/security-advisor/wifisecurity.model';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalArticleDetailComponent } from 'src/app/components/modal/modal-article-detail/modal-article-detail.component';
import { CMSService } from 'src/app/services/cms/cms.service';
import { RegionService } from 'src/app/services/region/region.service';

@Component({
	selector: 'vtr-connected-home',
	templateUrl: './connected-home.component.html',
	styleUrls: ['./connected-home.component.scss']
})
export class ConnectedHomeComponent implements OnInit {

	@Input() data: WifiHomeViewModel;
	@Input() isShowInvitationCode: boolean;
	emitter = new EventEmitter();
	showDescribe = false;
	peaceOfMindArticleId = '988BE19B75554E09B5A914D5F803C3F3';
	peaceOfMindArticleCategory: string;
	isChsExist: boolean;


	constructor(
		public dialogService: DialogService,
		public modalService: NgbModal,
		private cmsService: CMSService,
		public regionService: RegionService,
	) {
		this.fetchCMSArticles();
	}

	ngOnInit() {
		this.regionService.getRegion().subscribe({
			next: x => {
				this.isChsExist = false;
				if (x.toUpperCase() === 'US') { this.isChsExist = true; }
			},
			error: err => {
				this.isChsExist = false;
			}
		});
	}

	fetchCMSArticles() {
		this.cmsService.fetchCMSArticle(this.peaceOfMindArticleId, {'Lang': 'EN', 'GEO': 'US'}).then((response: any) => {
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
			windowClass: 'Article-Detail-Modal'
		});

		articleDetailModal.componentInstance.articleId = this.peaceOfMindArticleId;
	}
}
