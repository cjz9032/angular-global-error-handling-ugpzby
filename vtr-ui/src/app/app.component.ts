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
import { version } from '@lenovo/tan-client-bridge/package.json';
import { DeviceInfo } from './data-models/common/device-info.model';
import { DashboardLocalStorageKey } from './enums/dashboard-local-storage-key.enum';
import { AppNotification } from './data-models/common/app-notification.model';
import { TranslationNotification } from './data-models/translation/translation';
import { LoggerService } from './services/logger/logger.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { AppUpdateService } from './services/app-update/app-update.service';
import { AppsForYouService } from 'src/app/services/apps-for-you/apps-for-you.service';
import { AppsForYouEnum } from 'src/app/enums/apps-for-you.enum';
import { MetricService } from './services/metric/metric.service';
import { TimerServiceEx } from 'src/app/services/timer/timer-service-ex.service';
// import { AppUpdateService } from './services/app-update/app-update.service';
import { VantageFocusHelper } from 'src/app/services/timer/vantage-focus.helper';
import { SegmentConst } from './services/self-select/self-select.service';

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
	private subscription: Subscription;
	pageTitle = this.isGaming ? 'gaming.common.narrator.pageTitle.device' : '';
	private totalDuration = 0; // itermittant app duratin will be added to it
	private vantageFocusHelper = new VantageFocusHelper();
	private isServerSwitchEnabled = true;
	private shellVersion;
	private newTutorialVersion = '3.1.2';

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
		// private appUpdateService: AppUpdateService
	) {
		// to check web and js bridge version in browser console
		const win: any = window;
		this.shellVersion = this.vantageShellService.getShellVersion();

		win.webAppVersion = {
			web: environment.appVersion,
			bridge: version,
			shell: this.shellVersion
		};

		// using error because by default its enabled in all
		this.logger.error('APP VERSION', win.webAppVersion);

		this.subscription = this.commonService.notification.subscribe((notification: AppNotification) => {
			this.onNotification(notification);
		});


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
		// this.appUpdateService.checkForUpdatesNoPrompt();
		if (this.deviceService.isAndroid) {
			return;
		}
		// session storage is not getting clear after vantage is close.
		// forcefully clearing session storage
		sessionStorage.clear();
		this.getMachineInfo();

		this.metricService.sendAppLaunchMetric();

		window.onresize = () => { }; // this line is necessary, please do not remove.

		/********* add this for navigation within a page **************/
		// this.router.events.subscribe((s) => {
		// 	if (s instanceof NavigationEnd) {
		// 		const tree = this.router.parseUrl(this.router.url);
		// 		if (tree.fragment) {
		// 			const element = document.querySelector('#' + tree.fragment);
		// 			if (element) {
		// 				element.scrollIntoView(true);
		// 			}
		// 		}
		// 	}
		// });

		this.checkIsDesktopOrAllInOneMachine();
		this.settingsService.getPreferenceSettingsValue();
		// VAN-5872, server switch feature
		this.isServerSwitchEnabled = (typeof environment !== 'undefined' ? environment.isServerSwitchEnabled : true);
		if (this.isServerSwitchEnabled) {
			this.serverSwitchThis();
		}

		this.setRunVersionToRegistry();
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
		if (!this.deviceService.isArm && !this.deviceService.isAndroid) {
			const gamingTutorial: WelcomeTutorial = this.commonService.getLocalStorageValue(LocalStorageKey.GamingTutorial);
			let tutorial: WelcomeTutorial = this.commonService.getLocalStorageValue(LocalStorageKey.WelcomeTutorial);
			if (this.deviceService.isGaming) {
				if (gamingTutorial) {
					tutorial = gamingTutorial;
				} else if (tutorial && tutorial.isDone && tutorial.tutorialVersion === ''){
					tutorial.tutorialVersion = this.newTutorialVersion;// 3.1.6 will save tutorial empty version in gaming
					this.commonService.setLocalStorageValue(LocalStorageKey.GamingTutorial, tutorial);
					this.commonService.setLocalStorageValue(LocalStorageKey.WelcomeTutorial, tutorial);
				}
			}
			const newTutorialVersion = '3.1.2';
			if ((tutorial === undefined || tutorial.tutorialVersion !== newTutorialVersion) && navigator.onLine) {
				this.openWelcomeModal(1, newTutorialVersion);
			} else if (tutorial && tutorial.page === 1 && navigator.onLine) {
				this.openWelcomeModal(2, newTutorialVersion);
			}
		}
	}

	openWelcomeModal(page: number, tutorialVersion: string) {
		const modalRef = this.modalService.open(ModalWelcomeComponent, {
			backdrop: 'static',
			centered: true,
			windowClass: 'welcome-modal-size'
		});
		modalRef.componentInstance.page = page;
		modalRef.componentInstance.tutorialVersion = tutorialVersion;
		modalRef.result.then(
			(result: WelcomeTutorial) => {
				// on open
				if (this.deviceService.isGaming) {
					this.commonService.setLocalStorageValue(LocalStorageKey.GamingTutorial, result);
				}
				this.commonService.setLocalStorageValue(LocalStorageKey.WelcomeTutorial, result);
			},
			(reason: WelcomeTutorial) => {
				// on close
				if (reason instanceof WelcomeTutorial) {
					if (this.deviceService.isGaming) {
						this.commonService.setLocalStorageValue(LocalStorageKey.GamingTutorial, reason);
					}
					this.commonService.setLocalStorageValue(LocalStorageKey.WelcomeTutorial, reason);
				}
			}
		);
		setTimeout(() => {
			document.getElementById('modal-welcome').parentElement.parentElement.parentElement.parentElement.focus();
		}, 0);
	}

	private async getMachineInfo() {
		if (this.deviceService.isShellAvailable) {
			return this.deviceService
				.getMachineInfo()
				.then((value: any) => {
					this.logger.debug('AppComponent.getMachineInfo received getMachineInfo. is lang loaded: ', this.languageService.isLanguageLoaded);
					this.onMachineInfoReceived(value);
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

	private onMachineInfoReceived(value: any) {
		this.setFontFamilyByLocale(value.locale);
		const cachedDeviceInfo: DeviceInfo = { isGamingDevice: value.isGaming, locale: value.locale };
		this.commonService.setLocalStorageValue(DashboardLocalStorageKey.DeviceInfo, cachedDeviceInfo);
		this.machineInfo = value;
		this.isMachineInfoLoaded = true;
		this.isGaming = value.isGaming;
		this.commonService.sendNotification('MachineInfo', this.machineInfo);
		if (!this.languageService.isLanguageLoaded || this.languageService.currentLanguage !== value.locale ? value.locale.toLowerCase() : 'en') {
			this.languageService.useLanguageByLocale(value.locale);
		}
		this.commonService.setLocalStorageValue(LocalStorageKey.MachineFamilyName, value.family);
		this.commonService.setLocalStorageValue(LocalStorageKey.SubBrand, value.subBrand.toLowerCase());
		this.setFirstRun(value);

		// When startup try to login Lenovo ID silently (in background),
		//  if user has already logged in before, this call will login automatically and update UI
		if (!this.deviceService.isArm && this.userService.isLenovoIdSupported()) {
			this.userService.loginSilently();
		}

		if (this.appsForYouService.showLmaMenu()) {
			this.appsForYouService.getAppStatus(AppsForYouEnum.AppGuidLenovoMigrationAssistant);
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
							(data) => {
								this.setFontFamilyByLocale(langCode);
								this.logger.info('@sahinul trans use NEXT');
							},
							(error) => this.logger.info('@sahinul server switch error ', error),
							() => {
								// Evaluate the translations for QA on language Change
								// this.qaService.setTranslationService(this.translate);
								// this.qaService.setCurrentLangTranslations();
								// this.logger.info('@sahinul server switch completed');
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
			if (this.isServerSwitchEnabled === true && event.ctrlKey && event.shiftKey && event.keyCode === 67) {
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
		const scale = 1 / (window.devicePixelRatio || 1);
		const content = `shrink-to-fit=no, width=device-width, initial-scale=${scale}, minimum-scale=${scale}`;
		document.querySelector('meta[name="viewport"]').setAttribute('content', content);
		// VAN-5872, server switch feature
		// when app loads for the 1st time then remove ServerSwitch values
		window.localStorage.removeItem(LocalStorageKey.ServerSwitchKey);
	}

	@HostListener('window:keydown', ['$event'])
	dialogCtrlA($event: KeyboardEvent) {
		const dialog: HTMLElement = document.querySelector('ngb-modal-window');
		if (dialog && ($event.ctrlKey || $event.metaKey) && $event.keyCode === 65) {
			const activeDom: any = document.activeElement;
			if (activeDom && (
				(activeDom.type === 'textarea' && activeDom.tagName === 'TEXTAREA') ||
				(activeDom.type === 'text' && activeDom.tagName === 'INPUT')
			)) { return; }
			this.selectText(dialog);
			$event.stopPropagation();
			$event.preventDefault();
		}
	}

	selectText(element: any) {
		if ((document.body as any).createTextRange) {
			const range = (document.body as any).createTextRange();
			range.moveToElementText(element);
			range.select();
		} else if (window.getSelection) {
			const selection = window.getSelection();
			const range = document.createRange();
			range.selectNodeContents(element);
			selection.removeAllRanges();
			selection.addRange(range);
		}
	}

	private onNotification(notification: AppNotification) {
		if (notification) {
			switch (notification.type) {
				case TranslationNotification.TranslationLoaded:
					this.logger.info(`AppComponent.onNotification`, notification);
					// launch welcome modal once translation is loaded, meanwhile show spinner from home component
					this.deviceService.getMachineInfo()
						.then((info) => {
							if (info) {
								if (info.cpuArchitecture && info.cpuArchitecture.toUpperCase().trim() === 'ARM64') {
									const armTutorialData = new WelcomeTutorial(2, this.newTutorialVersion, true, SegmentConst.Consumer);
									this.commonService.setLocalStorageValue(LocalStorageKey.WelcomeTutorial, armTutorialData);
								} else {
									setTimeout(() => {
										this.launchWelcomeModal();
									}, 0);
								}
							}
						}).catch((error) => { });
					break;
				default:
					break;
			}
		}
	}

	private setRunVersionToRegistry() {
		setTimeout(() => {
			const runVersion = this.shellVersion;
			const regUtil = this.vantageShellService.getRegistryUtil();
			if (runVersion && regUtil) {
				const regPath = 'HKEY_CURRENT_USER\\Software\\Lenovo\\ImController';
				regUtil.queryValue(regPath).then(val => {
					if (!val || (val.keyList || []).length === 0) {
						return;
					}
					regUtil.writeValue(regPath + '\\PluginData\\LenovoCompanionAppPlugin\\AutoLaunch', 'LastRunVersion', runVersion, 'String').then(val2 => {
						if (val2 !== true) {
							this.logger.error('failed to write shell run version to registry');
						}
					});
				});
			}
		}, 2000);
	}

	private setFontFamilyByLocale(locale: string = 'en') {
		const defaultFontFamily = '"Segoe UI", sans-serif';
		let fontFamily = '';
		switch (locale) {
			case 'zh-hans':
				// simplified chinese: full-stop is like english
				fontFamily = `"Microsoft YaHei UI", ${defaultFontFamily}`;
				break;
			case 'zh-hant':
				// traditional chinese: full-stop is in vertically middle
				fontFamily = `"Microsoft JhengHei UI", ${defaultFontFamily}`;
				break;
			case 'ko':
				fontFamily = `"Malgun Gothic", ${defaultFontFamily}`;
				break;
			case 'ja':
				fontFamily = `"Yu Gothic UI", ${defaultFontFamily}`;
				break;
			default:
				fontFamily = defaultFontFamily;
				break;
		}

		// dynamically add font family on body tag
		document.getElementsByTagName('body')[0].style['font-family'] = fontFamily;
		// ngbTooltip is sending font family, to override it dynamically inject css class
		const style = document.createElement<'style'>('style');
		style.innerHTML = `.tooltip { font-family: ${fontFamily}; }`;
		document.getElementsByTagName('head')[0].appendChild(style);
	}


	// private registerWebWorker() {
	// 	if (typeof Worker !== 'undefined') {
	// 		// Create a new
	// 		const worker = new Worker('./web-worker/app-worker.worker', { type: 'module' });
	// 		worker.onmessage = ({ data }) => {
	// 			this.logger.info(`page got message: ${data}`);
	// 		};
	// 		worker.postMessage('hello');
	// 	} else {
	// 		// Web Workers are not supported in this environment.
	// 		// You should add a fallback so that your program still executes correctly.
	// 	}
	// }
	onActivate() {
		this.commonService.scrollTop();
	}
}
