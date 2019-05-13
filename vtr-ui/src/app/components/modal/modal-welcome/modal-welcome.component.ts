import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WelcomeTutorial } from 'src/app/data-models/common/welcome-tutorial.model';
@Component({
	selector: 'vtr-modal-welcome',
	templateUrl: './modal-welcome.component.html',
	styleUrls: ['./modal-welcome.component.scss']
})
export class ModalWelcomeComponent implements OnInit {
	progress = 49;
	isInterestProgressChanged = false;
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
	interests = [
		"games", "news", "entertainment", "technology",
		"sports", "arts", "regionalNews", "politics", 
		"music", "science"
	];
	// to show small list. on click of More Interest show all.
	interestCopy = this.interests.slice(0,8);
	hideMoreInterestBtn = false;
	constructor(public activeModal: NgbActiveModal) {

	}

	ngOnInit() {
	}

	next(page) {
		if (page < 2) {
			this.page = page;
			this.progress = 49;
		} else {
			const response = new WelcomeTutorial(true, this.data.page2.radioValue, this.checkedArray);
			this.activeModal.close(response);
		}
		this.page = ++page;;
	}

	toggle($event, value) {
		if ($event.target.checked) {
			this.checkedArray.push(value);
		} else {
			 this.checkedArray.splice(this.checkedArray.indexOf(value), 1);
		}
		console.log(this.checkedArray);
		console.log(this.checkedArray.length);
		if(!this.isInterestProgressChanged) {
			this.progress += 16;
			this.isInterestProgressChanged = true;
		} else if (this.checkedArray.length === 0) {
			this.progress -= 16;
			this.isInterestProgressChanged = false;
		}
	}

	saveUsageType($event, value) {
		if ($event.target.checked) {
			console.log(value);
		}
		if(this.data.page2.radioValue == null) {
			this.progress += 16;
		}
		this.data.page2.radioValue= value
	}
	onTutorialClose() {
		this.activeModal.dismiss(new WelcomeTutorial(true));
	}

	savePrivacy($event, value) {
		if ($event.target.checked) {
			this.privacyPolicy = value;
			this.progress += 17;
		} else {
			this.progress -= 17;
		}
	}
	moreInterestClicked() {
		this.interestCopy = this.interests;
		this.hideMoreInterestBtn = true;
	}
}
