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

	constructor(private userDataGetStateService: UserDataGetStateService) {
	}

	articles: Articles = {
		'information-exposed': {
			id: 'information-exposed',
			category: 'FigLeafInstalled',
			title: 'Why finding out if your information is exposed changes everything',
			image: '/assets/images/privacy-tab/tips-bg.png',
			content: page1, // https://markdowntohtml.com/ // https://stackedit.io/app#
		},
		'myths-about-privacy': {
			id: 'myths-about-privacy',
			category: 'FigLeafInstalled',
			title: '5 myths about the definition of privacy you probably believe',
			image: '/assets/images/privacy-tab/tips-bg.png',
			content: page2,
		},
		'tweak-your-internet-privacy': {
			id: 'tweak-your-internet-privacy',
			category: 'FigLeafInstalled',
			title: 'How to tweak your internet privacy settings in 5 easy steps',
			image: '/assets/images/privacy-tab/tips-bg.png',
			content: page3,
		},
		'everything-about-trackers': {
			id: 'everything-about-trackers',
			category: 'ScanPerformed',
			title: 'Everything you need to know about trackers is 20 seconds',
			image: '/assets/images/privacy-tab/tips-bg.png',
			content: page4,
		},
		'what-cookies-reveal': {
			id: 'what-cookies-reveal',
			category: 'ScanPerformed',
			title: 'What cookies reveal about you',
			image: '/assets/images/privacy-tab/tips-bg.png',
			content: page5,
		},
		'guide-to-private-browsing': {
			id: 'guide-to-private-browsing',
			category: 'FirstTimeVisitor',
			title: 'The Ultimate Guide to Private Browsing',
			image: '/assets/images/privacy-tab/tips-bg.png',
			content: page6,
		},
		'companies-hit-by-data-breaches': {
			id: 'companies-hit-by-data-breaches',
			category: 'FirstTimeVisitor',
			title: 'These companies were all hit by data breaches. Do you have accounts with them?',
			image: '/assets/images/privacy-tab/tips-bg.png',
			content: page7,
		},
	};

	pagesSettings: {
		[path in RoutersName]: ArticlesByPathSettings
	} = {
		[RoutersName.MAIN]: {
			visible: true,
		},
		[RoutersName.TIPS]: {
			visible: false,
		},
		[RoutersName.NEWS]: {
			visible: false,
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
		[RoutersName.FAQ]: {
			visible: false,
		},
		[RoutersName.ARTICLES]: {
			visible: false,
		}
	};

	private getUserCategory() {
		return this.userDataGetStateService.getUserDataStatus().appState;
	}

	getFilteredArticlesByUserStatus() {
		return this.filterArticlesByCategory(this.getUserCategory());
	}

	filterArticlesByCategory(category) {
		return Object.keys(this.articles).reduce((acc, articleKey) => {
			const currArticle = this.articles[articleKey];
			if (currArticle.category === category) {
				acc.push(currArticle);
			}
			return acc;
		}, []);
	}
}
