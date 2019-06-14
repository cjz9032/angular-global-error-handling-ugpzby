import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WelcomeTutorial } from 'src/app/data-models/common/welcome-tutorial.model';
import { VantageShellService } from '../../../services/vantage-shell/vantage-shell.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { CommonService } from 'src/app/services/common/common.service';
@Component({
	selector: 'vtr-modal-welcome',
	templateUrl: './modal-welcome.component.html',
	styleUrls: ['./modal-welcome.component.scss']
})
export class ModalWelcomeComponent implements OnInit, AfterViewInit {
	progress = 49;
	isInterestProgressChanged = false;
	page = 1;
	privacyPolicy: boolean;
	checkedArray: string[] = [];
	startTime: number;
	endTime: number;
	metrics: any;
	image1 = new Image();
	image2 = new Image();
	image3 = new Image();
	isDivVisible = false;
	data: any = {
		page2: {
			title: 'How will you use it?',
			subtitle: 'Click on one of these uses to tell is how you will use this machine?',
			radioValue: null,
		}
	};
	interests = [
		'games', 'news', 'entertainment', 'technology',
		'sports', 'arts', 'regionalNews', 'politics',
		'music', 'science'
	];
	// to show small list. on click of More Interest show all.
	interestCopy = this.interests.slice(0, 8);
	hideMoreInterestBtn = false;
	constructor(public activeModal: NgbActiveModal,
		shellService: VantageShellService,
		public commonService: CommonService) {
		this.startTime = new Date().getTime();
		this.metrics = shellService.getMetrics();
		this.preLoadImage();
	}

	ngOnInit() {
	}

	next(page) {
		this.metrics.metricsEnabled = (this.privacyPolicy === true);
		let tutorialData;
		if (page < 2) {
			this.page = page;
			this.progress = 49;
			tutorialData = new WelcomeTutorial(1, null, null);
			this.commonService.setLocalStorageValue(LocalStorageKey.WelcomeTutorial, tutorialData);
		} else {
			const settingData = {
				ItemType: 'SettingUpdate',
				SettingName: 'Accept Privacy Policy',
				SettingValue: this.privacyPolicy ? 'Enabled' : 'Disabled',
				SettingParent: 'WelcomePage'
			};

			this.metrics.sendAsyncEx(settingData, {
				forced: true
			});

			const usageData = {
				ItemType: 'featureClick',
				ItemName: 'UsageType',
				ItemValue: this.data.page2.radioValue,
				ItemParent: 'WelcomePage'
			};
			this.metrics.sendAsync(usageData);

			const interestData = {
				ItemType: 'featureClick',
				ItemName: 'Interest',
				ItemValue: this.checkedArray,
				ItemParent: 'WelcomePage'
			};
			this.metrics.sendAsync(interestData);

			this.endTime = new Date().getTime();
			const data = {
				PageName: 'WelcomePage',
				PageDuration: (this.endTime - this.startTime)
			};
			console.log('metrics data', JSON.stringify(data));
			this.metrics.sendAsync(data);

			tutorialData = new WelcomeTutorial(2, this.data.page2.radioValue, this.checkedArray);
			this.activeModal.close(tutorialData);
		}
		this.page = ++page;
	}

	toggle($event, value) {
		if ($event.target.checked) {
			this.checkedArray.push(value);
		} else {
			this.checkedArray.splice(this.checkedArray.indexOf(value), 1);
		}
		console.log(this.checkedArray);
		console.log(this.checkedArray.length);
		if (!this.isInterestProgressChanged) {
			this.progress += 16;
			this.isInterestProgressChanged = true;
		} else if (this.checkedArray.length === 0) {
			this.progress -= 16;
			this.isInterestProgressChanged = false;
		}
	}

	saveUsageType($event, value) {
		// console.log("Selected MOD",$event);
		if ($event.target.checked) {
			// console.log(value);
		}
		if (this.data.page2.radioValue == null) {
			this.progress += 16;
		}
		this.data.page2.radioValue = value;
	}

	savePrivacy($event, value) {
		this.privacyPolicy = $event.target.checked;
		if ($event.target.checked) {
			this.progress += 17;
		} else {
			this.progress -= 17;
		}
	}
	moreInterestClicked() {
		this.interestCopy = this.interests;
		this.hideMoreInterestBtn = true;
	}
	ngAfterViewInit(): void {
		this.isDivVisible = true;
	}
	preLoadImage() {
		this.image1.src = './../../../../assets/images/welcome/custom-use.jpg';
		this.image2.src = "./../../../../assets/images/welcome/personal-use.jpg";
		this.image3.src = "./../../../../assets/images/welcome/business-use.jpg";

	}
}
