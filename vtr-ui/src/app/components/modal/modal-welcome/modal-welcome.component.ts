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
	privacyPolicy: boolean;
	checkedArray: string[] = [];
	data: any = {
		page2: {
			title: 'How will you use it?',
			subtitle: 'Click on one of these uses to tell is how you will use this machine?',
			radioValue: null,
		}
	};

	constructor(public activeModal: NgbActiveModal) {

	}

	ngOnInit() {
	}

	next(page) {
		if (++page < 3) {
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
		console.log(this.checkedArray.length);
	}

	saveUsageType($event, value) {
		if ($event.target.checked) {
			console.log(value);
		}

	}
	onTutorialClose() {
		this.activeModal.dismiss(new WelcomeTutorial(true));
	}

	onTutorialDone() {
		this.onTutorialClose();
	}

	savePrivacy($event, value) {
		if ($event.target.checked) {
			this.privacyPolicy = value;
		}
	}
}
