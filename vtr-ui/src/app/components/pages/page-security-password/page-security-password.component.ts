import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { MockService } from 'src/app/services/mock/mock.service';
import { PasswordManager, EventTypes, SecurityAdvisor } from '@lenovo/tan-client-bridge';
import { VantageShellService } from '../../../services/vantage-shell/vantage-shell.service';
import { CMSService } from '../../../services/cms/cms.service';
import { CommonService } from '../../../services/common/common.service';
import { LocalStorageKey } from '../../../enums/local-storage-key.enum';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalArticleDetailComponent } from '../../modal/modal-article-detail/modal-article-detail.component';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GuardService } from '../../../services/guard/guardService.service';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
	selector: 'vtr-page-security-password',
	templateUrl: './page-security-password.component.html',
	styleUrls: ['./page-security-password.component.scss']
})
export class PageSecurityPasswordComponent implements OnInit, OnDestroy {

	passwordManager: PasswordManager;
	statusItem: any;
	cardContentPositionA: any = {};
	securityAdvisor: SecurityAdvisor;
	backId = 'sa-pm-btn-back';
	dashlaneArticleId = '0EEB43BE718446C6B49F2C83FC190758';
	dashlaneArticleCategory: string;
	isOnline = true;
	notificationSubscription: Subscription;

	constructor(
		public mockService: MockService,
		private commonService: CommonService,
		private cmsService: CMSService,
		private modalService: NgbModal,
		public vantageShellService: VantageShellService,
		private guard: GuardService,
		private router: Router
	) {	}

	ngOnInit() {
		this.securityAdvisor = this.vantageShellService.getSecurityAdvisor();
		this.passwordManager = this.securityAdvisor.passwordManager;
		this.statusItem = {
			title: 'security.passwordManager.statusTitle',
			status: 'loading'
		};
		const cacheStatus = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityPasswordManagerStatus);
		if (cacheStatus) {
			this.statusItem.status = cacheStatus;
		}
		if (this.passwordManager && this.passwordManager.status) {
			this.statusItem.status = this.passwordManager.status;
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityPasswordManagerStatus, this.statusItem.status);
		}
		this.passwordManager.on(EventTypes.pmStatusEvent, (status: string) => {
			this.statusItem.status = status;
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityPasswordManagerStatus, this.statusItem.status);
		});
		this.fetchCMSArticles();

		this.isOnline = this.commonService.isOnline;
		this.notificationSubscription = this.commonService.notification.subscribe((notification: AppNotification) => {
			this.onNotification(notification);
		});
		if (!this.guard.previousPageName.startsWith('Security')) {
			this.passwordManager.refresh();
		}
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
			Page: 'password-protection'
		};

		this.cmsService.fetchCMSContent(queryOptions).subscribe(
			(response: any) => {
				const cardContentPositionA = this.cmsService.getOneCMSContent(response, 'inner-page-right-side-article-image-background', 'position-A')[0];
				if (cardContentPositionA) {
					this.cardContentPositionA = cardContentPositionA;
					if (this.cardContentPositionA.BrandName) {
						this.cardContentPositionA.BrandName = this.cardContentPositionA.BrandName.split('|')[0];
					}
				}
			},
			error => {
				console.log('fetchCMSContent error', error);
			}
		);

		this.cmsService.fetchCMSArticle(this.dashlaneArticleId, { Lang: 'EN' }).then((response: any) => {
			if (response && response.Results && response.Results.Category) {
				this.dashlaneArticleCategory = response.Results.Category.map((category: any) => category.Title).join(' ');
			}
		});
	}

	openDashLaneArticle(): void {
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
}
