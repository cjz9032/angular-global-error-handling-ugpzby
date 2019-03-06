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
	public scanSteps = [
		{text: 'Enter your email', subtext: 'We’ll search the internet and the dark web for your info'},
		{text: 'Verify it’s you', subtext: 'Check your email for a verification code'},
		{text: 'See your privacy level', subtext: 'Find out if you have control of your privacy online.'}
	]
}
