import { Component, OnInit, HostListener } from '@angular/core';
import { MockService } from 'src/app/services/mock/mock.service';
import { PasswordManager, EventTypes, SecurityAdvisor } from '@lenovo/tan-client-bridge';
import { VantageShellService } from '../../../services/vantage-shell/vantage-shell.service';
import { CMSService } from '../../../services/cms/cms.service';
import { CommonService } from '../../../services/common/common.service';
import { LocalStorageKey } from '../../../enums/local-storage-key.enum';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalArticleDetailComponent } from '../../modal/modal-article-detail/modal-article-detail.component';

@Component({
	selector: 'vtr-page-security-password',
	templateUrl: './page-security-password.component.html',
	styleUrls: ['./page-security-password.component.scss']
})
export class PageSecurityPasswordComponent implements OnInit {

	passwordManager: PasswordManager;
	statusItem: any;
	cardContentPositionA: any = {};
	securityAdvisor: SecurityAdvisor;
	backId = 'sa-pm-btn-back';
	dashlaneArticleId = '0EEB43BE718446C6B49F2C83FC190758';
	dashlaneArticleCategory: string;

	constructor(
		public mockService: MockService,
		private commonService: CommonService,
		private cmsService: CMSService,
		private modalService: NgbModal,
		vantageShellService: VantageShellService
	) {
		this.securityAdvisor = vantageShellService.getSecurityAdvisor();
		this.passwordManager = vantageShellService.getSecurityAdvisor().passwordManager;
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
	}

	ngOnInit() { }

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
			'Page': 'password-protection',
			'Lang': 'EN',
			'GEO': 'US',
			'OEM': 'Lenovo',
			'OS': 'Windows',
			'Segment': 'SMB',
			'Brand': 'Lenovo'
		};

		this.cmsService.fetchCMSContent(queryOptions).then(
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

		this.cmsService.fetchCMSArticle(this.dashlaneArticleId, {'Lang': 'EN'}).then((response: any) => {
			if (response && response.Results && response.Results.Category) {
				this.dashlaneArticleCategory = response.Results.Category.map((category: any) => category.Title).join(' ');
			}
		});
	}

	openDashLaneArticle(): void {
		const articleDetailModal: NgbModalRef = this.modalService.open(ModalArticleDetailComponent, {
			backdrop: 'static',
			size: 'lg',
			centered: true,
			windowClass: 'Article-Detail-Modal'
		});
		articleDetailModal.componentInstance.articleId = this.dashlaneArticleId;
	}
}
