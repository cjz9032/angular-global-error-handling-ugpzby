import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WelcomeTutorial } from 'src/app/data-models/common/welcome-tutorial.model';
import { VantageShellService } from '../../../services/vantage-shell/vantage-shell.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { CommonService } from 'src/app/services/common/common.service';
import { HttpClient } from '@angular/common/http';
import { DeviceMonitorStatus } from 'src/app/enums/device-monitor-status.enum';

@Component({
	selector: 'vtr-modal-welcome',
	templateUrl: './modal-welcome.component.html',
	styleUrls: ['./modal-welcome.component.scss']
})
export class ModalWelcomeComponent implements OnInit, OnDestroy {
	progress = 49;
	isInterestProgressChanged = false;
	page = 1;
	privacyPolicy: boolean = true;
	checkedArray: string[] = [];
	startTime: number;
	endTime: number;
	metrics: any;
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
		private http:HttpClient,
		public commonService: CommonService) {
		this.startTime = new Date().getTime();
		this.metrics = shellService.getMetrics();
		this.privacyPolicy = this.metrics.metricsEnabled;
		const self = this;
		shellService.getMetricsPolicy((result)=>{
			self.privacyPolicy = result;
			self.metrics.metricsEnabled =  (self.privacyPolicy === true);
		});
	}

	ngOnInit() {
	}

	next(page) {
		this.metrics.metricsEnabled = (this.privacyPolicy === true);
		let tutorialData;
		if (page < 2) {
			this.endTime=new Date().getTime();
			const data = {
				ItemType: 'PageView',
				PageName: 'WelcomePage',
				PageDuration: Math.floor((this.endTime - this.startTime)/1000)
			};
			console.log('PageView Event', JSON.stringify(data));
			this.metrics.sendAsync(data);
			this.startTime=new Date().getTime();
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
				ItemType: 'PageView',
				PageName: 'WelcomePage',
				PageDuration: Math.floor((this.endTime - this.startTime)/1000)
			};
			console.log('PageView Event', JSON.stringify(data));
			this.metrics.sendAsync(data);
			tutorialData = new WelcomeTutorial(2, this.data.page2.radioValue, this.checkedArray);
			// this.commonService.setLocalStorageValue(LocalStorageKey.DashboardOOBBEStatus, true);
			this.commonService.sendNotification(DeviceMonitorStatus.OOBEStatus, true);
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
		if ($event.target.checked) {
			console.log(value);
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
		this.commonService.setLocalStorageValue(LocalStorageKey.UserDeterminePrivacy, true);
	}
	moreInterestClicked() {
		this.interestCopy = this.interests;
		this.hideMoreInterestBtn = true;
	}
	ngOnDestroy() {
		// this.commonService.setLocalStorageValue(LocalStorageKey.DashboardOOBBEStatus, true);
		this.commonService.sendNotification(DeviceMonitorStatus.OOBEStatus, true);
	}
}
