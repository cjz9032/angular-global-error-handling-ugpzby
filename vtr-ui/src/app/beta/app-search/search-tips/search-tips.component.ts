import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'vtr-search-tips',
	templateUrl: './search-tips.component.html',
	styleUrls: ['./search-tips.component.scss'],
})
export class SearchTipsComponent implements OnInit {
	@Input() featureDesc: string;

	constructor() {}

	ngOnInit() {}
}
