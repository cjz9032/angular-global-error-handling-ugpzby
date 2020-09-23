import { Component,	Input,	OnInit,	DoCheck } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalArticleDetailComponent } from '../../modal/modal-article-detail/modal-article-detail.component';
import { CMSService } from '../../../services/cms/cms.service';
import { LandingView } from 'src/app/data-models/security-advisor/widegt-security-landing/landing-view.model';
import { GradientColor } from 'src/app/data-models/security-advisor/gradient-color.model';

@Component({
	selector: 'vtr-widget-security',
	templateUrl: './widget-security.component.html',
	styleUrls: ['./widget-security.component.scss']
})
export class WidgetSecurityComponent implements OnInit, DoCheck {
	@Input() statusItem: LandingView;
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
		this.oldPercent = this.statusItem.percent;
		this.updateSecurityStatus();
	}

	ngDoCheck(): void {
		if (!this.oldPercent || this.statusItem.percent !== this.oldPercent) {
			this.oldPercent = this.statusItem.percent;
			this.updateSecurityStatus();
		}
	}

	updateSecurityStatus() {
		this.gradient = new GradientColor(this.statusItem.status, this.statusItem.percent);
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
