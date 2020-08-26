import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'vtr-support-detail-article-a',
	templateUrl: './support-detail-article-a.component.html',
	styleUrls: ['./support-detail-article-a.component.scss']
})
export class SupportDetailArticleAComponent implements OnInit {
	@Input() langCode: string;

	constructor() { }

	ngOnInit(): void {
	}

}
