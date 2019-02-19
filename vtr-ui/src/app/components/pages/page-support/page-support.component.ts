import { Component, OnInit } from '@angular/core';
import { MockService } from '../../../services/mock/mock.service';

@Component({
	selector: 'vtr-page-support',
	templateUrl: './page-support.component.html',
	styleUrls: ['./page-support.component.scss']
})
export class PageSupportComponent implements OnInit {

	title = 'Get Support';
	searchWords = ''

	constructor(
		public mockService: MockService
	) { }

	ngOnInit() {
	}

	search(words: string) {
		this.searchWords = words
	}

}
