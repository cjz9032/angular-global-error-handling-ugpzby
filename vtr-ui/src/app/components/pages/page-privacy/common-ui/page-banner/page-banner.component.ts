import { Component, Input } from '@angular/core';

@Component({
	selector: 'vtr-page-banner',
	templateUrl: './page-banner.component.html',
	styleUrls: ['./page-banner.component.scss'],
})
export class PageBannerComponent {
	@Input() title: string;
	@Input() text: string;
}
