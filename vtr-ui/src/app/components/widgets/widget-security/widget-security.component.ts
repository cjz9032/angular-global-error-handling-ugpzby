import { Component, Input, OnInit } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalArticleDetailComponent } from '../../modal/modal-article-detail/modal-article-detail.component';
import { CMSService } from '../../../services/cms/cms.service';
import { LocalInfoService } from 'src/app/services/local-info/local-info.service';

@Component({
	selector: 'vtr-widget-security',
	templateUrl: './widget-security.component.html',
	styleUrls: ['./widget-security.component.scss']
})
export class WidgetSecurityComponent implements OnInit {
	@Input() percentValue: number;
	@Input() showWindowsHello: boolean;
	articleId = '1C95D1D5D20D4888AC043821E7355D35';
	articleCategory: string;
	region: string;
	tooltipsTitle = 'security.landing.securityScoreDepends';
	tooltips: string[];
	hover: boolean;

	security = {
		title: [
			'security.landing.fully',
			'security.landing.notFully',
		],
		subTitle: [
			'security.landing.fullyDesc',
			'security.landing.notFullyDesc',
		],
		subTitle2: [
			'',
			''
		]
	};
	constructor(
		public modalService: NgbModal,
		private cmsService: CMSService,
		private localInfoService: LocalInfoService
	) {
		this.fetchCMSArticleCategory();
	}

	ngOnInit() {
		this.localInfoService.getLocalInfo().then(result => {
			this.region = result.GEO;
			const tooltipsInit = [
				'security.landing.antivirus',
				'security.landing.password',
				this.region !== 'cn' ? 'security.landing.vpn' : null,
				'security.landing.wifi',
				this.showWindowsHello ? 'security.landing.windowsHello' : null
			];
			this.tooltips = tooltipsInit.filter(current => current !== undefined && current !== null && current !== '');
		}).catch(e => {
			this.region = 'us';
		});
	}

	fetchCMSArticleCategory() {
		this.cmsService.fetchCMSArticle(this.articleId, { Lang: 'EN'}).then((response: any) => {
			if (response && response.Results && response.Results.Category) {
				this.articleCategory = response.Results.Category.map((category: any) => category.Title).join(' ');
			}
		});
	}

	buttonClick() {
		const articleDetailModal: NgbModalRef = this.modalService.open(ModalArticleDetailComponent, {
			size: 'lg',
			centered: true,
			windowClass: 'Article-Detail-Modal',
			keyboard : false,
			backdrop: true,
			beforeDismiss: () => {
				if (articleDetailModal.componentInstance.onBeforeDismiss) {
					articleDetailModal.componentInstance.onBeforeDismiss();
				}
				return true;
			}
		});

		articleDetailModal.componentInstance.articleId = this.articleId;
	}
}
