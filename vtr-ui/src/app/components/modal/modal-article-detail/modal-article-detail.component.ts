import { Component, OnInit, ElementRef, HostListener, SecurityContext } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CMSService } from 'src/app/services/cms/cms.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { VantageShellService } from '../../../services/vantage-shell/vantage-shell.service';
import { ActivatedRoute } from '@angular/router';
import { TimerService } from 'src/app/services/timer/timer.service';

@Component({
	selector: 'vtr-modal-article-detail',
	templateUrl: './modal-article-detail.component.html',
	styleUrls: ['./modal-article-detail.component.scss'],
	providers: [TimerService]
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
		private element: ElementRef,
		private timerService: TimerService,
	) {
		this.metricClient = vantageShellService.getMetrics();
		this.metricsParent = this.getPageName(activatedRoute) + '.Article';
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
					this.articleBody = this.sanitizer.sanitize(SecurityContext.HTML, response.Results.Body);
					if (response.Results.Category && response.Results.Category.length > 0) {
						this.articleCategory = response.Results.Category.map((category: any) => category.Id).join(' ');
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

		this.timerService.start();
	}

	private getPageName(activatedRoute: ActivatedRoute) {
		try {
			return activatedRoute.children[0].firstChild.routeConfig.data.pageName;
		} catch (ex) {}

		try {
			return activatedRoute.firstChild.snapshot.data.pageName;
		} catch (ex) {}

		return undefined;
	}

	enableBatteryChargeThreshold() {
		this.activeModal.close('enable');
	}

	// this function would only be fired when the modal backdrop was clicked,
	// and the modal would be closed automatically in this scenario
	onBeforeDismiss() {
		this.sendArticleViewMetric();
	}

	sendArticleViewMetric() {
		if (this.metricClient) {
			const modalElement = this.element.nativeElement.closest('ngb-modal-window');
			const metricsData = {
				ItemType: 'ArticleView',
				ItemID: this.articleId,
				ItemParent: this.metricsParent,
				ItemCategory: this.articleCategory,
				Duration: this.timerService.stop(),
				DocReadPosition: Math.round(((modalElement.scrollTop + window.innerHeight) / modalElement.scrollHeight) * 20),
				MediaReadPosition: 0
			};
			this.metricClient.sendAsync(metricsData);
		}
	}

	closeModal() {
		this.sendArticleViewMetric();
		this.activeModal.close('close');
	}

	@HostListener('document:keydown.escape', ['$event'])
	onClickEscape($event) {
		this.closeModal();
	}
}
