import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, Input, HostListener } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WelcomeTutorial } from 'src/app/data-models/common/welcome-tutorial.model';
import { VantageShellService } from '../../../services/vantage-shell/vantage-shell.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { CommonService } from 'src/app/services/common/common.service';
import { DeviceMonitorStatus } from 'src/app/enums/device-monitor-status.enum';
import { TimerService } from 'src/app/services/timer/timer.service';
import { DeviceService } from 'src/app/services/device/device.service';
import { UserService } from 'src/app/services/user/user.service';
import { SelfSelectService, SegmentConst } from 'src/app/services/self-select/self-select.service';
import { ConfigService } from 'src/app/services/config/config.service';
import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';
import { PowerService } from 'src/app/services/power/power.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { EMPTY } from 'rxjs';
import { LanguageService } from 'src/app/services/language/language.service';

@Component({
	selector: 'vtr-modal-welcome',
	templateUrl: './modal-welcome.component.html',
	styleUrls: [ './modal-welcome.component.scss' ],
	providers: [ TimerService ]
})
export class ModalWelcomeComponent implements OnInit, AfterViewInit, OnDestroy {
	public segmentConst = SegmentConst;
	public vantageToolbarStatus = new FeatureStatus(false, true);
	public direction = 'ltr';
	progress = 49;
	isInterestProgressChanged = false;
	page = 1;
	privacyPolicy = true;
	vantageToolbar = true;
	metrics: any;
	data: any = {
		page2: {
			title: '',
			subtitle: '',
		}
	};
	usageType = null;
	interests = [];
	hideMoreInterestBtn = false;
	welcomeStart: any = new Date();
	machineInfo: any;

	@Input() tutorialVersion: string;

	@ViewChildren('interestChkboxs') interestChkboxs: any;
	@ViewChildren('welcomepage2') welcomepage2: any;
	shouldManuallyFocusPage2 = true;
	shouldManuallyFocusMoreInterest = false;

	constructor(
		private configService: ConfigService,
		private languageService: LanguageService,
		public deviceService: DeviceService,
		public powerService: PowerService,
		private logger: LoggerService,
		public activeModal: NgbActiveModal,
		shellService: VantageShellService,
		public commonService: CommonService,
		public selfSelectService: SelfSelectService,
		private timerService: TimerService,
		private userService: UserService) {
		this.metrics = shellService.getMetrics();
		this.privacyPolicy = this.metrics.metricsEnabled;
		const self = this;
		shellService.getMetricsPolicy((result) => {
			self.privacyPolicy = result;
		});
		deviceService.getMachineInfo().then((val) => {
			this.machineInfo = val;
		});

		if (this.languageService.currentLanguage.toLowerCase() === 'ar' || this.languageService.currentLanguage.toLowerCase() === 'he' ) {
			this.direction = 'rtl';
		}
	}

	async ngOnInit() {
		this.timerService.start();
		const config = await this.selfSelectService.getConfig();
		this.usageType = config.usageType;
		this.interests = config.interests;
		this.getVantageToolBarCapability();
	}

	ngAfterViewInit() {
		const welcomeEnd: any = new Date();
		const welcomeUseTime = welcomeEnd - this.welcomeStart;
		console.log(`Performance: TutorialPage after view init. ${welcomeUseTime}ms`);
		this.interestChkboxs.changes.subscribe(() => {
			if (this.interestChkboxs.length > 8 && this.shouldManuallyFocusMoreInterest === true) {
				this.interestChkboxs._results[this.interestChkboxs.length - 2].nativeElement.focus();
				this.shouldManuallyFocusPage2 = false;
				this.shouldManuallyFocusMoreInterest = false;
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
		this.metrics.metricsEnabled = this.privacyPolicy === true;
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
			tutorialData = new WelcomeTutorial(1, this.tutorialVersion, false);
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

			const toolbarSettingData = {
				ItemType: 'SettingUpdate',
				SettingName: 'Enable Lenovo Vantage Toolbar',
				SettingValue: this.vantageToolbar ? 'Enabled' : 'Disabled',
				SettingParent: 'WelcomePage'
			};

			this.metrics.sendAsyncEx(toolbarSettingData, {
				forced: true
			});

			const usageData = {
				ItemType: 'SettingUpdate',
				SettingName: 'UsageType',
				SettingValue: this.deviceService.isGaming ? 'Gaming' : this.selfSelectService.usageType,
				SettingParent: 'WelcomePage'
			};
			this.metrics.sendAsync(usageData);

			const interestMetricValue = {};
			this.selfSelectService.checkedArray.forEach(item => {
				interestMetricValue[item] = true;
			});
			const interestData = {
				ItemType: 'SettingUpdate',
				SettingName: 'Interest',
				SettingValue: interestMetricValue,
				SettingParent: 'WelcomePage'
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
			this.userService.sendSilentlyLoginMetric();
			tutorialData = new WelcomeTutorial( 2, this.tutorialVersion, true, this.selfSelectService.usageType, this.selfSelectService.checkedArray);
			// this.commonService.setLocalStorageValue(LocalStorageKey.DashboardOOBBEStatus, true);
			// this.commonService.sendNotification(DeviceMonitorStatus.OOBEStatus, true); // never use this notification
			this.activeModal.close(tutorialData);
			this.selfSelectService.saveConfig(true);
			this.SetVantageToolbar(this.vantageToolbar);
		}
		this.page = ++page;
	}

	private async getVantageToolBarCapability() {
		if (this.deviceService.isArm || this.deviceService.isSMode) {
			return;
		}
		await this.getVantageToolBarStatus();
	}

	private async getVantageToolBarStatus() {
		try {
			if (this.powerService.isShellAvailable) {
				const featureStatus = await this.powerService.getVantageToolBarStatus();
				this.logger.info('getVantageToolBarStatus.then', featureStatus);
				this.vantageToolbarStatus = featureStatus;
			}
		} catch (error) {
			this.logger.error('getVantageToolBarStatus', error.message);
			return EMPTY;
		}
	}

	toggle($event, value) {
		if ($event.target.checked) {
			this.selfSelectService.checkedArray.push(value);
		} else {
			this.selfSelectService.checkedArray.splice(this.selfSelectService.checkedArray.indexOf(value), 1);
		}
		console.log(this.selfSelectService.checkedArray);
		console.log(this.selfSelectService.checkedArray.length);
		if (!this.isInterestProgressChanged) {
			this.progress += 16;
			this.isInterestProgressChanged = true;
		} else if (this.selfSelectService.checkedArray.length === 0) {
			this.progress -= 16;
			this.isInterestProgressChanged = false;
		}
	}

	onKeyPress($event) {
		if ($event.keyCode === 13) {
			$event.target.click();
			this.shouldManuallyFocusMoreInterest = true;
		}
	}

	btnDoneOnKeyPress($event) {
		if ($event.keyCode === 13) {
			this.next(2);
		}
	}

	saveUsageType(value) {
		if (this.selfSelectService.usageType == null) {
			this.progress += 16;
		}
		this.usageType = value;
		this.selfSelectService.usageType = this.usageType;
	}

	saveToolbar($event) {
		this.vantageToolbar = $event.target.checked;
	}

	SetVantageToolbar(toolbarStatus) {
		console.log('saveToolbar', toolbarStatus);
		try {
			if (this.powerService.isShellAvailable) {
				this.powerService.setVantageToolBarStatus(toolbarStatus)
					.then((value: boolean) => {
						console.log('setVantageToolBarStatus.then', toolbarStatus);
						this.getVantageToolBarStatus();
					}).catch(error => {
						this.logger.error('setVantageToolBarStatus', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('getVantageToolBarStatus', error.message);
			return EMPTY;
		}
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
		this.hideMoreInterestBtn = true;
	}
	ngOnDestroy() {
		// this.commonService.setLocalStorageValue(LocalStorageKey.DashboardOOBBEStatus, true);
		// this.commonService.sendNotification(DeviceMonitorStatus.OOBEStatus, true); // never use this notification
	}


	@HostListener('window: focus')
	onFocus(): void {
		const modal = document.querySelector('.welcome-modal-size') as HTMLElement;
		modal.focus();
	}

	privacyPolicyClick(event) {
		this.configService.getPrivacyPolicyLink().then(policyLink => {
			window.open(policyLink, '_blank');
		});
		event.stopPropagation();
		event.preventDefault();
	}
}
