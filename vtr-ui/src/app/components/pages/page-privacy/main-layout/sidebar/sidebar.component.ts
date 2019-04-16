import { Component, OnInit } from '@angular/core';
import { NewsService } from '../../common-services/news/news.service';
import { TipsService } from '../../common-services/tips/tips.service';
import { AccessTokenService } from '../../common-services/access-token.service';

@Component({
	selector: 'vtr-side-bar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
	news = {
		mainTitle: 'Privacy news',
		allArticlesText: 'All news',
		allArticlesLink: './news',
		dataType: 'news',
		items: []
	};
	tips = {
		mainTitle: 'Privacy tips',
		allArticlesText: 'All tips',
		allArticlesLink: './tips',
		dataType: 'tips',
		items: []
	};

	constructor(
		private newsService: NewsService,
		private tipsService: TipsService,
		private accessTokenService: AccessTokenService,
	) {
	}

	ngOnInit() {
		this.news.items = this.newsService.news;
		this.tips.items = this.tipsService.tips;
	}

	deleteAccessToken() {
		this.accessTokenService.removeAccessToken();
	}
}
