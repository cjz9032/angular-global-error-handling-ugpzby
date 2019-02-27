import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'vtr-article-promo',
	templateUrl: './article-promo.component.html',
	styleUrls: ['./article-promo.component.scss']
})
export class ArticlePromoComponent implements OnInit {
	@Input() data: {
		title: string,
		text: string,
		link_href: string,
		image_url: string,
	};

	constructor() {
	}

	ngOnInit() {
	}

}
