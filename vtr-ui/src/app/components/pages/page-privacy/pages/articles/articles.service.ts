import { Injectable } from '@angular/core';
import * as page1 from './pages/article1a.html';
import * as page2 from './pages/article1b.html';
import * as page3 from './pages/article1c.html';
import * as page4 from './pages/article2a.html';
import * as page5 from './pages/article2b.html';
import * as page6 from './pages/article3a.html';
import * as page7 from './pages/article3b.html';
import { RoutersName } from '../../privacy-routing-name';
import { UserDataGetStateService } from '../../common/services/user-data-get-state.service';
import { HttpClient } from '@angular/common/http';
import { CommsService } from '../../../../../services/comms/comms.service';
import { map, shareReplay, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TrackersInfo } from '../../feature/tracking-map/services/tracking-map.interface';

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
			const queryOptions = {
				'Page': 'privacy',
				'Lang': 'en',
				'GEO': 'US',
				'OEM': 'Lenovo',
				'OS': 'Windows',
				'Segment': 'SMB',
				'Brand': 'idea',
			};

			this.articlesCache$ = this.commsService.endpointGetCall('/api/v1/features', queryOptions).pipe(
				map((response) => response['Results']),
				shareReplay(1)
			);
		}

		return this.articlesCache$;

	}

	getArticle(id) {
		const queryOptions = {
			'Page': 'privacy',
			'Lang': 'en',
			'GEO': 'US',
			'OEM': 'Lenovo',
			'OS': 'Windows',
			'Segment': 'SMB',
			'Brand': 'idea',
		};

		return this.commsService.endpointGetCall(`/api/v1/articles/${id}`, queryOptions).pipe(
			map((response) => response['Results'])
		);
	}
}
