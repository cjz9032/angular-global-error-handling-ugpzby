import { Injectable } from '@angular/core';
import * as page1 from './pages/article1a.html';
import * as page2 from './pages/article1b.html';
import * as page3 from './pages/article1c.html';
import * as page4 from './pages/article2a.html';
import * as page5 from './pages/article2b.html';
import * as page6 from './pages/article3a.html';
import * as page7 from './pages/article3b.html';

export interface Article {
	id: string;
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
			title: '5 myths about the definition of privacy you probably believe',
			image: '/assets/images/privacy-tab/articles/Img_Pith_Passwords@2x.png',
			content: page1, // https://markdowntohtml.com/ // https://stackedit.io/app#
		},
		'breaches-privacy-1': {
			id: 'breaches-privacy-1',
			title: '2 breaches 5 myths of privacy you probably believe',
			image: '/assets/images/privacy-tab/articles/Img_Pith_Passwords@2x.png',
			content: page2, // https://markdowntohtml.com/ // https://stackedit.io/app#
		},
		'breaches-privacy-2': {
			id: 'breaches-privacy-2',
			title: '3 breaches 5 myths of privacy you probably believe',
			image: '/assets/images/privacy-tab/articles/Img_Pith_Passwords@2x.png',
			content: page3, // https://markdowntohtml.com/ // https://stackedit.io/app#
		},
		'trackers-privacy': {
			id: 'trackers-privacy',
			title: 'trackers 5 myths of privacy you probably believe',
			image: '/assets/images/privacy-tab/articles/Img_Pith_Passwords@2x.png',
			content: page4, // https://markdowntohtml.com/ // https://stackedit.io/app#
		},
		'trackers-privacy-1': {
			id: 'trackers-privacy-1',
			title: '2 trackers 5 myths of privacy you probably believe',
			image: '/assets/images/privacy-tab/articles/Img_Pith_Passwords@2x.png',
			content: page5, // https://markdowntohtml.com/ // https://stackedit.io/app#
		},
		'browsers-privacy': {
			id: 'browsers-privacy',
			title: 'browsers 5 myths of privacy you probably believe',
			image: '/asset7/images/privacy-tab/articles/Img_Pith_Passwords@2x.png',
			content: page6, // https://markdowntohtml.com/ // https://stackedit.io/app#
		},
		'browsers-privacy-1': {
			id: 'browsers-privacy-1',
			title: '2 browsers myths',
			image: '/assets/images/privacy-tab/articles/Img_Pith_Passwords@2x.png',
			content: page7, // https://markdowntohtml.com/ // https://stackedit.io/app#
		},
	};

	constructor() {
	}
}
