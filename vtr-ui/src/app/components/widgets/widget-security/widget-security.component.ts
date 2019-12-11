import { Component, Input, OnInit, HostListener } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalArticleDetailComponent } from '../../modal/modal-article-detail/modal-article-detail.component';
import { CMSService } from '../../../services/cms/cms.service';
import { LocalInfoService } from 'src/app/services/local-info/local-info.service';
import { StatusInfo, SecurityTypeConst } from 'src/app/data-models/security-advisor/status-info.model';

@Component({
	selector: 'vtr-widget-security',
	templateUrl: './widget-security.component.html',
	styleUrls: ['./widget-security.component.scss']
})
export class WidgetSecurityComponent implements OnInit {
	@Input() statusItem: any;
	articleId = '1C95D1D5D20D4888AC043821E7355D35';
	articleCategory: string;
	region: string;

	btnDesc = [
		'security.landing.notFully',
		'security.landing.fully'
	];
	securityLevelInfo = [
		{
			status: 'security.landing.noProtection',
			title: 'security.landing.noProtection',
			desc: 'security.landing.noProtectionDesc',
		},
		{
			status: 'security.landing.basic',
			title: 'security.landing.basicTitle',
			desc: 'security.landing.basicDesc',
		},
		{
			status: 'security.landing.intermediate',
			title: 'security.landing.intermediateTitle',
			desc: 'security.landing.intermediateDesc',
		},
		{
			status: 'security.landing.advanced',
			title: 'security.landing.advancedTitle',
			desc: 'security.landing.advancedDesc',
		}
	];

	images = [
		[
			'assets/images/securityAdvisor/Gauge-No_protection.svg',
			'assets/images/securityAdvisor/Gauge-blank.svg'
		],
		[
			'assets/images/securityAdvisor/Gauge-Basic_protection-1.svg',
			'assets/images/securityAdvisor/Gauge-Basic_protection-2.svg',
			'assets/images/securityAdvisor/Gauge-Basic_protection-3.svg'
		],
		[
			'assets/images/securityAdvisor/Gauge-Intermediate_protection-1.svg',
			'assets/images/securityAdvisor/Gauge-Intermediate_protection-2.svg',
			'assets/images/securityAdvisor/Gauge-Intermediate_protection-3.svg',
		],
		[
			'assets/images/securityAdvisor/Gauge-Advanced_protection-1.svg',
			'assets/images/securityAdvisor/Gauge-Advanced_protection-2.svg',
			'assets/images/securityAdvisor/Gauge-Advanced_protection-3.svg',
		]
	];

	constructor(
		public modalService: NgbModal,
		private cmsService: CMSService,
		private localInfoService: LocalInfoService
	) {
		this.fetchCMSArticleCategory();
	}

	ngOnInit() {	}

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
