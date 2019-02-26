import { Component } from '@angular/core';

@Component({
	selector: 'vtr-side-bar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
	news = {
		mainTitle: 'Privacy news',
		allArticlesText: 'All news',
		allArticlesLink: 'https://figleafapp.com?all-news=1',
		items: [
			{
				articleLink: 'https://figleafapp.com?all-news=1',
				title: 'Google knows what you are doing online. Should you be worried?',
				imagePath: '/assets/images/privacy-tab/_cube-feature-1.jpg.jpg',
				articleType: 'Privacy News',
				modifyMode: undefined
			},
		]
	};
	tips = {
		mainTitle: 'Privacy tips',
		allArticlesText: 'All tips',
		allArticlesLink: 'https://figleafapp.com?all-tips=1',
		items: [
			{
				articleLink: 'https://figleafapp.com?all-tips=1',
				title: 'Google knows you better than your best friends',
				imagePath: '/assets/images/privacy-tab/_cube-feature-1.jpg.jpg',
				articleType: 'Privacy Tips',
				modifyMode: 'up'
			},
		]
	};
}
