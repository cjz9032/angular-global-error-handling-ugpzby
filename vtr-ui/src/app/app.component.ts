import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { DisplayService } from './services/display/display.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalWelcomeComponent } from './components/modal/modal-welcome/modal-welcome.component';
import { DeviceService } from './services/device/device.service';
import { CommonService } from './services/common/common.service';
import { LocalStorageKey } from './enums/local-storage-key.enum';
import { UserService } from './services/user/user.service';
import { WelcomeTutorial } from './data-models/common/welcome-tutorial.model';
import { NetworkStatus } from './enums/network-status.enum';
import { KeyPress } from './data-models/common/key-press.model';
import { VantageShellService } from './services/vantage-shell/vantage-shell.service';
import { SettingsService } from './services/settings.service';
// import { ModalServerSwitchComponent } from './components/modal/modal-server-switch/modal-server-switch.component'; // VAN-5872, server switch feature
import { AppAction, GetEnvInfo, AppLoaded } from 'src/app/data-models/metrics/events.model';
import * as MetricsConst from 'src/app/enums/metrics.enum';
import { TimerService } from 'src/app/services/timer/timer.service';
import { environment } from 'src/environments/environment';
// import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from './services/language/language.service';
import * as bridgeVersion from '@lenovo/tan-client-bridge/package.json';
import { DeviceInfo } from './data-models/common/device-info.model';
import { DashboardLocalStorageKey } from './enums/dashboard-local-storage-key.enum';
import { AppNotification } from './data-models/common/app-notification.model';
import { TranslationNotification } from './data-models/translation/translation';
import { LoggerService } from './services/logger/logger.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { RoutersName } from './components/pages/page-privacy/privacy-routing-name';
import { AppUpdateService } from './services/app-update/app-update.service';

declare var Windows;
@Component({
	selector: 'vtr-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	providers: [TimerService]
})
export class AppComponent implements OnInit, OnDestroy {
	machineInfo: any;
	public isMachineInfoLoaded = false;
	public isGaming: any = false;
	private metricsClient: any;
	private beta;
	private subscription: Subscription;

	constructor(
		private displayService: DisplayService,
		private router: Router,
		private modalService: NgbModal,
		public deviceService: DeviceService,
		private commonService: CommonService,
		// private translate: TranslateService,
		private userService: UserService,
		private settingsService: SettingsService,
		private vantageShellService: VantageShellService,
		// private activatedRoute: ActivatedRoute,
		private timerService: TimerService,
		private languageService: LanguageService,
		private logger: LoggerService,
		private appUpdateService: AppUpdateService
	) {
		// to check web and js bridge version in browser console
		const win: any = window;
		win.webAppVersion = {
			web: environment.appVersion,
			bridge: bridgeVersion.version
		};

		// check for new version of experience
		this.appUpdateService.checkForUpdates();

		this.subscription = this.commonService.notification.subscribe((notification: AppNotification) => {
			this.onNotification(notification);
		});


		if (vantageShellService.isShellAvailable) {
			this.beta = vantageShellService.getBetaUser();
			this.beta.getBetaUser().then((result) => {
				if (!result) {
					if (!this.commonService.getLocalStorageValue(LocalStorageKey.BetaUser, false)) {
						this.commonService.isBetaUser().then((data) => {
							if (data === 0 || data === 3) {
								this.commonService.setLocalStorageValue(LocalStorageKey.BetaUser, true);
								this.beta.setBetaUser();
							}
						});
					} else {
						this.beta.setBetaUser();
					}
				} else {
					this.commonService.setLocalStorageValue(LocalStorageKey.BetaUser, true);
				}
			});
		}
		this.metricsClient = this.vantageShellService.getMetrics();

		//#endregion


		document.addEventListener('visibilitychange', (e) => {
			if (document.hidden) {
				this.sendAppSuspendMetric();
			} else {
				this.sendAppResumeMetric();
			}
		});


		this.addInternetListener();
	}

	private addInternetListener() {
		const win: any = window;
		if (win.NetworkListener) {
			win.NetworkListener.onnetworkchanged = (state) => {
				this.notifyNetworkState(state);
			};

			if ( win.NetworkListener.isInternetAccess()) {
				this.notifyNetworkState(NetworkStatus.Available);
			} else {
				this.notifyNetworkState(NetworkStatus.Unavailable);
			}
		} else {
			window.addEventListener('online', (e) => {
				this.notifyNetworkState(NetworkStatus.Available);
			}, false);
			window.addEventListener('offline', (e) => {
				this.notifyNetworkState(NetworkStatus.Unavailable);
			}, false);

			if (navigator.onLine) {
				this.notifyNetworkState(NetworkStatus.Available);
			} else {
				this.notifyNetworkState(NetworkStatus.Unavailable);
			}
		}
	}

	private launchWelcomeModal() {
		this.deviceService
			.getIsARM()
			.then((status: boolean) => {
				if (!status || !this.deviceService.isAndroid) {
					const tutorial: WelcomeTutorial = this.commonService.getLocalStorageValue(LocalStorageKey.WelcomeTutorial);
					if (tutorial === undefined && navigator.onLine) {
						this.openWelcomeModal(1);
					} else if (tutorial && tutorial.page === 1 && navigator.onLine) {
						this.openWelcomeModal(2);
					}
				}
			})
			.catch((error) => { });
	}

	private sendFirstRunEvent(machineInfo) {
		let isGaming = null;
		if (machineInfo) {
			isGaming = machineInfo.isGaming;
		}
		this.metricsClient.sendAsyncEx(
			{
				ItemType: 'FirstRun',
				IsGaming: isGaming
			},
			{
				forced: true
			}
		);
	}

	private async sendEnvInfoMetric(isFirstLaunch) {
		let imcVersion = null;
		let hsaSrvInfo: any = {};
		let shellVersion = null;

		if (this.metricsClient.getImcVersion) {
			imcVersion = await this.metricsClient.getImcVersion();
		}

		if (this.metricsClient.getHsaSrvInfo) {
			hsaSrvInfo = await this.metricsClient.getHsaSrvInfo();
		}

		if (typeof Windows !== 'undefined') {
			const packageVersion = Windows.ApplicationModel.Package.current.id.version;
			// packageVersion.major, packageVersion.minor, packageVersion.build, packageVersion.revision
			shellVersion = `${packageVersion.major}.${packageVersion.minor}.${packageVersion.build}`;
		}

		const scale = window.devicePixelRatio || 1;
		const displayWidth = window.screen.width;
		const displayHeight = window.screen.height;
		this.metricsClient.sendAsync(
			new GetEnvInfo({
				imcVersion,
				srvVersion: hsaSrvInfo.vantageSvcVersion,
				shellVersion,
				windowSize: `${Math.floor(displayWidth / 100) * 100}x${Math.floor(displayHeight / 100) * 100}`,
				displaySize: `${Math.floor(displayWidth * scale / 100) * 100}x${Math.floor(
					displayHeight * scale / 100
				) * 100}`,
				scalingSize: scale, // this value would is accurate in edge
				isFirstLaunch
			})
		);
	}

	private sendAppLoadedMetric() {
		const vanStub = this.vantageShellService.getVantageStub();
		this.metricsClient.sendAsync(new AppLoaded(Date.now() - vanStub.navigateTime));
	}

	public sendAppLaunchMetric(lauchType: string) {
		this.timerService.start();
		const stub = this.vantageShellService.getVantageStub();
		this.metricsClient.sendAsync(new AppAction(MetricsConst.MetricString.ActionOpen, stub.launchParms, stub.launchType, 0));
	}

	public sendAppResumeMetric() {
		this.timerService.start(); // restart timer
		const stub = this.vantageShellService.getVantageStub();
		this.metricsClient.sendAsync(new AppAction(MetricsConst.MetricString.ActionResume, stub.launchParms, stub.launchType, 0));
	}

	public sendAppSuspendMetric() {
		const duration = this.timerService.stop();
		const stub = this.vantageShellService.getVantageStub();
		this.metricsClient.sendAsync(new AppAction(MetricsConst.MetricString.ActionSuspend, stub.launchParms, stub.launchType, duration));
	}

	openWelcomeModal(page: number) {
		const modalRef = this.modalService.open(ModalWelcomeComponent, {
			backdrop: 'static',
			centered: true,
			windowClass: 'welcome-modal-size'
		});
		modalRef.componentInstance.page = page;
		modalRef.result.then(
			(result: WelcomeTutorial) => {
				// on open
				this.commonService.setLocalStorageValue(LocalStorageKey.WelcomeTutorial, result);
			},
			(reason: WelcomeTutorial) => {
				// on close
				if (reason instanceof WelcomeTutorial) {
					this.commonService.setLocalStorageValue(LocalStorageKey.WelcomeTutorial, reason);
				}
			}
		);
		document.getElementById('modal-welcome').parentElement.parentElement.parentElement.parentElement.focus();
	}

	ngOnInit() {
		// session storage is not getting clear after vantage is close.
		// forcefully clearing session storage
		if (this.deviceService.isAndroid) {
			return;
		}
		sessionStorage.clear();
		this.getMachineInfo();

		this.sendAppLaunchMetric('launch');

		// use when deviceService.isArm is set to true
		// todo: enable below line when integrating ARM feature
		// document.getElementById('html-root').classList.add('is-arm');

		const self = this;
		window.onresize = () => {
			self.displayService.calcSize(self.displayService);
		};
		self.displayService.calcSize(self.displayService);

		// When startup try to login Lenovo ID silently (in background),
		//  if user has already logged in before, this call will login automatically and update UI
		if (!this.deviceService.isArm && this.userService.isLenovoIdSupported()) {
			this.userService.loginSilently();
		}

		/********* add this for navigation within a page **************/
		this.router.events.subscribe((s) => {
			if (s instanceof NavigationEnd) {
				const tree = this.router.parseUrl(this.router.url);
				if (tree.fragment) {
					const element = document.querySelector('#' + tree.fragment);
					if (element) {
						element.scrollIntoView(true);
					}
				}
			}
		});

		this.checkIsDesktopOrAllInOneMachine();
		this.settingsService.getPreferenceSettingsValue();
		// VAN-5872, server switch feature
		// this.serverSwitchThis();
	}

	ngOnDestroy() {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
	}


	private getMachineInfo() {
		if (this.deviceService.isShellAvailable) {
			// this.isMachineInfoLoaded = this.isTranslationLoaded();
			return this.deviceService
				.getMachineInfo()
				.then((value: any) => {
					this.commonService.sendNotification('MachineInfo', this.machineInfo);
					this.commonService.setLocalStorageValue(LocalStorageKey.MachineFamilyName, value.family);
					this.commonService.setLocalStorageValue(LocalStorageKey.SubBrand, value.subBrand.toLowerCase());

					this.isMachineInfoLoaded = true;
					this.machineInfo = value;
					this.isGaming = value.isGaming;

					const isLocaleSame = this.languageService.isLocaleSame(value.locale);

					if (!this.languageService.isLanguageLoaded || !isLocaleSame) {
						this.languageService.useLanguageByLocale(value.locale);
						const cachedDeviceInfo: DeviceInfo = { isGamingDevice: value.isGaming, locale: value.locale };
						// update DeviceInfo values in case user switched language
						this.commonService.setLocalStorageValue(DashboardLocalStorageKey.DeviceInfo, cachedDeviceInfo);
					}

					this.setFirstRun(value);

					// if u want to see machineinfo in localstorage
					// just add a key "machineinfo-cache-enable" and set it true
					// then relaunch app you will see the machineinfo in localstorage.
					return value;
				})
				.catch((error) => { });
		} else {
			this.isMachineInfoLoaded = true;
			this.machineInfo = { hideMenus: false };
			if (!this.languageService.isLanguageLoaded) {
				this.languageService.useLanguage();
			}
		}
	}

	private setFirstRun(value: any) {
		try {
			const hadRunApp: boolean = this.commonService.getLocalStorageValue(LocalStorageKey.HadRunApp);
			const appFirstRun = !hadRunApp;
			if (this.deviceService.isShellAvailable) {
				if (appFirstRun) {
					this.commonService.setLocalStorageValue(LocalStorageKey.HadRunApp, true);
					this.sendFirstRunEvent(value);
				}

				this.sendEnvInfoMetric(appFirstRun);
			}
		} catch (e) {
			this.vantageShellService.getLogger().error(JSON.stringify(e));
		}
	}
	private checkIsDesktopOrAllInOneMachine() {
		try {
			if (this.deviceService.isShellAvailable) {
				this.deviceService
					.getMachineType()
					.then((value: any) => {
						this.commonService.setLocalStorageValue(LocalStorageKey.DesktopMachine, value === 4);
						this.commonService.setLocalStorageValue(LocalStorageKey.MachineType, value);
					})
					.catch((error) => { });
			}
		} catch (error) { }
	}

	private notifyNetworkState(state) {
		if (state && state.toString() === NetworkStatus.Available) {
			this.commonService.isOnline = true;
			this.commonService.sendNotification(NetworkStatus.Online, { isOnline: true });
		} else {
			this.commonService.isOnline = false;
			this.commonService.sendNotification(NetworkStatus.Offline, { isOnline: false });
		}
	}

	// VAN-5872, server switch feature
	// private serverSwitchThis() {
	// 	this.activatedRoute.queryParamMap.subscribe((params: ParamMap) => {
	// 		if (params.has('serverswitch')) {
	// 			// retrive from localStorage
	// 			const serverSwitchLocalData = this.commonService.getLocalStorageValue(LocalStorageKey.ServerSwitchKey);
	// 			if (serverSwitchLocalData) {
	// 				// force cms service to use this server parms
	// 				serverSwitchLocalData.forceit = true;
	// 				this.commonService.setLocalStorageValue(LocalStorageKey.ServerSwitchKey, serverSwitchLocalData);

	// 				const langCode = serverSwitchLocalData.language.Value.toLowerCase();
	// 				const allLangs = this.translate.getLangs();
	// 				const currentLang = this.translate.currentLang
	// 					? this.translate.currentLang.toLowerCase()
	// 					: this.translate.defaultLang.toLowerCase();

	// 				// change language only when countrycode or language code changes
	// 				if (allLangs.indexOf(langCode) >= 0 && currentLang !== langCode.toLowerCase()) {
	// 					// this.translate.resetLang('ar');
	// 					// this.languageService.useLanguage(langCode);
	// 					if (langCode.toLowerCase() !== this.translate.defaultLang.toLowerCase()) {
	// 						this.translate.reloadLang(langCode);
	// 					}

	// 					this.translate.use(langCode).subscribe(
	// 						(data) => console.log('@sahinul trans use NEXT'),
	// 						(error) => console.log('@sahinul server switch error ', error),
	// 						() => {
	// 							// Evaluate the translations for QA on language Change
	// 							// this.qaService.setTranslationService(this.translate);
	// 							// this.qaService.setCurrentLangTranslations();
	// 							console.log('@sahinul server switch completed');
	// 						}
	// 					);
	// 				}
	// 			}
	// 		}
	// 	});
	// }

	@HostListener('window:keyup', ['$event'])
	onKeyUp(event: KeyboardEvent) {
		try {
			if (this.deviceService.isShellAvailable) {
				const response = new KeyPress(
					event.key,
					event.keyCode,
					event.location,
					event.ctrlKey,
					event.altKey,
					event.shiftKey
				);
				window.parent.postMessage(response, 'ms-appx-web://e046963f.lenovocompanionbeta/index.html');
			}

			// // VAN-5872, server switch feature
			// if (event.ctrlKey && event.shiftKey && event.keyCode === 67) {
			// 	const serverSwitchModal: NgbModalRef = this.modalService.open(ModalServerSwitchComponent, {
			// 		backdrop: true,
			// 		size: 'lg',
			// 		centered: true,
			// 		windowClass: 'Server-Switch-Modal',
			// 		keyboard: false
			// 	});
			// }
		} catch (error) { }
	}

	@HostListener('window:load', ['$event'])
	onLoad(event) {
		this.sendAppLoadedMetric();
		const scale = 1 / (window.devicePixelRatio || 1);
		const content = `shrink-to-fit=no, width=device-width, initial-scale=${scale}, minimum-scale=${scale}`;
		document.querySelector('meta[name="viewport"]').setAttribute('content', content);
		// VAN-5872, server switch feature
		// when app loads for the 1st time then remove ServerSwitch values
		window.localStorage.removeItem(LocalStorageKey.ServerSwitchKey);
	}

	// Defect fix VAN-2988
	@HostListener('window:keydown', ['$event'])
	disableCtrlACV($event: KeyboardEvent) {
		const eventSource = $event as any;
		if (eventSource.enableCopyAndPaste) {
			return;	// allow copy and paste in search box
		}

		const isPrivacyTab = this.router.parseUrl(this.router.url).toString().includes(RoutersName.PRIVACY);

		if (
			($event.ctrlKey || $event.metaKey) &&
			($event.keyCode === 65 || $event.keyCode === 67 || $event.keyCode === 86) && !isPrivacyTab
		) {
			$event.stopPropagation();
			$event.preventDefault();
		}
	}

	private onNotification(notification: AppNotification) {
		if (notification) {
			switch (notification.type) {
				case TranslationNotification.TranslationLoaded:
					this.logger.info(`AppComponent.onNotification`, notification);
					// launch welcome modal once translation is loaded, meanwhile show spinner from home component
					this.launchWelcomeModal();
					break;
				default:
					break;
			}
		}
	}
}
