import { Component,	Input,	OnInit,	DoCheck } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { LandingView } from 'src/app/data-models/security-advisor/widegt-security-landing/landing-view.model';
import { GradientColor } from 'src/app/data-models/security-advisor/gradient-color.model';
import { CMSService } from 'src/app/services/cms/cms.service';
import { ModalArticleDetailComponent } from 'src/app/components/modal/modal-article-detail/modal-article-detail.component';

@Component({
	selector: 'vtr-widget-security',
	templateUrl: './widget-security.component.html',
	styleUrls: ['./widget-security.component.scss']
})
export class WidgetSecurityComponent implements OnInit, DoCheck {
	@Input() statusItem: LandingView = {
		status: 0,
		percent: 100,
		fullyProtected: false
	};
	@Input() isOnline: boolean;
	articleId = '1C95D1D5D20D4888AC043821E7355D35';
	articleCategory: string;
	region: string;
	oldPercent: number;
	gradient: GradientColor;

	btnDesc = [
		'security.landing.notFully',
		'security.landing.fully'
	];
	securityLevelInfo = [
		{
			title: 'security.landing.noProtection',
			desc: 'security.landing.noProtectionDesc',
		},
		{
			title: 'security.landing.basicTitle',
			desc: 'security.landing.basicDesc',
		},
		{
			title: 'security.landing.intermediateTitle',
			desc: 'security.landing.intermediateDesc',
		},
		{
			title: 'security.landing.advancedTitle',
			desc: 'security.landing.advancedDesc',
		}
	];


	constructor(
		public modalService: NgbModal,
		private cmsService: CMSService
	) {
		this.fetchCMSArticleCategory();
	}

	ngOnInit() {
		this.updateSecurityStatus();
	}

	ngDoCheck(): void {
		if (!this.oldPercent || this.statusItem.percent !== this.oldPercent) {
			this.updateSecurityStatus();
		}
	}

	updateSecurityStatus() {
		if (this.statusItem && typeof this.statusItem.status === 'number') {
			this.oldPercent = this.statusItem.percent;
			this.gradient = new GradientColor(this.statusItem.status, this.statusItem.percent);
		}
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
			keyboard: false,
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
