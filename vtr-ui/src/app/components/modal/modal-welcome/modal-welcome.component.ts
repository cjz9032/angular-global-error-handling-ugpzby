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
		page2: {
			title: 'How will you use it?',
			subtitle: 'Click on one of these uses to tell is how you will use this machine?',
			radioValue: null,
		}
	};

	constructor(public activeModal: NgbActiveModal, public welcomeDatamodel: WelcomeTutorial) {

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
			// this.checkedArray.push(value);
			this.welcomeDatamodel.interests.push(value);
		} else {
			// this.checkedArray.splice(this.checkedArray.indexOf(value), 1);
			this.welcomeDatamodel.interests.splice(this.welcomeDatamodel.interests.indexOf(value), 1);
		}
		console.log(this.welcomeDatamodel.interests.length);
	}

	saveUsageType($event, value){
		if ($event.target.checked) {
			this.welcomeDatamodel.usageType = value;
			console.log(this.welcomeDatamodel.usageType);
		}

	}
	onTutorialClose() {
		this.activeModal.dismiss(new WelcomeTutorial(true));
	}

	onTutorialDone() {
		this.welcomeDatamodel.isTutorialCompleted = true;
		this.onTutorialClose();
	}

	savePrivacy($event, value) {
		if ($event.target.checked) {
			this.welcomeDatamodel.isPrivacyPolicy = value;
		}
	}
}
