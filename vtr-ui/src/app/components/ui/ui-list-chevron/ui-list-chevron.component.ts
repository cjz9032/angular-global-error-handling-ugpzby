import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'vtr-ui-list-chevron',
	templateUrl: './ui-list-chevron.component.html',
	styleUrls: ['./ui-list-chevron.component.scss']
})

export class UiListChevronComponent implements OnInit {

	@Input() items: any[];

	constructor() { }

	ngOnInit() {
	}

}
