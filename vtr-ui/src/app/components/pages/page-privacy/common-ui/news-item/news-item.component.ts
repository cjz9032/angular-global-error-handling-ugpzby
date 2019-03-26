import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'vtr-news-item',
	templateUrl: './news-item.component.html',
	styleUrls: ['./news-item.component.scss']
})
export class NewsItemComponent implements OnInit {
	@Input() newsItem: {
		articleLink: string;
		title: string;
		imagePath: string;
	};

	@Input() mode: 'preview' | 'list';

	constructor() {
	}

	ngOnInit() {}

}
