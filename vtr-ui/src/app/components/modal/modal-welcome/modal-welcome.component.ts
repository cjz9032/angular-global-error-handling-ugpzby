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
import { MetricService } from 'src/app/services/metric/metric.service';
import { GamingScenario } from 'src/app/enums/gaming-scenario.enum';
import { InitializerService } from 'src/app/services/initializer/initializer.service';

@Component({
	selector: 'vtr-modal-welcome',
	templateUrl: './modal-welcome.component.html',
	styleUrls: [ './modal-welcome.component.scss' ],
	providers: [ TimerService ]
})
export class ModalWelcomeComponent implements OnInit, AfterViewInit, OnDestroy {
	public segmentConst = SegmentConst;
	public gamingScenarios = GamingScenario;
	public vantageToolbarStatus = new FeatureStatus(false, true);
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
	gamingScenario = null;
	allUsageTypes = [
		{
			id: 'personal-use',
			value: this.segmentConst.Consumer,
			textKey: 'welcometutorial.personal',
			image: 'personal-use.jpg',
		},
		{
			id: 'business-use',
			value: this.segmentConst.SMB,
			textKey: 'welcometutorial.business',
			image: 'business-use.jpg',
		},
		{
			id: 'custom-use',
			value: this.segmentConst.Commercial,
			textKey: 'welcometutorial.professional',
			image: 'custom-use.jpg',
		},
	];
	allGamingScenarios = [
		{
			id: 'gaming',
			value: this.gamingScenarios.Gaming,
			textKey: 'welcometutorial.gaming.gamingOnly',
			image: 'gaming-only.jpg',
		},
		{
			id: 'gaming-and-work',
			value: this.gamingScenarios.GamingAndWork,
			textKey: 'welcometutorial.gaming.gamingAndWork',
			image: 'gaming-work.jpg',
		},
		{
			id: 'non-gaming',
			value: this.gamingScenarios.NonGaming,
			textKey: 'welcometutorial.gaming.nonGaming',
			image: 'non-gaming.jpg',
		},
	];
	interests = [];
	hideMoreInterestBtn = false;
	welcomeStart: any = new Date();
	machineInfo: any;

	@Input() tutorialVersion: string;

	@ViewChildren('welcomepage2') welcomepage2: any;
	shouldManuallyFocusPage2 = true;

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
		private userService: UserService,
		private metricService: MetricService,
		private initializerService: InitializerService) {
		this.metrics = shellService.getMetrics();

		this.initMetricOption(shellService);
		deviceService.getMachineInfo().then((val) => {
			this.machineInfo = val;
		});
	}

	async initMetricOption(shellService) {
		const userDeterminePrivacy = this.commonService.getLocalStorageValue(
			LocalStorageKey.UserDeterminePrivacy
		);

		// if user has ever setup the privacy option, the UI should keep it.
		if (userDeterminePrivacy) {
			await this.metricService.metricReady();
			this.privacyPolicy = this.metrics.metricsEnabled;
		} else {
			shellService.getMetricsPolicy((result) => {
				this.privacyPolicy = result;
			});
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
		this.logger.info(`Performance: TutorialPage after view init. ${welcomeUseTime}ms`);

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
			this.logger.info('PageView Event', JSON.stringify(data));
			this.metrics.sendAsync(data);
			this.timerService.start();
			this.page = page;
			this.progress = 49;
			tutorialData = new WelcomeTutorial(1, this.tutorialVersion, false);
			if (this.deviceService.isGaming) {
				this.commonService.setLocalStorageValue(LocalStorageKey.GamingTutorial, tutorialData);
			}
			this.commonService.setLocalStorageValue(LocalStorageKey.WelcomeTutorial, tutorialData);
			this.focusOnModal();
		} else {
			const buttonClickData = {
				ItemType: 'FeatureClick',
				ItemName: 'DONE',
				ItemParent: 'WelcomePage'
			};

			this.metrics.sendAsync(buttonClickData);

			const settingData = {
				ItemType: 'SettingUpdate',
				SettingName: 'Accept Privacy Policy',
				SettingValue: this.privacyPolicy ? 'Enabled' : 'Disabled',
				SettingParent: 'WelcomePage'
			};

			this.metrics.sendAsyncEx(settingData, {
				forced: true
			});

			if(this.vantageToolbarStatus && this.vantageToolbarStatus.available) {
				const toolbarSettingData = {
					ItemType: 'SettingUpdate',
					SettingName: 'Enable Lenovo Vantage Toolbar',
					SettingValue: this.vantageToolbar ? 'Enabled' : 'Disabled',
					SettingParent: 'WelcomePage'
				};

				this.metrics.sendAsync(toolbarSettingData);
			}
			else {
				this.logger.info(`Won't send Vantage toolbar metric for it is not available.`);
			}

			if (this.deviceService.isGaming && this.gamingScenario) {
				const gamingScenarioData = {
					ItemType: 'SettingUpdate',
					SettingName: 'Gaming Usage Scenario',
					SettingValue: this.gamingScenario,
					SettingParent: 'WelcomePage'
				};
				this.metrics.sendAsync(gamingScenarioData);
			}

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
			this.logger.info('PageView Event', JSON.stringify(data));
			this.metrics.sendAsync(data);
			this.userService.sendSilentlyLoginMetric();
			tutorialData = new WelcomeTutorial( 2, this.tutorialVersion, true, this.selfSelectService.usageType, this.selfSelectService.checkedArray);
			// this.commonService.setLocalStorageValue(LocalStorageKey.DashboardOOBBEStatus, true);
			// this.commonService.sendNotification(DeviceMonitorStatus.OOBEStatus, true); // never use this notification
			this.activeModal.close(tutorialData);
			this.selfSelectService.saveConfig(false);
			this.SetVantageToolbar(this.vantageToolbar);
			this.metricService.handleWelcomeDone();
			this.initializerService.initializeAntivirus();
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
		this.logger.info('ModalWelcomeComponent', this.selfSelectService.checkedArray);
		this.logger.info('ModalWelcomeComponent', this.selfSelectService.checkedArray.length);
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

	saveGamingScenario(value) {
		this.gamingScenario = value;
	}

	saveToolbar($event) {
		this.vantageToolbar = $event.target.checked;
	}

	SetVantageToolbar(toolbarStatus) {
		this.logger.info('saveToolbar', toolbarStatus);
		try {
			if (this.powerService.isShellAvailable) {
				this.powerService.setVantageToolBarStatus(toolbarStatus)
					.then((value: boolean) => {
						this.logger.info('setVantageToolBarStatus.then', toolbarStatus);
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
		if (document.querySelectorAll('.interests input[type=checkbox]').length > 7) {
			setTimeout(() => {
				(document.querySelectorAll('.interests input[type=checkbox]')[8] as HTMLElement).focus();
			}, 0);
		}
	}

	ngOnDestroy() {
		// this.commonService.setLocalStorageValue(LocalStorageKey.DashboardOOBBEStatus, true);
		// this.commonService.sendNotification(DeviceMonitorStatus.OOBEStatus, true); // never use this notification
	}

	focusOnModal() {
		(document.querySelector('.welcome-modal-size') as HTMLElement).focus();
	}

	@HostListener('window: focus')
	onFocus(): void {
		this.focusOnModal();
	}

	privacyPolicyClick(event) {
		this.configService.getPrivacyPolicyLink().then(policyLink => {
			window.open(policyLink, '_blank');
		});
		event.stopPropagation();
		event.preventDefault();
	}

}
