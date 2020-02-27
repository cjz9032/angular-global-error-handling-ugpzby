import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { VantageShellService } from '../../../services/vantage-shell/vantage-shell.service';
import { AntiVirusViewModel } from '../../../data-models/security-advisor/antivirus.model';
import { CMSService } from '../../../services/cms/cms.service';
import { CommonService } from '../../../services/common/common.service';
import { LocalStorageKey } from '../../../enums/local-storage-key.enum';
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
import { AntivirusErrorHandle } from 'src/app/data-models/security-advisor/antivirus-error-handle.model';

@Component({
	selector: 'vtr-page-security-antivirus',
	templateUrl: './page-security-antivirus.component.html',
	styleUrls: ['./page-security-antivirus.component.scss']
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

	@HostListener('window:focus')
	onFocus(): void {
		const id = document.activeElement.id;
		if (id !== 'sa-av-button-launch-mcafee') {
			this.antiVirus.refresh();
		}
	}

	constructor(
		private vantageShell: VantageShellService,
		public cmsService: CMSService,
		public commonService: CommonService,
		public modalService: NgbModal,
		private guard: GuardService,
		private router: Router,
		private localInfoService: LocalInfoService,
		public translate: TranslateService,
	) { }

	ngOnInit() {
		this.securityAdvisor = this.vantageShell.getSecurityAdvisor();
		this.antiVirus = this.securityAdvisor.antivirus;
		this.fetchCMSArticles();
		this.isOnline = this.commonService.isOnline;
		this.notificationSubscription = this.commonService.notification.subscribe((notification: AppNotification) => {
			this.onNotification(notification);
		});
		this.common = new AntivirusCommon(this.antiVirus, this.isOnline, this.localInfoService, this.commonService, this.translate);
		this.viewModel = new AntiVirusViewModel(this.antiVirus, this.commonService, this.translate);

		if (!this.guard.previousPageName.startsWith('Security')) {
			this.antiVirus.refresh();
		}
		// const antivirus = new AntivirusErrorHandle(this.antiVirus);
		// antivirus.refreshAntivirus();
	}

	ngOnDestroy() {
		if (this.router.routerState.snapshot.url.indexOf('security') === -1) {
			if (this.securityAdvisor.wifiSecurity) {
				this.securityAdvisor.wifiSecurity.cancelGetWifiSecurityState();
			}
		}
		if (this.notificationSubscription) {
			this.notificationSubscription.unsubscribe();
		}
	}

	fetchCMSArticles() {
		const queryOptions = {
			Page: 'anti-virus',
			Template: 'inner-page-right-side-article-image-background'
		};

		this.cmsService.fetchCMSContent(queryOptions).subscribe(
			(response: any) => {
				const cardContentPositionA = this.cmsService.getOneCMSContent(response, 'inner-page-right-side-article-image-background', 'position-A')[0];
				if (cardContentPositionA) {
					this.cardContentPositionA = cardContentPositionA;
					if (this.cardContentPositionA.BrandName) {
						this.cardContentPositionA.BrandName = this.cardContentPositionA.BrandName.split('|')[0];
					}
					this.mcafeeArticleId = this.cardContentPositionA.ActionLink;
					this.cmsService.fetchCMSArticle(this.mcafeeArticleId).then((r: any) => {
						if (r && r.Results && r.Results.Category) {
							this.mcafeeArticleCategory = r.Results.Category.map((category: any) => category.Title).join(' ');
						}
					});
				}
			},
			error => {}
		);
	}

	openArticle() {
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

}
