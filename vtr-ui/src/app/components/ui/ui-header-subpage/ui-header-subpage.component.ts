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
		const element = document.querySelector('#' + item.path);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth', block: 'center' });
			// Fix for Edge browser
			window.scrollBy(0, -60);
		}
	}

}
