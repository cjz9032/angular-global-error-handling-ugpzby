import { Injectable } from '@angular/core';
import { RoutersName } from '../../privacy-routing-name';
import { UserDataGetStateService } from '../../common/services/user-data-get-state.service';
import { CommsService } from '../../../../../services/comms/comms.service';
import { map, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { PrivacyModule } from '../../privacy.module';
import { CMSService } from 'src/app/services/cms/cms.service';

export interface Article {
	id: string;
	category: 'FigLeafInstalled' | 'ScanPerformed' | 'FirstTimeVisitor';
	title: string;
	image: string;
	content: typeof import('.html');
}

export interface Articles {
	[key: string]: Article;
}

interface ArticlesByPathSettings {
	visible: boolean;
}

@Injectable({
	providedIn: 'root'
})
export class ArticlesService {

	private articlesCache$: Observable<any>;

	constructor(
		private userDataGetStateService: UserDataGetStateService,
		private commsService: CommsService,
		private cmsService: CMSService
	) {}

	pagesSettings: {
		[path in RoutersName]: ArticlesByPathSettings
	} = {
		[RoutersName.MAIN]: {
			visible: true,
		},
		[RoutersName.LANDING]: {
			visible: false,
		},
		[RoutersName.PRIVACY]: {
			visible: true,
		},
		[RoutersName.BREACHES]: {
			visible: true,
		},
		[RoutersName.TRACKERS]: {
			visible: true,
		},
		[RoutersName.BROWSERACCOUNTS]: {
			visible: true,
		},
		[RoutersName.ARTICLES]: {
			visible: false,
		},
		[RoutersName.ARTICLEDETAILS]: {
			visible: false,
		}
	};

	getListOfArticles() {
		if (!this.articlesCache$) {
			this.articlesCache$ = this.commsService.endpointGetCall('/api/v1/features', this.getOptions()).pipe(
				map((response) => response['Results']),
				shareReplay(1)
			);
		}

		return this.articlesCache$;

	}

	getArticle(id) {
		return this.commsService.endpointGetCall(`/api/v1/articles/${id}`, this.getOptions()).pipe(
			map((response) => response['Results'])
		);
	}

	private getOptions() {
		return {
			'Page': 'privacy',
			'Lang': this.cmsService.cmsQueryParams.language,
			'GEO': this.cmsService.cmsQueryParams.region,
			'OEM': this.cmsService.cmsQueryParams.OEM,
			'OS': this.cmsService.cmsQueryParams.OS,
			'Segment': this.cmsService.cmsQueryParams.segment,
			'Brand': 'idea',
		};
	}
}
