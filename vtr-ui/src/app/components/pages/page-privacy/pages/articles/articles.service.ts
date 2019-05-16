import { Injectable } from '@angular/core';
import * as page1 from './pages/article1a.html';
import * as page2 from './pages/article1b.html';
import * as page3 from './pages/article1c.html';
import * as page4 from './pages/article2a.html';
import * as page5 from './pages/article2b.html';
import * as page6 from './pages/article3a.html';
import * as page7 from './pages/article3b.html';
import { RoutersName } from '../../privacy-routing-name';

export interface Article {
	id: string;
	category: 'breaches' | 'trackers' | 'non-private-passwords';
	title: string;
	image: string;
	content: typeof import('.html');
}
export interface Articles {
	[key: string]: Article;
}

@Injectable({
	providedIn: 'root'
})
export class ArticlesService {
	articles: Articles = {
		'information-exposed': {
			id: 'information-exposed',
			category: 'breaches',
			title: 'Why finding out if your information is exposed changes everything',
			image: '/assets/images/privacy-tab/articles/Img_Pith_Passwords@2x.png',
			content: page1, // https://markdowntohtml.com/ // https://stackedit.io/app#
		},
		'myths-about-privacy': {
			id: 'breaches-privacy-1',
			category: 'breaches',
			title: '5 myths about the definition of privacy you probably believe',
			image: '/assets/images/privacy-tab/articles/Img_Pith_Passwords@2x.png',
			content: page2,
		},
		'tweak-your-internet-privacy': {
			id: 'tweak-your-internet-privacy',
			category: 'breaches',
			title: 'How to tweak your internet privacy settings in 5 easy steps',
			image: '/assets/images/privacy-tab/articles/Img_Pith_Passwords@2x.png',
			content: page3,
		},
		'everything-about-trackers': {
			id: 'everything-about-trackers',
			category: 'trackers',
			title: 'Everything you need to know about trackers is 20 seconds',
			image: '/assets/images/privacy-tab/articles/Img_Pith_Passwords@2x.png',
			content: page4,
		},
		'what-cookies-reveal': {
			id: 'what-cookies-reveal',
			category: 'trackers',
			title: 'What cookies reveal about you',
			image: '/assets/images/privacy-tab/articles/Img_Pith_Passwords@2x.png',
			content: page5,
		},
		'guide-to-private-browsing': {
			id: 'guide-to-private-browsing',
			category: 'non-private-passwords',
			title: 'The Ultimate Guide to Private Browsing',
			image: '/asset7/images/privacy-tab/articles/Img_Pith_Passwords@2x.png',
			content: page6,
		},
		'companies-hit-by-data-breaches': {
			id: 'companies-hit-by-data-breaches',
			category: 'non-private-passwords',
			title: 'These companies were all hit by data breaches. Do you have accounts with them?',
			image: '/assets/images/privacy-tab/articles/Img_Pith_Passwords@2x.png',
			content: page7,
		},
	};

	pagesSettings = {
		[RoutersName.MAIN]: {
			visible: true,
			articles: [
				...this.filterBreachesByCategory('breaches'),
				...this.filterBreachesByCategory('trackers'),
				...this.filterBreachesByCategory('non-private-passwords'),
			]
		},
		tips: {
			visible: false,
			articles: [],
		},
		news: {
			visible: false,
			articles: [],
		},
		landing: {
			visible: false,
			articles: [],
		},
		privacy: {
			visible: true,
			articles: [
				...this.filterBreachesByCategory('breaches'),
				...this.filterBreachesByCategory('trackers'),
				...this.filterBreachesByCategory('non-private-passwords'),
			]
		},
		breaches: {
			visible: true,
			articles: this.filterBreachesByCategory('breaches')
		},
		trackers: {
			visible: true,
			articles: this.filterBreachesByCategory('trackers')
		},
		'browser-accounts': {
			visible: true,
			articles: this.filterBreachesByCategory('non-private-passwords')
		},
		faq: {
			visible: false,
			articles: [],
		},
		articles: {
			visible: false,
			articles: [],
		}
	};

	private filterBreachesByCategory(category) {
		return Object.keys(this.articles).reduce((acc, articleKey) => {
			const currArticle = this.articles[articleKey];
			if (currArticle.category === category) {
				acc.push(currArticle);
			}
			return acc;
		}, []);
	}

	constructor() {
	}
}
