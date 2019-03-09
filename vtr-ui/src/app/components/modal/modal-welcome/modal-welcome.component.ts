import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'vtr-modal-welcome',
	templateUrl: './modal-welcome.component.html',
	styleUrls: ['./modal-welcome.component.scss']
})
export class ModalWelcomeComponent implements OnInit {
	page: number = 1;

	data: any = {
		page1: {
			title: 'Almost There',
			subtitle: 'Just a few more buttons to press beefore we can \n have liftoff. Before we can give you the most optimal experience there are still a few things to setup'
		},
		page2: {
			title: 'How will you use it?',
			subtitle: 'Click on one of these uses to tell is how you will use this machine?',
			radioValue: null
		},
		page3: {
			title: 'What are your interests?',
			subtitle: 'Click on one of these uses to tell is how you will use this machine?',
			buttons: [[{ label: 'GAMES', value: 'games' }, { label: 'NEWS', value: 'news' }, {
				label: 'ENTERTAINMENT',
				value: 'entertainment'
			}, { label: 'ARTS', value: 'arts' }], [{ label: 'TECHNOLOGY', value: 'technology' }, {
				label: 'POLITICS',
				value: 'politics'
			}, { label: 'SPORTS', value: 'sports' }], [{ label: 'REGIONAL NEWS', value: 'regional news' }, {
				label: 'TECHNOLOG',
				value: 'technolog'
			}]
			]
		}
	}

	constructor(public activeModal: NgbActiveModal) {
	}

	next(page) {
		if (++page < 4) {
			this.page = page;
		} else {
			this.activeModal.close();
		}
	}

	ngOnInit() {
	}
}
