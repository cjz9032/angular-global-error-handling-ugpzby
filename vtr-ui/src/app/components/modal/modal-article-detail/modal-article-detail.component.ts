import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CMSService } from 'src/app/services/cms/cms.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
	selector: 'vtr-modal-article-detail',
	templateUrl: './modal-article-detail.component.html',
	styleUrls: ['./modal-article-detail.component.scss']
})
export class ModalArticleDetailComponent implements OnInit {
	articleId: string;
	articleTitle = '';
	articleImage = '';
	articleBody: SafeHtml = '<div class="spinner-content"><div class="spinner-border text-primary progress-spinner" role="status"></div></div>';

	constructor(
		public activeModal: NgbActiveModal,
		private cmsService: CMSService,
		private sanitizer: DomSanitizer
	) { }

	ngOnInit() {
		const queryOptions = {
			'Lang': 'EN'
		};

		this.articleTitle = '';
		this.articleImage = '';

		this.cmsService.fetchCMSArticle(this.articleId, queryOptions).then(
			(response: any) => {
				this.articleTitle = response.Results.Title;
				this.articleImage = response.Results.Image;
				this.articleBody = this.sanitizer.bypassSecurityTrustHtml(response.Results.Body);
			},
			error => {
				console.log('fetchCMSContent error', error);
			}
		);
	}

	enableBatteryChargeThreshold() {
		this.activeModal.close('enable');
	}

	closeModal() {
		this.activeModal.close('close');
	}
}
