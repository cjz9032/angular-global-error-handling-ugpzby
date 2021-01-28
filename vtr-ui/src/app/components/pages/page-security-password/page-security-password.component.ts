import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { PasswordManager, EventTypes, SecurityAdvisor } from '@lenovo/tan-client-bridge';
import { MatDialog } from '@lenovo/material/dialog';

import { VantageShellService } from '../../../services/vantage-shell/vantage-shell.service';
import { CMSService } from '../../../services/cms/cms.service';
import { CommonService } from '../../../services/common/common.service';
import { LocalStorageKey } from '../../../enums/local-storage-key.enum';
import { ModalArticleDetailComponent } from '../../modal/modal-article-detail/modal-article-detail.component';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GuardService } from '../../../services/guard/guardService.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { FeatureIntroduction } from '../../ui/ui-feature-introduction/ui-feature-introduction.component';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';

@Component({
	selector: 'vtr-page-security-password',
	templateUrl: './page-security-password.component.html',
	styleUrls: ['./page-security-password.component.scss'],
})
export class PageSecurityPasswordComponent implements OnInit, OnDestroy {
	passwordManager: PasswordManager;
	statusItem: any;
	cardContentPositionA: any = {};
	securityAdvisor: SecurityAdvisor;
	dashlaneArticleId = '0EEB43BE718446C6B49F2C83FC190758';
	dashlaneArticleCategory: string;
	isOnline = true;
	notificationSubscription: Subscription;
	featureIntroduction: FeatureIntroduction;
	reverseContent = false;

	constructor(
		private commonService: CommonService,
		private localCacheService: LocalCacheService,
		private cmsService: CMSService,
		private dialog: MatDialog,
		public vantageShellService: VantageShellService,
		private guard: GuardService,
		private router: Router
	) {}

	ngOnInit() {
		this.securityAdvisor = this.vantageShellService.getSecurityAdvisor();
		this.passwordManager = this.securityAdvisor.passwordManager;
		this.statusItem = {
			title: 'security.passwordManager.statusTitle',
			status: 'loading',
		};
		this.featureIntroduction = {
			featureTitle: '',
			featureTitleDesc: '',
			imgSrc: 'assets/images/Dashlane-no-left-img.png',
			imgAlt: '',
			featureSubtitle: '',
			featureIntroList: [],
		};
		const cacheStatus = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.SecurityPasswordManagerStatus
		);
		if (cacheStatus) {
			this.statusItem.status = cacheStatus;
			this.getFeatureIntro(this.statusItem.status);
		}
		if (this.passwordManager && this.passwordManager.status) {
			this.statusItem.status = this.passwordManager.status;
			this.getFeatureIntro(this.statusItem.status);
			this.localCacheService.setLocalCacheValue(
				LocalStorageKey.SecurityPasswordManagerStatus,
				this.statusItem.status
			);
		}
		this.passwordManager.on(EventTypes.pmStatusEvent, (status: string) => {
			this.statusItem.status = status;
			this.getFeatureIntro(this.statusItem.status);
			this.localCacheService.setLocalCacheValue(
				LocalStorageKey.SecurityPasswordManagerStatus,
				this.statusItem.status
			);
		});
		this.fetchCMSArticles();

		this.isOnline = this.commonService.isOnline;
		this.notificationSubscription = this.commonService.notification.subscribe(
			(notification: AppNotification) => {
				this.onNotification(notification);
			}
		);
		if (!this.guard.previousPageName.startsWith('Security')) {
			this.passwordManager.refresh();
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

	getDashLane(): void {
		this.passwordManager.download();
	}

	openDashLane(): void {
		this.passwordManager.launch();
	}

	@HostListener('window:focus')
	onFocus(): void {
		this.passwordManager.refresh();
	}

	fetchCMSArticles() {
		const queryOptions = {
			Page: 'password-protection',
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
				}
			},
			(error) => {}
		);

		this.cmsService
			.fetchCMSArticle(this.dashlaneArticleId, { Lang: 'EN' })
			.then((response: any) => {
				if (response && response.Results && response.Results.Category) {
					this.dashlaneArticleCategory = response.Results.Category.map(
						(category: any) => category.Title
					).join(' ');
				}
			});
	}

	openDashLaneArticle(): void {
		const articleDetailModal = this.dialog.open(ModalArticleDetailComponent, {
			autoFocus: false,
			hasBackdrop: true,
			panelClass: 'Article-Detail-Modal',
		});
		articleDetailModal.beforeClosed().subscribe(() => {
			articleDetailModal.componentInstance.onBeforeDismiss();
		});
		articleDetailModal.componentInstance.articleId = this.dashlaneArticleId;
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

	private getFeatureIntro(status: string) {
		if (status === 'installed') {
			this.reverseContent = true;
			this.featureIntroduction.featureTitle = 'security.passwordManager.getStarted';
			this.featureIntroduction.featureTitleDesc =
				'security.passwordManager.checkOutThisGuide';
			this.featureIntroduction.descHasLink = true;
			this.featureIntroduction.featureSubtitle = 'security.passwordManager.allowsYou';
			this.featureIntroduction.featureIntroList = [
				{
					iconName: 'check',
					detail: 'security.passwordManager.allowsYou1',
				},
				{
					iconName: 'check',
					detail: 'security.passwordManager.allowsYou2',
				},
				{
					iconName: 'check',
					detail: 'security.passwordManager.allowsYou3',
				},
				{
					iconName: 'check',
					detail: 'security.passwordManager.allowsYou4',
				},
			];
		} else if (status === 'not-installed') {
			this.featureIntroduction.featureTitle = 'security.passwordManager.neverForget';
			this.featureIntroduction.featureTitleDesc = 'security.passwordManager.whatIsDashLane';
			this.featureIntroduction.featureSubtitle = 'security.passwordManager.helpYou';
			this.featureIntroduction.featureIntroList = [
				{
					iconName: 'check',
					detail: 'security.passwordManager.helpYou1',
				},
				{
					iconName: 'check',
					detail: 'security.passwordManager.helpYou2',
				},
				{
					iconName: 'check',
					detail: 'security.passwordManager.helpYou3',
				},
				{
					iconName: 'check',
					detail: 'security.passwordManager.helpYou4',
				},
			];
		}
	}
}
