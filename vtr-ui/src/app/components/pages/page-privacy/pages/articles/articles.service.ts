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
		'myths-about-privacy': {
			id: 'myths-about-privacy',
			category: 'breaches',
			title: '5 myths about the definition of privacy you probably believe',
			image: '/assets/images/privacy-tab/articles/Img_Pith_Passwords@2x.png',
			content: page1, // https://markdowntohtml.com/ // https://stackedit.io/app#
		},
		'breaches-privacy-1': {
			id: 'breaches-privacy-1',
			category: 'breaches',
			title: '2 breaches 5 myths of privacy you probably believe',
			image: '/assets/images/privacy-tab/articles/Img_Pith_Passwords@2x.png',
			content: page2, // https://markdowntohtml.com/ // https://stackedit.io/app#
		},
		'breaches-privacy-2': {
			id: 'breaches-privacy-2',
			category: 'breaches',
			title: '3 breaches 5 myths of privacy you probably believe',
			image: '/assets/images/privacy-tab/articles/Img_Pith_Passwords@2x.png',
			content: page3, // https://markdowntohtml.com/ // https://stackedit.io/app#
		},
		'trackers-privacy': {
			id: 'trackers-privacy',
			category: 'trackers',
			title: 'trackers 5 myths of privacy you probably believe',
			image: '/assets/images/privacy-tab/articles/Img_Pith_Passwords@2x.png',
			content: page4, // https://markdowntohtml.com/ // https://stackedit.io/app#
		},
		'trackers-privacy-1': {
			id: 'trackers-privacy-1',
			category: 'trackers',
			title: '2 trackers 5 myths of privacy you probably believe',
			image: '/assets/images/privacy-tab/articles/Img_Pith_Passwords@2x.png',
			content: page5, // https://markdowntohtml.com/ // https://stackedit.io/app#
		},
		'browsers-privacy': {
			id: 'browsers-privacy',
			category: 'non-private-passwords',
			title: 'browsers 5 myths of privacy you probably believe',
			image: '/asset7/images/privacy-tab/articles/Img_Pith_Passwords@2x.png',
			content: page6, // https://markdowntohtml.com/ // https://stackedit.io/app#
		},
		'browsers-privacy-1': {
			id: 'browsers-privacy-1',
			category: 'non-private-passwords',
			title: '2 browsers myths',
			image: '/assets/images/privacy-tab/articles/Img_Pith_Passwords@2x.png',
			content: page7, // https://markdowntohtml.com/ // https://stackedit.io/app#
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
