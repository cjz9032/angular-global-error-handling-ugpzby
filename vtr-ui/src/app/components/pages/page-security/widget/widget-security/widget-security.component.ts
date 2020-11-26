import { Component, Input, OnInit } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { LandingView } from 'src/app/data-models/security-advisor/widegt-security-landing/landing-view.model';
import { Gradient } from 'src/app/data-models/security-advisor/gradient-color.model';
import { CMSService } from 'src/app/services/cms/cms.service';
import { ModalArticleDetailComponent } from 'src/app/components/modal/modal-article-detail/modal-article-detail.component';

@Component({
	selector: 'vtr-widget-security',
	templateUrl: './widget-security.component.html',
	styleUrls: ['./widget-security.component.scss'],
})
export class WidgetSecurityComponent implements OnInit {
	@Input() statusItem: LandingView = {
		status: 0,
		percent: 100,
		fullyProtected: false,
	};
	@Input() isOnline: boolean;
	articleId = '1C95D1D5D20D4888AC043821E7355D35';
	articleCategory: string;
	region: string;
	oldPercent: number;
	gradient: Gradient;

	btnDesc = ['security.landing.notFully', 'security.landing.fully'];
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
		},
	];
	levelText: string;

	constructor(public modalService: NgbModal, private cmsService: CMSService) {}

	ngOnInit(): void {
		this.fetchCMSArticleCategory();
	}

	fetchCMSArticleCategory() {
		this.cmsService.fetchCMSArticle(this.articleId, { Lang: 'EN' }).then((response: any) => {
			if (response && response.Results && response.Results.Category) {
				this.articleCategory = response.Results.Category.map(
					(category: any) => category.Title
				).join(' ');
			}
		});
	}

	buttonClick() {
		const articleDetailModal: NgbModalRef = this.modalService.open(
			ModalArticleDetailComponent,
			{
				size: 'lg',
				centered: true,
				windowClass: 'Article-Detail-Modal',
				keyboard: false,
				backdrop: true,
				beforeDismiss: () => {
					if (articleDetailModal.componentInstance.onBeforeDismiss) {
						articleDetailModal.componentInstance.onBeforeDismiss();
					}
					return true;
				},
			}
		);

		articleDetailModal.componentInstance.articleId = this.articleId;
	}
}
