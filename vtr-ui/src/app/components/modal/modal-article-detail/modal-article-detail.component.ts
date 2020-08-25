import { Component, OnInit, ElementRef, HostListener, SecurityContext, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CMSService } from 'src/app/services/cms/cms.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { DurationCounterService } from 'src/app/services/timer/timer-service-ex.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { MetricService } from 'src/app/services/metric/metrics.service';
import { WinRT } from '@lenovo/tan-client-bridge';
import { CommonService } from 'src/app/services/common/common.service';
import { MetricEventName } from 'src/app/enums/metrics.enum';

@Component({
	selector: 'vtr-modal-article-detail',
	templateUrl: './modal-article-detail.component.html',
	styleUrls: ['./modal-article-detail.component.scss'],
	providers: [DurationCounterService]
})
export class ModalArticleDetailComponent implements OnInit {
	articleId: string;
	articleTitle = '';
	articleImage = '';
	articleBody: SafeHtml = '';
	articleCategory: string;
	articleLinkTitle = '';
	enterTime: number;
	metricsParent = '';
	focusDurationCounter = null;
	blurDurationCounter = null;

	AllContentStatus = {
		Loading: 1,
		Empty: 2,
		Content: 3,
	};
	contentStatus = this.AllContentStatus.Loading;

	@ViewChild('articleDetailModal') articleDetailModal: ElementRef;
	@ViewChild('articleDialogContent') articleDialogContent: ElementRef;

	constructor(
		public activeModal: NgbActiveModal,
		private cmsService: CMSService,
		private commonService: CommonService,
		private activatedRoute: ActivatedRoute,
		private sanitizer: DomSanitizer,
		private timerService: DurationCounterService,
		private logger: LoggerService,
		private metricService: MetricService
	) {
		this.metricsParent = this.getPageName(activatedRoute) + '.Article';
	}

	ngOnInit() {
		window.getSelection().empty();
		this.enterTime = new Date().getTime();
		this.articleTitle = '';
		this.articleImage = '';

		this.cmsService.fetchCMSArticle(this.articleId).then(
			(response: any) => {
				if ('Results' in response) {
					this.articleTitle = response.Results.Title;
					this.articleImage = response.Results.Image;
					const articleBodySanitize = this.sanitizer.sanitize(SecurityContext.HTML, response.Results.Body);
					const replaceBody = articleBodySanitize
						.replace(/(\"unsafe:)/gi, '"')
						.replace(/(<video )/gi, '<iframe ')
						.replace(/(<\/video>)/gi, '</iframe>')
						.replace(/(autoplay=\")/gi, 'allow="');
					this.articleBody = this.sanitizer.bypassSecurityTrustHtml(replaceBody);
					this.contentStatus = this.AllContentStatus.Content;
					if (response.Results.Category && response.Results.Category.length > 0) {
						this.articleCategory = response.Results.Category.map((category: any) => category.Id).join(' ');
					}
				} else {
					this.articleTitle = response.title;
					this.contentStatus = this.AllContentStatus.Empty;
				}
			},
			error => {
				this.contentStatus = this.AllContentStatus.Empty;
				this.logger.error('fetchCMSContent error', error);
			}
		);

		this.focusDurationCounter = this.timerService.getFocusDurationCounter();
		this.blurDurationCounter = this.timerService.getBlurDurationCounter();
	}

	private getPageName(activatedRoute: ActivatedRoute) {
		try {
			return activatedRoute.children[0].firstChild.routeConfig.data.pageName;
		} catch (ex) { }

		try {
			return activatedRoute.firstChild.snapshot.data.pageName;
		} catch (ex) { }

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
		const viewPort = this.articleDialogContent.nativeElement as HTMLElement;
		let DocReadPosition = -1;
		if (viewPort) {
			if (viewPort.scrollHeight === 0) {
				DocReadPosition = 0;
			} else {
				DocReadPosition = (viewPort.scrollTop + viewPort.clientHeight) * 100 / viewPort.scrollHeight;
				DocReadPosition = Math.round(DocReadPosition);
			}
		}
		const focusDuration = this.focusDurationCounter !== null ? this.focusDurationCounter.getDuration() : 0;
		const blurDuration = this.blurDurationCounter !== null ? this.blurDurationCounter.getDuration() : 0;
		const metricsData = {
			ItemType: MetricEventName.articleview,
			ItemID: this.articleId,
			ItemParent: this.metricsParent,
			ItemCategory: this.articleCategory,
			Duration: focusDuration, // this.duration + parseInt(`${Math.floor((Date.now() - this.interTime) / 1000)}`, 10),
			DurationBlur: blurDuration,
			DocReadPosition,
			MediaReadPosition: 0
		};
		this.metricService.sendArticleView(metricsData);
	}

	closeModal() {
		this.sendArticleViewMetric();
		this.activeModal.close('close');
	}

	@HostListener('document:keydown.pageup')
	onClickPageUp() {
		this.commonService.scrollElementByDistance(this.articleDialogContent.nativeElement, this.articleDialogContent.nativeElement.clientHeight - 40, true);
	}
	@HostListener('document:keydown.pagedown')
	onClickPageDown() {
		this.commonService.scrollElementByDistance(this.articleDialogContent.nativeElement, this.articleDialogContent.nativeElement.clientHeight - 40);
	}

	@HostListener('document:keydown.escape', ['$event'])
	onClickEscape($event) {
		this.closeModal();
	}

	@HostListener('window: focus')
	onFocus(): void {
		const modal = document.querySelector('.Article-Detail-Modal') as HTMLElement;
		modal.focus();
	}

	openProtocol(url: string): boolean {
		if (url.startsWith('lenovo-vantage3:')) {
			WinRT.launchUri(url);
			setTimeout(() => { this.closeModal(); }, 100);
			return false;
		}
		return true;
	}

	@HostListener('click', ['$event.target'])
	onClick(targetElement: any): boolean {
		let count = 0;
		while (targetElement && count < 4) {
			if (targetElement.href) {
				return this.openProtocol(targetElement.href);
			}
			if (targetElement.parentElement) {
				targetElement = targetElement.parentElement;
				count++;
			} else {
				return true;
			}
		}
	}

}
