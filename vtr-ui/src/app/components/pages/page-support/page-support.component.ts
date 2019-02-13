import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'vtr-page-support',
	templateUrl: './page-support.component.html',
	styleUrls: ['./page-support.component.scss']
})
export class PageSupportComponent implements OnInit {

	title = 'Get Support';


  qAndA = {
    title: 'Q&A\'s for your machine',
    description: 'Description of component',
    data: [
      { icon: 'fa-plane', question: 'Reduced batterylife working outside.' },
      { icon: 'fa-plane', question: 'Can I use my Ideapad while in an airplane?' },
      { icon: 'fa-edge', question: 'Will the security control scanner damage' },
      { icon: 'fa-amazon', question: 'Reduced batterylife working outside.' },
      { icon: 'fa-envira', question: 'Can I use my Ideapad while in an airplane?' },
      { icon: 'fa-chrome', question: 'Will the security control scanner damage' }
    ]
  }

	constructor() { }

	ngOnInit() {
	}

}
