import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, ParamMap } from '@angular/router';
import { DisplayService } from './services/display/display.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
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
import { ModalServerSwitchComponent } from './components/modal/modal-server-switch/modal-server-switch.component'; // VAN-5872, server switch feature
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
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
import { AppsForYouService } from 'src/app/services/apps-for-you/apps-for-you.service';
import { AppsForYouEnum } from 'src/app/enums/apps-for-you.enum';
import { MetricService } from './services/metric/metric.service';
import { VantageFocusHelper } from 'src/app/services/timer/vantage-focus.helper';
import { AbTestsGenerateConfigService } from './components/pages/page-privacy/core/components/ab-tests/ab-tests-generate-config.service';

declare var Windows;
@Component({
	selector: 'vtr-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
	machineInfo: any;
	public isMachineInfoLoaded = false;
	public isGaming: any = false;
	private beta;
	private subscription: Subscription;
	pageTitle = this.isGaming ? 'gaming.common.narrator.pageTitle.device' : '';
	private totalDuration = 0; // itermittant app duratin will be added to it
	private vantageFocusHelper = new VantageFocusHelper();

	constructor(
		private displayService: DisplayService,
		private router: Router,
		private modalService: NgbModal,
		public deviceService: DeviceService,
		private commonService: CommonService,
		private translate: TranslateService,
		private userService: UserService,
		private settingsService: SettingsService,
		private vantageShellService: VantageShellService,
		private activatedRoute: ActivatedRoute,
		private languageService: LanguageService,
		private logger: LoggerService,
		private appUpdateService: AppUpdateService,
		private appsForYouService: AppsForYouService,
		private metricService: MetricService,
		private abTestsGenerateConfigService: AbTestsGenerateConfigService
	) {
		// to check web and js bridge version in browser console
		const win: any = window;
		win.webAppVersion = {
			web: environment.appVersion,
			bridge: bridgeVersion.version
		};

		this.subscription = this.commonService.notification.subscribe((notification: AppNotification) => {
			this.onNotification(notification);
		});

		this.initIsBeta();

		//#endregion
		window.addEventListener('online', (e) => {
			this.notifyNetworkState();
		}, false);
		window.addEventListener('offline', (e) => {
			this.notifyNetworkState();
		}, false);
		this.notifyNetworkState();
		this.addInternetListener();
		this.vantageFocusHelper.start();
	}

	ngOnInit() {
		// check for update and download it but it will be available in next launch
		this.appUpdateService.checkForUpdatesNoPrompt();
		// active duration
		this.getDuration();
		if (this.deviceService.isAndroid) {
			return;
		}
		// session storage is not getting clear after vantage is close.
		// forcefully clearing session storage
		sessionStorage.clear();

		this.getMachineInfo();
		this.metricService.sendAppLaunchMetric();

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

		if (this.appsForYouService.showLmaMenu()) {
			this.appsForYouService.getAppStatus(AppsForYouEnum.AppGuidLenovoMigrationAssistant);
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
		this.serverSwitchThis();
		this.setRunVersionToRegistry();
		this.abTestsGenerateConfigService.shuffle();
	}

	ngOnDestroy() {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
	}

	private addInternetListener() {
		const win: any = window;
		if (win.NetworkListener) {
			win.NetworkListener.onnetworkchanged = (state) => {
				this.notifyNetworkState();
			};

			this.notifyNetworkState();
		} else {
			window.addEventListener('online', (e) => {
				this.notifyNetworkState();
			}, false);
			window.addEventListener('offline', (e) => {
				this.notifyNetworkState();
			}, false);

			this.notifyNetworkState();
		}
	} // end of addInternetListener

	private launchWelcomeModal() {
		this.deviceService
			.getIsARM()
			.then((status: boolean) => {
				if (!status || !this.deviceService.isAndroid) {
					const tutorial: WelcomeTutorial = this.commonService.getLocalStorageValue(
						LocalStorageKey.WelcomeTutorial
					);
					if (tutorial === undefined && navigator.onLine) {
						this.openWelcomeModal(1);
					} else if (tutorial && tutorial.page === 1 && navigator.onLine) {
						this.openWelcomeModal(2);
					}
				}
			})
			.catch((error) => { });
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
		setTimeout(() => {
			document.getElementById('modal-welcome').parentElement.parentElement.parentElement.parentElement.focus();
		}, 0);
	}

	private initIsBeta() {
		if (this.vantageShellService.isShellAvailable) {
			this.beta = this.vantageShellService.getBetaUser();
			this.deviceService.getIsARM().then((status) => {
				if (!status) {
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
				} else if (!this.commonService.getLocalStorageValue(LocalStorageKey.BetaUser, false)) {
					this.commonService.isBetaUser().then((data) => {
						if (data === 0 || data === 3) {
							this.commonService.setLocalStorageValue(LocalStorageKey.BetaUser, true);
						}
					});
				}
			});
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

					// const isLocaleSame = this.languageService.isLocaleSame(value.locale);

					if (!this.languageService.isLanguageLoaded) {
						this.languageService.useLanguageByLocale(value.locale);
						const cachedDeviceInfo: DeviceInfo = { isGamingDevice: value.isGaming, locale: value.locale };
						// // update DeviceInfo values in case user switched language
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
					this.metricService.sendFirstRunEvent(value);
				}

				this.metricService.sendEnvInfoMetric(appFirstRun);
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

	private notifyNetworkState() {
		this.commonService.isOnline = navigator.onLine;
		if (navigator.onLine) {
			this.commonService.sendNotification(NetworkStatus.Online, { isOnline: navigator.onLine });
		} else {
			this.commonService.sendNotification(NetworkStatus.Offline, { isOnline: navigator.onLine });
		}
	}

	// VAN-5872, server switch feature
	private serverSwitchThis() {
		this.activatedRoute.queryParamMap.subscribe((params: ParamMap) => {
			if (params.has('serverswitch')) {
				// retrive from localStorage
				const serverSwitchLocalData = this.commonService.getLocalStorageValue(LocalStorageKey.ServerSwitchKey);
				if (serverSwitchLocalData) {
					// force cms service to use this server parms
					serverSwitchLocalData.forceit = true;
					this.commonService.setLocalStorageValue(LocalStorageKey.ServerSwitchKey, serverSwitchLocalData);

					const langCode = serverSwitchLocalData.language.Value.toLowerCase();
					const allLangs = this.translate.getLangs();
					const currentLang = this.translate.currentLang
						? this.translate.currentLang.toLowerCase()
						: this.translate.defaultLang.toLowerCase();

					// change language only when countrycode or language code changes
					if (allLangs.indexOf(langCode) >= 0 && currentLang !== langCode.toLowerCase()) {
						// this.translate.resetLang('ar');
						// this.languageService.useLanguage(langCode);
						if (langCode.toLowerCase() !== this.translate.defaultLang.toLowerCase()) {
							this.translate.reloadLang(langCode);
						}

						this.translate.use(langCode).subscribe(
							(data) => console.log('@sahinul trans use NEXT'),
							(error) => console.log('@sahinul server switch error ', error),
							() => {
								// Evaluate the translations for QA on language Change
								// this.qaService.setTranslationService(this.translate);
								// this.qaService.setCurrentLangTranslations();
								// console.log('@sahinul server switch completed');
							}
						);
					}
				}
			}
		});
	}

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
			if (event.ctrlKey && event.shiftKey && event.keyCode === 67) {
				const serverSwitchModal: NgbModalRef = this.modalService.open(ModalServerSwitchComponent, {
					backdrop: true,
					size: 'lg',
					centered: true,
					windowClass: 'Server-Switch-Modal',
					keyboard: false
				});
			}
		} catch (error) { }
	}

	@HostListener('window:load', ['$event'])
	onLoad(event) {
		this.metricService.sendAppLoadedMetric();
		const scale = 1 / (window.devicePixelRatio || 1);
		const content = `shrink-to-fit=no, width=device-width, initial-scale=${scale}, minimum-scale=${scale}`;
		document.querySelector('meta[name="viewport"]').setAttribute('content', content);
		// VAN-5872, server switch feature
		// when app loads for the 1st time then remove ServerSwitch values
		window.localStorage.removeItem(LocalStorageKey.ServerSwitchKey);
	}

	// Defect fix VAN-2988
	@HostListener('window:keydown', ['$event'])
	disableCtrlA($event: KeyboardEvent) {
		const isPrivacyTab = this.router.parseUrl(this.router.url).toString().includes(RoutersName.PRIVACY);

		if (($event.ctrlKey || $event.metaKey) && $event.keyCode === 65 && !isPrivacyTab) {
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

	private setRunVersionToRegistry() {
		setTimeout(() => {
			const runVersion = this.vantageShellService.getShellVersion();
			const regUtil = this.vantageShellService.getRegistryUtil();
			if (runVersion && regUtil) {
				const regPath = 'HKEY_CURRENT_USER\\Software\\Lenovo\\ImController';
				regUtil.queryValue(regPath).then(val => {
					if (!val || (val.keyList || []).length === 0) {
						return;
					}
					regUtil.writeValue(regPath + '\\PluginData\\LenovoCompanionAppPlugin\\AutoLaunch', 'LastRunVersion', runVersion, 'String').then(val => {
						if (val !== true) {
							this.logger.error('failed to write shell run version to registry');
						}
					});
				});
			}
		}, 2000);
	}

	// TESTING ACTIVE DURATION
	private getDuration() {
		const component = this; // value of this is null/undefined inside the funtions
		let isVisible = true; // internal flag, defaults to true
		function onVisible() {
			// prevent double execution
			if (isVisible) {
				return;
			}
			// console.log(' APP is VISIBLE-------------------------------------------------------');
			component.metricService.sendAppResumeMetric();
			// change flag value
			isVisible = true;
		} // end of onVisible
		function onHidden() {
			// prevent double execution
			if (!isVisible) {
				return;
			}
			// console.log(' APP is HIDDEN-------------------------------------------------------');
			component.metricService.sendAppSuspendMetric();
			// change flag value
			isVisible = false;
		} // end of onHidden
		function handleVisibilityChange(forcedFlag) {
			// forcedFlag is a boolean when this event handler is triggered by a
			// focus or blur eventotherwise it's an Event object
			if (typeof forcedFlag === 'boolean') {
				if (forcedFlag) {
					return onVisible();
				}
				return onHidden();
			}
			if (document.hidden) {
				return onHidden();
			}
			return onVisible();
		} // end of handleVisibilityChange
		document.addEventListener('visibilitychange', handleVisibilityChange, false);
		// extra event listeners for better behaviour
		document.addEventListener('focus', () => {
			handleVisibilityChange(true);
		}, false);
		document.addEventListener('blur', () => {
			handleVisibilityChange(false);
		}, false);
		window.addEventListener('focus', () => {
			handleVisibilityChange(true);
		}, false);
		window.addEventListener('blur', () => {
			handleVisibilityChange(false);
		}, false);
	} // END OF DURATION
}
