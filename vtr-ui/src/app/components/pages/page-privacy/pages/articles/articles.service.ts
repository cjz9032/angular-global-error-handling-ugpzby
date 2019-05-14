import { Injectable } from '@angular/core';
import * as page from './pages/article1.html';

@Injectable({
	providedIn: 'root'
})
export class ArticlesService {

	articles = {
		'myths-about-privacy': {
			id: 'myths-about-privacy',
			title: '5 myths about the definition of privacy you probably believe',
			image: '/assets/images/privacy-tab/tips-bg.png',
			content: page, // https://markdowntohtml.com/ // https://stackedit.io/app#
		},
	};

	constructor() {
	}
}
