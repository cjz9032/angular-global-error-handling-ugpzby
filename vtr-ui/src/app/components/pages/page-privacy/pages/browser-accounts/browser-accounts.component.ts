import { Component } from '@angular/core';

@Component({
	// selector: 'app-admin',
	templateUrl: './browser-accounts.component.html',
	styleUrls: ['./browser-accounts.component.scss']
})
export class BrowserAccountsComponent {
	// static Data for html
	browserStoredAccountsData = {showDetailAction: 'expand'};
	pageBannerData = {
		title: 'Lenovo Privacy by FigLeaf — free for 14 days',
		text: 'Lenovo Privacy by FigLeaf lets you share what you want or keep things private for each site you visit or transact with. Your email. ' +
			'Payment and billing info. Your location. Even your personal interests. No matter what you do er where you go, you decide your level of privacy.',
		image_url: '/assets/images/privacy-tab/banner.png',
		read_more_link: 'https://figleafapp.com/',
	};
	promoFeaturesData = [
		{
			title: 'Scan foor breaches',
			text: 'Start by finding out if any of your accounts have been part of data breach',
		}, {
			title: 'Block online trackers',
			text: 'Do what you love online without being tracked by advertisers and others',
		}, {
			title: 'Monitor for future breaches',
			text: 'If any of your accounts stored in Lenovo Privacy by FigLeaf are part of a breach, You’ll know about it.',
		}, {
			title: 'Mask your email',
			text: 'Sign up at new sites without giving out your real email address',
		},
	];
	promoArticleData = {
		title: 'What is the risk?',
		text: 'Major web browsers let you store your usernames and passwords for your favorite sites, so you can log in quickly. ' +
			'But these passwords are usually not well encrypted, making your accounts vulnerable to hacking.',
		link_href: 'https://figleafapp.com/',
		image_url: '/assets/images/privacy-tab/default.png'
	};
	promoVideoData = {
		image_url: '/assets/images/privacy-tab/Video.png'
	};
	promoVideoPopupData = {
		title: 'Promo for breached accaunts page',
		video_url: 'https://www.youtube.com/embed/tgbNymZ7vqY'
	};
	LightPrivacyBannerData = {
		title: 'Take back control over your data with Lenovo Privacy',
		text: 'A simple comprehensive app that gives YOU back control over your privacy',
		image_url: '/assets/images/privacy-tab/privacy-search.png',
	};
	commonTexts = {
		title: 'Easy accesible accounts',
		text: 'Major web browsers let you store your usernames and passwords for your favorite sites, so you can log in quickly. But these passwords are usually not well encrypted, making your accounts vulnerable to hacking.'
	};

	constructor() {
	}
}
