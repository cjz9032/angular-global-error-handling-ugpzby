import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { VantageShellService } from '../../../services/vantage-shell/vantage-shell.service';
import { AntiVirusViewModel } from '../../../data-models/security-advisor/antivirus.model';
import { CMSService } from '../../../services/cms/cms.service';
import { CommonService } from '../../../services/common/common.service';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalArticleDetailComponent } from '../../modal/modal-article-detail/modal-article-detail.component';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { GuardService } from '../../../services/guard/guardService.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { Router } from '@angular/router';
import * as phoenix from '@lenovo/tan-client-bridge';
import { AntivirusCommon } from 'src/app/data-models/security-advisor/antivirus-common.model';
import { LocalInfoService } from 'src/app/services/local-info/local-info.service';
import { TranslateService } from '@ngx-translate/core';
import { AntivirusService } from 'src/app/services/security/antivirus.service';
import { MetricService } from 'src/app/services/metric/metrics.service';
import { MetricsTranslateService } from 'src/app/services/mertics-traslate/metrics-translate.service';
import { HypothesisService } from 'src/app/services/hypothesis/hypothesis.service';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';

@Component({
	selector: 'vtr-page-security-antivirus',
	templateUrl: './page-security-antivirus.component.html',
	styleUrls: ['./page-security-antivirus.component.scss'],
})
export class PageSecurityAntivirusComponent implements OnInit, OnDestroy {
	backarrow = '< ';
	antiVirus: phoenix.Antivirus;
	viewModel: AntiVirusViewModel;
	urlPrivacyPolicy = 'https://www.mcafee.com/consumer/en-us/policy/global/legal.html';
	urlTermsOfService = 'https://www.mcafee.com/consumer/en-us/policy/global/legal.html';
	mcafeeArticleId: string;
	cardContentPositionA: any = {};
	securityAdvisor: phoenix.SecurityAdvisor;
	mcafeeArticleCategory: string;
	isOnline = true;
	notificationSubscription: Subscription;
	common: AntivirusCommon;
	isLaunchMcAfeeId: boolean;
	refreshTimeout: ReturnType<typeof setTimeout>;

	@HostListener('window:focus')
	onFocus(): void {
		this.refreshPage(document.activeElement.id);
	}

	@HostListener('document:click', ['$event'])
	onClick(event) {
		this.refreshPage(event.target.id);
	}

	constructor(
		private vantageShell: VantageShellService,
		public cmsService: CMSService,
		public commonService: CommonService,
		public localCacheService: LocalCacheService,
		public modalService: NgbModal,
		private guard: GuardService,
		private router: Router,
		private localInfoService: LocalInfoService,
		public translate: TranslateService,
		public metrics: MetricService,
		public metricsTranslateService: MetricsTranslateService,
		public hypSettings: HypothesisService,
		private antivirusService: AntivirusService
	) {}

	ngOnInit() {
		this.securityAdvisor = this.vantageShell.getSecurityAdvisor();
		this.antiVirus = this.securityAdvisor.antivirus;
		this.fetchCMSArticles();
		this.isOnline = this.commonService.isOnline;
		this.notificationSubscription = this.commonService.notification.subscribe(
			(notification: AppNotification) => {
				this.onNotification(notification);
			}
		);
		this.common = new AntivirusCommon(
			this.antiVirus,
			this.isOnline,
			this.localInfoService,
			this.localCacheService,
			this.translate,
			this.metrics,
			this.metricsTranslateService,
			this.hypSettings
		);
		this.viewModel = new AntiVirusViewModel(
			this.antiVirus,
			this.localCacheService,
			this.translate,
			this.antivirusService
		);

		if (!this.guard.previousPageName.startsWith('Security')) {
			this.antiVirus.refresh();
		}
	}

	ngOnDestroy() {
		if (this.securityAdvisor.wifiSecurity) {
			this.securityAdvisor.wifiSecurity.cancelGetWifiSecurityState();
		}
		if (this.notificationSubscription) {
			this.notificationSubscription.unsubscribe();
		}
	}

	fetchCMSArticles() {
		const queryOptions = {
			Page: 'anti-virus',
			Template: 'inner-page-right-side-article-image-background',
		};

		this.cmsService.fetchCMSContent(queryOptions).subscribe(
			(response: any) => {
				const cardContentPositionA = this.cmsService.getOneCMSContent(
					response,
					'inner-page-right-side-article-image-background',
					'position-A'
				)[0];
				if (cardContentPositionA) {
					this.cardContentPositionA = cardContentPositionA;
					if (this.cardContentPositionA.BrandName) {
						this.cardContentPositionA.BrandName = this.cardContentPositionA.BrandName.split(
							'|'
						)[0];
					}
					this.mcafeeArticleId = this.cardContentPositionA.ActionLink;
					this.cmsService.fetchCMSArticle(this.mcafeeArticleId).then((r: any) => {
						if (r && r.Results && r.Results.Category) {
							this.mcafeeArticleCategory = r.Results.Category.map(
								(category: any) => category.Title
							).join(' ');
						}
					});
				}
			},
			(error) => {}
		);
	}

	openArticle() {
		const articleDetailModal: NgbModalRef = this.modalService.open(
			ModalArticleDetailComponent,
			{
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
				},
			}
		);

		articleDetailModal.componentInstance.articleId = this.mcafeeArticleId;
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

	public retry(type) {
		this.viewModel.retry(type);
	}

	refreshPage(id: string) {
		clearTimeout(this.refreshTimeout);
		this.refreshTimeout = setTimeout(() => {
			if (
				id === 'sa-av-button-launch-mcafee' ||
				(id.startsWith('sa-av') && id.endsWith('subscribe'))
			) {
				return;
			}
			this.antiVirus.refresh();
		}, 100);
	}
}
