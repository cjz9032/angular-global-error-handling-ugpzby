import { Component, OnInit } from '@angular/core';
import { ArticlesService } from '../../../services/articles/articles.service';
import { MockService } from '../../../services/mock/mock.service';
import { SupportService } from '../../../services/support/support.service';


@Component({
	selector: 'vtr-page-support',
	templateUrl: './page-support.component.html',
	styleUrls: ['./page-support.component.scss']
})
export class PageSupportComponent implements OnInit {

	title = 'Get Support';
	searchWords = '';
	searchCount = 1;
	articles: any;
	warranty: Object;

	constructor(
		public articlesService: ArticlesService,
		public mockService: MockService,
		public supportService: SupportService,
	) {
		// this.getArticles();
		this.getMachineInfo();
	}

	getMachineInfo() {
		this.supportService.getMachineInfo().then((machineInfo) => {
			this.supportService
				// .getWarranty('PC0G9X77')
				.getWarranty(machineInfo.serialnumber)
				.then((warranty) => {
					this.warranty = warranty;
				});
		});
	}

	ngOnInit() {
	}

	search(value: string) {
		this.searchWords = value;
	}

	getArticles() {
		this.articlesService.getArticles()
			.subscribe((data) => {
				console.log(data);
				this.articles = data;
			});
	}

}
