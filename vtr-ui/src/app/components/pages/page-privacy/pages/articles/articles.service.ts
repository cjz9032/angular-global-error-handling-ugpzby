import { Injectable } from '@angular/core';
import { RoutersName } from '../../privacy-routing-name';
import { UserDataStateService } from '../../core/services/app-statuses/user-data-state.service';
import { CommsService } from '../../../../../services/comms/comms.service';
import { map, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { PrivacyModule } from '../../privacy.module';

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
		private userDataGetStateService: UserDataStateService,
		private commsService: CommsService,
	) {}

	pagesSettings: {
		[path in RoutersName]: ArticlesByPathSettings
	} = {
		[RoutersName.MAIN]: {
			visible: true,
		},
		[RoutersName.LANDING]: {
			visible: true,
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
			'Lang': 'en',
			'GEO': 'US',
			'OEM': 'Lenovo',
			'OS': 'Windows',
			'Segment': 'SMB',
			'Brand': 'idea',
		};
	}
}
