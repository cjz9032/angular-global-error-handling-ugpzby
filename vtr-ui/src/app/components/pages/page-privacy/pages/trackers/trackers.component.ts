import { Component } from '@angular/core';

@Component({
	// selector: 'app-admin',
	templateUrl: './trackers.component.html',
	styleUrls: ['./trackers.component.scss']
})
export class TrackersComponent {
	promoVideoData = {
		image_url: '/assets/images/privacy-tab/Video.png'
	};
	promoVideoPopupData = {
		title: 'Promo for breached accaunts page',
		video_url: 'https://www.youtube.com/embed/tgbNymZ7vqY'
	};

	stayPrivateSteps = [
		{
			title: 'Block online trackers',
			text: 'Do what you love online without being tracked by advertisers and others'
		},
		{
			title: 'Mask your email',
			text: 'Sign up at new sites without giving out your real email address'
		},
	];

	pageBannerData = {
		title: 'Lenovo Privacy by FigLeaf — free for 14 days',
		text: 'Lenovo Privacy by FigLeaf lets you share what you want or ' +
			'keep things private for each site you visit or transact with. Your email. ' +
			'Payment and billing info. Your location. Even your personal interests.' +
			' No matter what you do er where you go, you decide your level of privacy.',
		image_url: '/assets/images/privacy-tab/trackers-banner.png',
		read_more_link: 'https://figleafapp.com/',
	};

	constructor() {}

	ngOnInit() {

	}
}
