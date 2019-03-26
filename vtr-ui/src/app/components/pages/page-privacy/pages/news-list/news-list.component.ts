import { Component, OnInit } from '@angular/core';
import { NewsService } from '../../common-services/news/news.service';

@Component({
	selector: 'vtr-news-list',
	templateUrl: './news-list.component.html',
	styleUrls: ['./news-list.component.scss']
})
export class NewsListComponent implements OnInit {
	news = [];

	constructor(private newsService: NewsService) {
	}

	ngOnInit() {
		this.news = this.newsService.news;
	}

}
