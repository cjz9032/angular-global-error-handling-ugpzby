import { Injectable } from '@angular/core';
import * as page1 from './pages/article1a.html';
import * as page2 from './pages/article2.html';

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
		'myths-about-privacy1': {
			id: 'myths-about-privacy1',
			title: '5 myths about the definition of privacy you probably believe',
			image: '/assets/images/privacy-tab/articles/Img_Pith_Passwords@2x.png',
			content: page2, // https://markdowntohtml.com/ // https://stackedit.io/app#
		},
	};

	constructor() {
	}
}
