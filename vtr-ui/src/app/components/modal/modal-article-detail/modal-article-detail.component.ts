import { Component, OnInit, ElementRef, HostListener, SecurityContext } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CMSService } from 'src/app/services/cms/cms.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { VantageShellService } from '../../../services/vantage-shell/vantage-shell.service';
import { ActivatedRoute } from '@angular/router';

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
	articleCategory: string;
	metricClient: any;
	enterTime: number;
	metricsParent = '';

	constructor(
		public activeModal: NgbActiveModal,
		private cmsService: CMSService,
		vantageShellService: VantageShellService,
		private activatedRoute: ActivatedRoute,
		private sanitizer: DomSanitizer,
		private element: ElementRef
	) {
		this.metricClient = vantageShellService.getMetrics();
		this.metricsParent = this.activatedRoute.firstChild.snapshot.data.pageName + '.Article';
	}

	ngOnInit() {
		this.enterTime = new Date().getTime();
		this.articleTitle = '';
		this.articleImage = '';

		this.cmsService.fetchCMSArticle(this.articleId).then(
			(response: any) => {
				if ('Results' in response) {
					this.articleTitle = response.Results.Title;
					this.articleImage = response.Results.Image;
					this.articleBody = this.sanitizer.sanitize(SecurityContext.HTML , response.Results.Body);
					if (response.Results.Category && response.Results.Category.length > 0) {
						this.articleCategory = response.Results.Category.map((category: any) => category.Title).join(' ');
					}
				} else {
					this.articleTitle = response.title;
					this.articleBody = '';
				}
			},
			error => {
				this.articleBody = '<div class=\'alert alert-danger\'>Some Error Occurs Please Try again later</div>';
				console.log('fetchCMSContent error', error);
			}
		);
	}

	enableBatteryChargeThreshold() {
		this.activeModal.close('enable');
	}

	closeModal() {
		if (this.metricClient) {
			const modalElement = this.element.nativeElement.closest('ngb-modal-window');
			const metricsData = {
				ItemType: 'ArticleView',
				ItemID: this.articleId,
				ItemParent: this.metricsParent,
				ItemCategory: this.articleCategory,
				Duration: (new Date().getTime() - this.enterTime) / 1000,
				DocReadPosition: Math.round(((modalElement.scrollTop + window.innerHeight) / modalElement.scrollHeight) * 20),
				MediaReadPosition: 0
			};
			console.log(window.innerHeight, 'hellokanchan');
			console.log(modalElement.scrollTop);
			console.log(modalElement.scrollHeight, 'helloneha');
			console.log('------reporting metrics------\n'.concat(JSON.stringify(metricsData)));
			this.metricClient.sendAsync(metricsData);
		}
		this.activeModal.close('close');
	}

	@HostListener('document:keydown.escape', ['$event'])
	onClickEscape() {
		this.closeModal();
	}
}
