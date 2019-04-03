import { Component, OnInit, HostListener } from '@angular/core';
import { MockService } from 'src/app/services/mock/mock.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { AntiVirusViewMode } from 'src/app/data-models/security-advisor/antivirus.model';
import { Antivirus } from '@lenovo/tan-client-bridge';
import { CMSService } from 'src/app/services/cms/cms.service';
import { CommonService } from 'src/app/services/common/common.service';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalArticleDetailComponent } from '../../modal/modal-article-detail/modal-article-detail.component';

@Component({
	selector: 'vtr-page-security-antivirus',
	templateUrl: './page-security-antivirus.component.html',
	styleUrls: ['./page-security-antivirus.component.scss']
})
export class PageSecurityAntivirusComponent implements OnInit {

	title = 'security.antivirus.common.title' ;
	back = 'security.antivirus.common.back';
	backarrow = '< ';
	antiVirus: Antivirus;
	viewMode: any;
	urlPrivacyPolicy = 'https://www.mcafee.com/consumer/en-us/policy/global/legal.html';
	urlTermsOfService = 'https://www.mcafee.com/consumer/en-us/policy/global/legal.html';
	urlGetMcAfee = '25CAD7D97D59483381EA39A87685A3C7';
	cardContentPositionA: any;

	@HostListener('window:focus')
	onFocus(): void {
		this.antiVirus.refresh();
	}

	constructor(public mockService: MockService,
		public VantageShell: VantageShellService,
		public cmsService: CMSService,
		commonService: CommonService,
		public modalService: NgbModal) {
		this.antiVirus = this.VantageShell.getSecurityAdvisor().antivirus;
		this.viewMode = new AntiVirusViewMode(this.antiVirus, commonService);
		this.fetchCMSArticles();
	}

	ngOnInit() {

	}

	fetchCMSArticles() {
		const queryOptions = {
			'Page': 'anti-virus',
			'Lang': 'EN',
			'GEO': 'US',
			'OEM': 'Lenovo',
			'OS': 'Windows',
			'Segment': 'SMB',
			'Brand': 'Lenovo'
		};

		this.cmsService.fetchCMSContent(queryOptions).then(
			(response: any) => {
				this.cardContentPositionA = this.cmsService.getOneCMSContent(response, 'inner-page-right-side-article-image-background', 'position-A')[0];

				this.cardContentPositionA.BrandName = this.cardContentPositionA.BrandName.split('|')[0];
			},
			error => {
				console.log('fetchCMSContent error', error);
			}
		);
	}

	openArticle() {
		const articleDetailModal: NgbModalRef = this.modalService.open(ModalArticleDetailComponent, {
			size: 'lg',
			centered: true,
			windowClass: 'Article-Detail-Modal'
		});

		articleDetailModal.componentInstance.articleId = this.urlGetMcAfee;
	}
}
