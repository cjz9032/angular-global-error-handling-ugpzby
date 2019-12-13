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
	@Input() textId: string;
	@Input() metricsParent: string;
	constructor() { }

	ngOnInit() {
	}

	menuItemClick(event, item) {
		const element = document.querySelector('#' + item.path) as HTMLElement;
		if (element) {
			element.scrollIntoView({ behavior: 'smooth', block: 'center' });
			// Fix for Edge browser
			window.scrollBy(0, -60);
			// fix for VAN-12795 , focus element only when event is key press for narrator to read element text.
			if (event.type !== 'click') {
				const focusElement = element.querySelector('[tabindex = \'0\']') as HTMLElement;
				focusElement.focus();
			}
		}
	}

}
