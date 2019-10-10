import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WelcomeTutorial } from 'src/app/data-models/common/welcome-tutorial.model';
import { VantageShellService } from '../../../services/vantage-shell/vantage-shell.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { CommonService } from 'src/app/services/common/common.service';
import { DeviceMonitorStatus } from 'src/app/enums/device-monitor-status.enum';
import { TimerService } from 'src/app/services/timer/timer.service';
import {DeviceService}  from 'src/app/services/device/device.service';
import { $ } from 'protractor';

@Component({
	selector: 'vtr-modal-welcome',
	templateUrl: './modal-welcome.component.html',
	styleUrls: ['./modal-welcome.component.scss'],
	providers: [TimerService]
})
export class ModalWelcomeComponent implements OnInit, AfterViewInit, OnDestroy {
	progress = 49;
	isInterestProgressChanged = false;
	page = 1;
	privacyPolicy = true;
	checkedArray: string[] = [];
	metrics: any;
	data: any = {
		page2: {
			title: '',
			subtitle: '',
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
	welcomeStart: any = new Date();
	machineInfo: any;

	@ViewChildren('interestChkboxs') interestChkboxs: any;
	@ViewChildren('welcomepage2') welcomepage2: any;
	shouldManuallyFocusPage2 = true;

	constructor(
		private deviceService: DeviceService,
		public activeModal: NgbActiveModal,
		shellService: VantageShellService,
		public commonService: CommonService,
		private timerService: TimerService) {
		this.metrics = shellService.getMetrics();
		this.privacyPolicy = this.metrics.metricsEnabled;
		const self = this;
		shellService.getMetricsPolicy((result) => {
			self.privacyPolicy = result;
		});
		deviceService.getMachineInfo().then(val => {
			this.machineInfo = val;
		});
	}

	ngOnInit() {
		this.timerService.start();
	}

	ngAfterViewInit() {
		const welcomeEnd: any = new Date();
		const welcomeUseTime = welcomeEnd - this.welcomeStart;
		console.log(`Performance: TutorialPage after view init. ${welcomeUseTime}ms`);
		this.interestChkboxs.changes.subscribe(() => {
			if (this.interestChkboxs.length > 8) {
				this.interestChkboxs._results[this.interestChkboxs.length - 2].nativeElement.focus();
			}
		});

		this.welcomepage2.changes.subscribe(() => {
			if (this.welcomepage2.length > 0 && this.shouldManuallyFocusPage2) {
				this.welcomepage2.first.nativeElement.focus();
				this.shouldManuallyFocusPage2 = false;
			}
		});
	}

	next(page) {
		this.metrics.metricsEnabled = (this.privacyPolicy === true);
		let tutorialData;
		if (page < 2) {
			const data = {
				ItemType: 'PageView',
				PageName: 'WelcomePage',
				PageContext: `page${page}`,
				PageDuration: this.timerService.stop()
			};
			console.log('PageView Event', JSON.stringify(data));
			this.metrics.sendAsync(data);
			this.timerService.start();
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
				ItemType: 'FeatureClick',
				ItemName: 'UsageType',
				ItemValue: this.data.page2.radioValue,
				ItemParent: 'WelcomePage'
			};
			this.metrics.sendAsync(usageData);

			const interestData = {
				ItemType: 'FeatureClick',
				ItemName: 'Interest',
				ItemValue: this.checkedArray,
				ItemParent: 'WelcomePage'
			};
			this.metrics.sendAsync(interestData);

			const data = {
				ItemType: 'PageView',
				PageName: 'WelcomePage',
				PageContext: `page${page}`,
				PageDuration: this.timerService.stop()
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

	onKeyPress($event) {
		if ($event.keyCode === 13) {
			$event.target.click();
		}
	}

	btnDoneOnKeyPress($event){
		if ($event.keyCode === 13) {
			this.next(2);
		}
	}

	saveUsageType(value) {
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
