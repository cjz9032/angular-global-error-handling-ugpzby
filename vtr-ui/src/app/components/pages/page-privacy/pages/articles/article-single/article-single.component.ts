import { Component, Input, OnInit } from '@angular/core';
import { Article } from '../articles.service';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'vtr-article-single',
	templateUrl: './article-single.component.html',
	styleUrls: ['./article-single.component.scss']
})
export class ArticleSingleComponent implements OnInit {
	@Input() articleData: Article;

	constructor(private route: ActivatedRoute) {
	}

	ngOnInit() {
		const param1 = this.route.snapshot.queryParams['id'];
		console.log('&&&&&&&&&&&&&&&&7 param1 ', param1);
	}

}
