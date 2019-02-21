import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'vtr-faq',
	templateUrl: './faq.component.html',
	styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

	mainTitle = 'FAQ’s';
	seeMoreText = 'See all';
	seeMoreLink = 'https://figleafapp.com';
	questions = [
		{
			text: 'What is a privacy score?'
		},
		{
			text: 'Is it browser password management safe?'
		},
		{
			text: 'Is privacy the same as security?'
		},
		{
			text: 'What are trackers?'
		},
	];

	constructor() {
	}

	ngOnInit() {
	}

}
