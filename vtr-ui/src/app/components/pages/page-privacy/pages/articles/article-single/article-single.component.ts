import { Component, Input, OnInit } from '@angular/core';
import { Article } from '../articles.service';

@Component({
	selector: 'vtr-article-single',
	templateUrl: './article-single.component.html',
	styleUrls: ['./article-single.component.scss']
})
export class ArticleSingleComponent implements OnInit {
	@Input() articleData: Article;

	constructor() {
	}

	ngOnInit() {
	}

}
