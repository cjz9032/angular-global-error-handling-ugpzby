import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'vtr-privacy-tip',
	templateUrl: './privacy-tip.component.html',
	styleUrls: ['./privacy-tip.component.scss']
})
export class PrivacyTipComponent implements OnInit {
	@Input() tip: {
		title: string;
		imagePath: string;
		articleLink: string;
	};
	@Input() mode: 'preview' | 'list';

	constructor() {
	}

	ngOnInit() {
	}

}
