import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WelcomeTutorial } from 'src/app/data-models/common/welcome-tutorial.model';

@Component({
	selector: 'vtr-modal-welcome',
	templateUrl: './modal-welcome.component.html',
	styleUrls: ['./modal-welcome.component.scss']
})
export class ModalWelcomeComponent implements OnInit {

	page = 1;

	checkedArray: string[] = [];

	data: any = {
		page1: {
			title: 'Almost There',
			subtitle: 'Just a few more buttons to press before we can \n have liftoff. Before we can give you the most optimal experience there are still a few things to setup'
		},
		page2: {
			title: 'How will you use it?',
			subtitle: 'Click on one of these uses to tell is how you will use this machine?',
			radioValue: null
		},
		// page3: {
		// 	title: 'What are your interests?',
		// 	subtitle: 'Click on one of these uses to tell is how you will use this machine?',
		// 	buttons: [
		// 		[
		// 			{
		// 				label: 'GAMES',
		// 				value: 'games'
		// 			},
		// 			{
		// 				label: 'NEWS',
		// 				value: 'news'
		// 			},
		// 			{
		// 				label: 'ENTERTAINMENT',
		// 				value: 'entertainment'
		// 			},
		// 			{
		// 				label: 'ARTS',
		// 				value: 'arts'
		// 			}
		// 		],
		// 		[
		// 			{
		// 				label: 'TECHNOLOGY',
		// 				value: 'technology'
		// 			},
		// 			{
		// 				label: 'POLITICS',
		// 				value: 'politics'
		// 			}, {
		// 				label: 'SPORTS',
		// 				value: 'sports'
		// 			}
		// 		],
		// 		[
		// 			{
		// 				label: 'REGIONAL NEWS',
		// 				value: 'regional news'
		// 			}
		// 		]
		// 	]
		// }
	};

	constructor(public activeModal: NgbActiveModal) {
	}

	ngOnInit() {
	}

	next(page) {
		if (++page < 4) {
			this.page = page;
		} else {
			const response = new WelcomeTutorial(true, this.data.page2.radioValue, this.checkedArray);
			this.activeModal.close(response);
		}
	}

	toggle($event, value) {
		if ($event.target.checked) {
			this.checkedArray.push(value);
		} else {
			this.checkedArray.splice(this.checkedArray.indexOf(value), 1);
		}
	}

	public onTutorialClose() {
		this.activeModal.dismiss(new WelcomeTutorial(true));
	}

	public onTutorialMaximise() {
		this.activeModal.dismiss(new WelcomeTutorial(true));
	}

	public onTutorialMinimise() {
		this.activeModal.dismiss(new WelcomeTutorial(true));
	}
}
