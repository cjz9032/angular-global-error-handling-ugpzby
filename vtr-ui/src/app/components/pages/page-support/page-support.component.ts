import { Component, OnInit } from '@angular/core';
// import { ArticlesService } from '../../../services/articles/articles.service';
import { MockService } from '../../../services/mock/mock.service';


@Component({
	selector: 'vtr-page-support',
	templateUrl: './page-support.component.html',
	styleUrls: ['./page-support.component.scss']
})
export class PageSupportComponent implements OnInit {

	title = 'Get Support';
	searchWords = '';
	articles: any;

	constructor(
		// public articlesService: ArticlesService,
		public mockService: MockService,
	) {
		// this.getArticles();
	}

	ngOnInit() {
	}

	search(words: string) {
		this.searchWords = words;
	}

	// getArticles() {
	// 	this.articlesService.getArticles()
	// 		.subscribe((data) => {
	// 			console.log(data);
	// 			this.articles = data;
	// 		});
	// }

}
