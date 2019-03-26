import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class NewsService {
	news = [
		{
			title: 'Google knows you better than your best friends',
			articleLink: 'https://figleafapp.com',
			imagePath: '/assets/images/privacy-tab/tips-bg.png',
		}, {
			title: 'Google knows you better than your best friends',
			articleLink: 'https://figleafapp.com/',
			imagePath: '/assets/images/privacy-tab/_cube-feature-1.jpg.jpg',
		}, {
			title: 'Google knows you better than your best friends',
			articleLink: 'https://figleafapp.com/',
			imagePath: '/assets/images/privacy-tab/_cube-feature-1.jpg.jpg',
		}, {
			title: 'Google knows you better than your best friends',
			articleLink: 'https://figleafapp.com/',
			imagePath: '/assets/images/privacy-tab/_cube-feature-1.jpg.jpg',
		}, {
			title: 'Google knows you better than your best friends',
			articleLink: 'https://figleafapp.com/',
			imagePath: '/assets/images/privacy-tab/_cube-feature-1.jpg.jpg',
		}, {
			title: 'Google knows you better than your best friends',
			articleLink: 'https://figleafapp.com/',
			imagePath: '/assets/images/privacy-tab/tips-bg.png',
		}, {
			title: 'Google knows you better than your best friends',
			articleLink: 'https://figleafapp.com/',
			imagePath: '/assets/images/privacy-tab/tips-bg.png',
		}
	];

	constructor() {
	}
}
