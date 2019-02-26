import { Component, Input } from '@angular/core';

@Component({
	selector: 'vtr-page-banner',
	templateUrl: './page-banner.component.html',
	styleUrls: ['./page-banner.component.scss'],
})
export class PageBannerComponent {
	@Input() data: {title: string, text: string, image_url: string, read_more_link?: string};
}
