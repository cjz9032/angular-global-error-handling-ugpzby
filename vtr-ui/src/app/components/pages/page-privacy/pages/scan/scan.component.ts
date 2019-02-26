import { Component } from '@angular/core';

@Component({
	templateUrl: './scan.component.html',
	styleUrls: ['./scan.component.scss']
})
export class ScanComponent {
	// static Data for html
	public pageBannerData = {
		title: 'Take back control over your privacy',
		text: 'A simple comprehensive app that lets you share what you want or keep things private for each site you visit or transact with.',
		image_url: '/assets/images/privacy-tab/banner.png',
	};
}
