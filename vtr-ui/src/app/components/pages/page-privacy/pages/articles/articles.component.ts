import { Component, OnInit } from '@angular/core';
import { ArticlesService } from './articles.service';

@Component({
	selector: 'vtr-articles',
	templateUrl: './articles.component.html',
	styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit {

	articles = this.articlesService.articles;

	constructor(private articlesService: ArticlesService) {
	}

	ngOnInit() {
	}
}
