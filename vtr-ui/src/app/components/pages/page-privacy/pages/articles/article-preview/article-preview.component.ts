import { Component, Input, OnInit } from '@angular/core';
import { Article } from '../articles.service';
import { Router } from '@angular/router';

@Component({
	selector: 'vtr-article-preview',
	templateUrl: './article-preview.component.html',
	styleUrls: ['./article-preview.component.scss']
})
export class ArticlePreviewComponent implements OnInit {
	@Input() article: Article;

	constructor(
		private router: Router,
	) {
	}

	ngOnInit() {
	}

	openSingleArticle(id) {
		this.router.navigate(['privacy', 'articles'], {queryParams: {id: id}});
	}

}
