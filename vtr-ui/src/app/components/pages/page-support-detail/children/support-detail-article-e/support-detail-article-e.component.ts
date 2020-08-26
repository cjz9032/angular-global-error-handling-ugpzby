import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'vtr-support-detail-article-e',
	templateUrl: './support-detail-article-e.component.html',
	styleUrls: ['./support-detail-article-e.component.scss']
})
export class SupportDetailArticleEComponent implements OnInit {
	@Input() langCode: string;

	constructor() { }

	ngOnInit(): void {
	}

}
