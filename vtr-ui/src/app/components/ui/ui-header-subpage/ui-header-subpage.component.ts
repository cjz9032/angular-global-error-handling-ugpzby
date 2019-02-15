import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'vtr-ui-header-subpage',
	templateUrl: './ui-header-subpage.component.html',
	styleUrls: ['./ui-header-subpage.component.scss']
})

export class UiHeaderSubpageComponent implements OnInit {

	@Input() title: string;
	@Input() caption: string;
	@Input() menuTitle: string;
	@Input() items: any[];

	constructor() { }

	ngOnInit() {
	}

	menuItemClick(event, item) {
		
	}

}
