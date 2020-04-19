import { Component, OnInit, Input, OnDestroy, SecurityContext } from '@angular/core';
import { CMSService } from 'src/app/services/cms/cms.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { CommonService } from 'src/app/services/common/common.service';
//import { WidgetCarouselComponent } from 'src/app/components/widgets/widget-carousel/widget-carousel.component';
//import { WidgetCarouselModule } from 'src/app/components/widgets/widget-carousel/widget-carousel.module';

//for cpt
import { Subject, Observable, empty } from 'rxjs';
import { isEmpty } from 'rxjs/operators';
import { isNull, isUndefined } from 'util';

//from dashboard
import { DomSanitizer } from '@angular/platform-browser';
import { FeatureContent } from 'src/app/data-models/common/feature-content.model';

interface IConfigItem {
	cardId: string;
	displayContent: any;
	template: string;
	positionParam: string;
	tileSource: string;
	cmsContent: any;
	upeContent: any;
}

@Component({
	selector: 'vtr-cptpage-dashboard',
	templateUrl: './cptpage-dashboard.component.html',
	styleUrls: ['./cptpage-dashboard.component.scss'],
	//add components within array
	//entryComponents: [WidgetCarouselComponent]
})
export class CptpageDashboardComponent implements OnInit, OnDestroy {
	title = 'Dashboard';
	offlineConnection = 'offline-connection';
	public isOnline = true;

	heroBannerDemoItems = [];
	canShowDccDemo$: Promise<boolean>;

	contentCards = {
		positionA: {
			displayContent: [],
			template: 'home-page-hero-banner',
			cardId: 'positionA',
			positionParam: 'position-A',
			tileSource: 'CMS',
			cmsContent: undefined,
			upeContent: undefined
		},
		positionB: {
			displayContent: new FeatureContent(),
			template: 'half-width-title-description-link-image',
			cardId: 'positionB',
			positionParam: 'position-B',
			tileSource: 'CMS',
			cmsContent: undefined,
			upeContent: undefined
		},
		positionC: {
			displayContent: new FeatureContent(),
			template: 'half-width-title-description-link-image',
			cardId: 'positionC',
			positionParam: 'position-C',
			tileSource: 'CMS',
			cmsContent: undefined,
			upeContent: undefined
		},
		positionD: {
			displayContent: new FeatureContent(),
			template: 'full-width-title-image-background',
			cardId: 'positionD',
			positionParam: 'position-D',
			tileSource: 'CMS',
			cmsContent: undefined,
			upeContent: undefined
		},
		positionE: {
			displayContent: new FeatureContent(),
			template: 'half-width-top-image-title-link',
			cardId: 'positionE',
			positionParam: 'position-E',
			tileSource: 'CMS',
			cmsContent: undefined,
			upeContent: undefined
		},
		positionF: {
			displayContent: new FeatureContent(),
			template: 'half-width-top-image-title-link',
			cardId: 'positionF',
			positionParam: 'position-F',
			tileSource: 'CMS',
			cmsContent: undefined,
			upeContent: undefined
		}
	};

	constructor(
		private commonService: CommonService,
		private cmsService: CMSService,
		private translate: TranslateService,
		private sanitizer: DomSanitizer
	) { }

	ngOnInit() {
	}

	/**
	 * For cpt, 
	 * To send response to parent component, 
	 * Observable added before  
	 * this.cmsService.fetchCMSContent
	 */
	getCmsJsonResponse() {
		const queryOptions = {
			Page: 'dashboard'
		};

		return new Observable((observer) => {
			this.cmsService.fetchCMSContent(queryOptions).subscribe(
				(response: any) => {

					observer.next(response);//cpt
			 		observer.complete();

					if (response && response.length > 0) {
						this.populateCMSContent(response);
					}
				},
				(error) => {
					observer.error(error);
				}
			);
		});
	}

	private populateCMSContent(response: any) {
		const dataSource = 'cms';
		const contentCards: IConfigItem[] = Object.values(this.contentCards);

		contentCards.forEach(contentCard => {
			let contents: any = this.cmsService.getOneCMSContent(response, contentCard.template, contentCard.positionParam);
			if (contents && contents.length > 0) {
				contents = this.formalizeContent(contents, contentCard.positionParam, dataSource);
				contentCard.cmsContent = contents;
				if ((contentCard.tileSource === 'CMS' || contentCard.upeContent === null) && contentCard.cmsContent) {	// contentCard.upeContent === null means no upe content
					//this.dashboardService.onlineCardContent[contentCard.cardId] = contentCard.cmsContent;
					if (contentCard.cardId === 'positionA'
						&& !this.cmsHeroBannerChanged(contentCard.displayContent,  contentCard.cmsContent)) {
						return;	// don't need to update, developer said this could present the refresh of positionA
					}
					contentCard.displayContent = contentCard.cmsContent;
					this.contentCards[contentCard.cardId].displayContent =  contentCard.displayContent;
				} // else do nothing
			} // else do nothing
		});
	}

	private formalizeContent(contents, position, dataSource) {
		contents.forEach(content => {
			if (content.BrandName) {
				content.BrandName = content.BrandName.split('|')[0]; // formalize BrandName
			}
			content.DataSource = dataSource;
		});

		if (position === 'position-A') {
			return contents.map((record) => {
				return {
					albumId: 1,
					id: record.Id,
					source: record.Title,
					title: record.Description,
					url: record.FeatureImage,
					ActionLink: record.ActionLink,
					ActionType: record.ActionType,
					OverlayTheme: record.OverlayTheme ? record.OverlayTheme : '',
					DataSource: record.DataSource
				};
			});

		} else {
			return contents[0];
		}
	}

	cmsHeroBannerChanged(bannerItems1, bannerItems2) {
		let result = false;
		if ((bannerItems1 && !bannerItems2)
			|| (!bannerItems1 && bannerItems2)) {
			result = true;
		} else if (bannerItems1 && bannerItems2) {
			if (bannerItems1.length !== bannerItems2.length) {
				result = true;
			} else {
				for (let i = 0; i < bannerItems1.length; i++) {
					if ((bannerItems1[i] && !bannerItems2[i])
						|| (!bannerItems1[i] && bannerItems2[i])) {
						result = true;
						break;
					} else if (bannerItems1[i] && bannerItems2[i]
						&& JSON.stringify(bannerItems2[i]) !== JSON.stringify(bannerItems1[i])) {
						result = true;
						break;
					}
				}
			}
		}
		return result;
	}

	ngOnDestroy() {
	}

}
