import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, Input, HostListener } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WelcomeTutorial } from 'src/app/data-models/common/welcome-tutorial.model';
import { VantageShellService } from '../../../services/vantage-shell/vantage-shell.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { CommonService } from 'src/app/services/common/common.service';
import { TimerService } from 'src/app/services/timer/timer.service';
import { DeviceService } from 'src/app/services/device/device.service';
import { UserService } from 'src/app/services/user/user.service';
import { SelfSelectService, SegmentConst } from 'src/app/services/self-select/self-select.service';
import { ConfigService } from 'src/app/services/config/config.service';
import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';
import { PowerService } from 'src/app/services/power/power.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { EMPTY } from 'rxjs';
import { MetricService } from 'src/app/services/metric/metrics.service';
import { GamingScenario } from 'src/app/enums/gaming-scenario.enum';
import { InitializerService } from 'src/app/services/initializer/initializer.service';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';
import { DccService } from 'src/app/services/dcc/dcc.service';

@Component({
	selector: 'vtr-modal-welcome',
	templateUrl: './modal-welcome.component.html',
	styleUrls: ['./modal-welcome.component.scss'],
	providers: [TimerService]
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
			id: 'business-use',
			value: this.segmentConst.SMB,
			textKey: 'welcometutorial.segments.smb',
			image: 'assets/images/welcome/business-use.jpg',
		},
		{
			id: 'personal-use',
			value: this.segmentConst.ConsumerBase,
			textKey: 'welcometutorial.segments.consumer',
			image: 'assets/images/welcome/personal-use.jpg',
		},
		{
			id: 'personal-gaming-use',
			value: this.segmentConst.ConsumerGaming,
			textKey: 'welcometutorial.segments.consumerGaming',
			image: 'assets/images/welcome/personal-gaming-use.jpg',
		},
		{
			id: 'personal-education-use',
			value: this.segmentConst.ConsumerEducation,
			textKey: 'welcometutorial.segments.consumerEducation',
			image: 'assets/images/welcome/personal-education-use.jpg',
		}
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
	allGamingFeatures = [
		{ id: 'feature1', label: 'welcometutorial.gaming.gamingFeature1', autoId: 'tutorial_text_list_description_computer' },
		{ id: 'feature2', label: 'welcometutorial.gaming.gamingFeature2', autoId: 'tutorial_text_list_description_performance' },
		{ id: 'feature3', label: 'welcometutorial.gaming.gamingFeature3', autoId: 'tutorial_text_list_description_lighting' },
		{ id: 'feature4', label: 'welcometutorial.gaming.gamingFeature4', autoId: 'tutorial_text_list_description_network_boost' },
		{ id: 'feature5', label: 'welcometutorial.gaming.gamingFeature5', autoId: 'tutorial_text_list_description_auto_close' },
	];
	allCoreFeatures = [
		{ id: 'bullets1', label: 'welcometutorial.bullets1' },
		{ id: 'bullets2', label: 'welcometutorial.bullets2' },
		{ id: 'bullets3', label: 'welcometutorial.bullets3' },
	];
	interests = [];
	hideMoreInterestBtn = false;
	welcomeStart: any = new Date();
	machineInfo: any;

	@Input() tutorialVersion: string;

	constructor(
		private configService: ConfigService,
		public deviceService: DeviceService,
		public powerService: PowerService,
		private logger: LoggerService,
		public activeModal: NgbActiveModal,
		shellService: VantageShellService,
		public commonService: CommonService,
		public selfSelectService: SelfSelectService,
		private timerService: TimerService,
		private userService: UserService,
		public metricService: MetricService,
		private localCacheService: LocalCacheService,
		private initializerService: InitializerService,
		private dccService: DccService
		) {
		this.metrics = shellService.getMetrics();

		this.initMetricOption(shellService);
		deviceService.getMachineInfo().then((val) => {
			this.machineInfo = val;
		});
	}

	async initMetricOption(shellService) {
		if (this.metricService.externalAppMetricsState) {
			this.privacyPolicy = true;
			return;
		}

		const userDeterminePrivacy = this.localCacheService.getLocalCacheValue(
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
		this.interests = this.commonService.cloneObj(config.interests);
		if (this.deviceService.isGaming) {
			this.gamingScenario = GamingScenario.Gaming;
		}
		this.getVantageToolBarCapability();
	}

	ngAfterViewInit() {
		const welcomeEnd: any = new Date();
		const welcomeUseTime = welcomeEnd - this.welcomeStart;
		this.logger.info(`Performance: TutorialPage after view init. ${welcomeUseTime}ms`);
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
				this.localCacheService.setLocalCacheValue(LocalStorageKey.GamingTutorial, tutorialData);
			}
			this.localCacheService.setLocalCacheValue(LocalStorageKey.WelcomeTutorial, tutorialData);
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

			if (this.vantageToolbarStatus && this.vantageToolbarStatus.available) {
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

			this.selfSelectService.saveConfig(
				{ usageType: this.usageType, interests: this.interests },
				false);
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
			this.updateHeaderImage(usageData.SettingValue);
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
			tutorialData = new WelcomeTutorial(2, this.tutorialVersion, true, this.selfSelectService.usageType, this.selfSelectService.checkedArray);
			// this.localCacheService.setLocalCacheValue(LocalStorageKey.DashboardOOBBEStatus, true);
			// this.commonService.sendNotification(DeviceMonitorStatus.OOBEStatus, true); // never use this notification
			this.activeModal.close(tutorialData);
			this.SetVantageToolbar(this.vantageToolbar);
			this.metricService.onWelcomePageDone();
			this.initializerService.initializeAntivirus();
		}
		this.page = ++page;
	}

	private updateHeaderImage(segment: SegmentConst) {
		if (segment === SegmentConst.SMB) {
			this.dccService.headerBackground = 'assets/images/HeaderImageSmb.png';
		}
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

	toggle($event, item) {
		item.checked = $event.target.checked;
		const checkedArray = this.interests.filter((x) => x.checked === true);
		this.logger.info('ModalWelcomeComponent', checkedArray);
		this.logger.info('ModalWelcomeComponent', checkedArray.length);
		if (!this.isInterestProgressChanged) {
			this.progress += 16;
			this.isInterestProgressChanged = true;
		} else if (checkedArray.length === 0) {
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
		this.localCacheService.setLocalCacheValue(LocalStorageKey.UserDeterminePrivacy, true);
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
		// this.localCacheService.setLocalCacheValue(LocalStorageKey.DashboardOOBBEStatus, true);
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
