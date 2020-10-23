import { SelfSelectService } from 'src/app/services/self-select/self-select.service';
import { DOCUMENT } from '@angular/common';
import { Component, OnInit, HostListener, OnDestroy, Inject, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { DisplayService } from './services/display/display.service';
import { NgbModal, NgbModalRef, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { ModalWelcomeComponent } from './components/modal/modal-welcome/modal-welcome.component';
import { DeviceService } from './services/device/device.service';
import { CommonService } from './services/common/common.service';
import { LocalStorageKey } from './enums/local-storage-key.enum';
import { UserService } from './services/user/user.service';
import { WelcomeTutorial } from './data-models/common/welcome-tutorial.model';
import { NetworkStatus } from './enums/network-status.enum';
import { KeyPress } from './data-models/common/key-press.model';
import { VantageShellService } from './services/vantage-shell/vantage-shell.service';
import { SettingsService } from './services/settings/settings.service';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from './services/language/language.service';
import { version } from '@lenovo/tan-client-bridge/package.json';
import { DeviceInfo } from './data-models/common/device-info.model';
import { AppNotification } from './data-models/common/app-notification.model';
import { TranslationNotification } from './data-models/translation/translation';
import { LoggerService } from './services/logger/logger.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { AppsForYouService } from 'src/app/services/apps-for-you/apps-for-you.service';
import { AppsForYouEnum } from 'src/app/enums/apps-for-you.enum';
import { MetricService } from './services/metric/metrics.service';
import { VantageFocusHelper } from 'src/app/services/timer/vantage-focus.helper';
import { SegmentConst } from './services/self-select/self-select.service';
import { NotificationType } from './components/notification/notification.component';
import { StoreRatingService } from './services/store-rating/store-rating.service';
import { UpdateProgress } from './enums/update-progress.enum';
import { HardwareScanProgress } from './modules/hardware-scan/enums/hardware-scan.enum';
import { SecurityAdvisorNotifications } from './enums/security-advisor-notifications.enum';
import { SessionStorageKey } from './enums/session-storage-key-enum';
import { HistoryManager } from './services/history-manager/history-manager.service';
import { SmartPerformanceService } from './services/smart-performance/smart-performance.service';
import { enumSmartPerformance } from './enums/smart-performance.enum';
import { LocalCacheService } from './services/local-cache/local-cache.service';


declare var Windows;
@Component({
	selector: 'vtr-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
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
	public notificationType = NotificationType.Banner;
	isOldScheduleScanDeleted: any;
	@ViewChild('pageContainer', { static: true }) pageContainer: ElementRef;



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
		private appsForYouService: AppsForYouService,
		private metricService: MetricService,
		private ngbTooltipConfig: NgbTooltipConfig,
		private storeRating: StoreRatingService,
		// don't delete historyManager
		private historyManager: HistoryManager,
		private smartPerformanceService: SmartPerformanceService,
		private selfSelectService: SelfSelectService,
		private localCacheService: LocalCacheService,
		@Inject(DOCUMENT) public document: Document
	) {
		this.ngbTooltipConfig.triggers = 'hover';
		this.patchNgbModalOpen();
		// to check web and js bridge version in browser console
		const win: any = window;
		this.shellVersion = this.commonService.getShellVersion();

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

		this.addInternetListener();
		this.vantageFocusHelper.start();
	}

	ngOnInit() {
		if (this.deviceService.isAndroid) {
			return;
		}
		// session storage is not getting clear after vantage is close.
		// forcefully clearing session storage
		sessionStorage.clear();
		this.getMachineInfo();


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

		this.setRunVersionToRegistry();

		if (this.deviceService.isGaming) {
			// Remove focus when the mouse is being used
			document.body.addEventListener('mousedown', () => {
				document.body.classList.remove('focus-enable');
			});

			// Re-enable focus styling when Tab is pressed
			document.body.addEventListener('keydown', (event) => {
				if (event.keyCode === 9) {
					document.body.classList.add('focus-enable');
				}
			});
		}
		this.isOldScheduleScanDeleted = this.localCacheService.getLocalCacheValue(LocalStorageKey.isOldScheduleScanDeleted);
		if (this.isOldScheduleScanDeleted === undefined || this.isOldScheduleScanDeleted === false) {
			this.removeOldSmartPerformanceScheduleScans();
		}
	}

	onDragStart(event: DragEvent): boolean {
		return false;
	}

	onDrop(event: DragEvent): boolean {
		return false;
	}

	ngOnDestroy() {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
	}

	private patchNgbModalOpen() {
		const original = NgbModal.prototype.open;
		// tslint:disable-next-line: only-arrow-functions
		NgbModal.prototype.open = function(): NgbModalRef {
			if (arguments.length > 1 && 'container' in arguments[1] === false) {
				Object.assign(arguments[1], { container: 'vtr-root div' });
			}
			setTimeout(() => {
				const modal: HTMLElement = document.querySelector('.modal');
				if (modal) { modal.focus(); }
			}, 0);
			return original.apply(this, arguments);
		};
	}

	private addInternetListener() {
		const win: any = window;
		if (win.NetworkListener) {
			win.NetworkListener.onnetworkchanged = (state) => {
				this.notifyNetworkState(state.toString() === 'available');
			};
			this.notifyNetworkState(win.NetworkListener.isInternetAccess());
		} else {
			window.addEventListener('online', (e) => {
				this.notifyNetworkState(true);
			}, false);
			window.addEventListener('offline', (e) => {
				this.notifyNetworkState(false);
			}, false);
			this.notifyNetworkState(navigator.onLine);
		}
	}

	private async launchWelcomeModal() {
		if (!this.deviceService.isArm && !this.deviceService.isAndroid) {
			const gamingTutorial: WelcomeTutorial = this.localCacheService.getLocalCacheValue(LocalStorageKey.GamingTutorial);
			let tutorial: WelcomeTutorial = this.localCacheService.getLocalCacheValue(LocalStorageKey.WelcomeTutorial);
			if (this.deviceService.isGaming) {
				this.newTutorialVersion = '3.3.0';
				if (gamingTutorial) {
					tutorial = gamingTutorial;
				} else if (tutorial && tutorial.isDone && tutorial.tutorialVersion === '') {
					tutorial.tutorialVersion = this.newTutorialVersion; // 3.1.6 will save tutorial empty version in gaming
					this.localCacheService.setLocalCacheValue(LocalStorageKey.GamingTutorial, tutorial);
					this.localCacheService.setLocalCacheValue(LocalStorageKey.WelcomeTutorial, tutorial);
				}
			}
			const newTutorialVersion = this.newTutorialVersion;
			let welcomeNeeded = false;
			let pageNumber = 1;
			if ((tutorial === undefined || tutorial.tutorialVersion !== newTutorialVersion) && navigator.onLine) {
				welcomeNeeded = true;
			} else if (tutorial && tutorial.page === 1 && navigator.onLine) {
				welcomeNeeded = true;
				pageNumber = 2;
			}

			if (welcomeNeeded) {
				const externalSettings = await this.getWelcomeNeededExternalSettings();
				if (externalSettings) {
					this.openWelcomeModal(pageNumber, newTutorialVersion);
				} else {
					welcomeNeeded = false;
				}
			}

			this.metricService.onCheckedWelcomePageNeeded(welcomeNeeded);
		}
	}

	async getWelcomeNeededExternalSettings() {
		const cache = this.localCacheService.getLocalCacheValue(LocalStorageKey.ExternalMetricsSettings);
		if (cache) {
			return false;
		} else {
			const [lenovoWelcomeSegment, externalMetricsState] = await Promise.all([this.selfSelectService.getPersonaFromLenovoWelcome(), this.metricService.getExternalMetricsSettings()]);

			if (lenovoWelcomeSegment && externalMetricsState && !this.deviceService.isGaming) {
				this.localCacheService.setLocalCacheValue(LocalStorageKey.ExternalMetricsSettings, true);
				return false;
			}

			return true;
		}
	}

	openWelcomeModal(page: number, tutorialVersion: string) {
		const modalRef = this.modalService.open(ModalWelcomeComponent, {
			backdrop: 'static',
			centered: true,
			ariaLabelledBy: 'welcome-tutorial-page-basic-title',
			windowClass: 'welcome-modal-size'
		});
		modalRef.componentInstance.page = page;
		modalRef.componentInstance.tutorialVersion = tutorialVersion;
		modalRef.result.then(
			(result: WelcomeTutorial) => {
				// on open
				if (this.deviceService.isGaming) {
					this.localCacheService.setLocalCacheValue(LocalStorageKey.GamingTutorial, result);
				}
				this.localCacheService.setLocalCacheValue(LocalStorageKey.WelcomeTutorial, result);
			},
			(reason: WelcomeTutorial) => {
				// on close
				if (reason instanceof WelcomeTutorial) {
					if (this.deviceService.isGaming) {
						this.localCacheService.setLocalCacheValue(LocalStorageKey.GamingTutorial, reason);
					}
					this.localCacheService.setLocalCacheValue(LocalStorageKey.WelcomeTutorial, reason);
				}
			}
		);
		setTimeout(() => {
			(document.querySelector('.welcome-modal-size') as HTMLElement).focus();
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
		this.localCacheService.setLocalCacheValue(LocalStorageKey.DeviceInfo, cachedDeviceInfo);
		this.machineInfo = value;
		this.isMachineInfoLoaded = true;
		this.isGaming = value.isGaming;
		this.commonService.sendNotification('MachineInfo', this.machineInfo);
		if (!this.languageService.isLanguageLoaded || this.languageService.currentLanguage !== value.locale ? value.locale.toLowerCase() : 'en') {
			this.languageService.useLanguageByLocale(value.locale);
		}
		this.localCacheService.setLocalCacheValue(LocalStorageKey.MachineFamilyName, value.family);
		this.localCacheService.setLocalCacheValue(LocalStorageKey.SubBrand, value.subBrand.toLowerCase());

		if (this.metricService.isFirstLaunch) {
			this.metricService.sendFirstRunEvent(value);
		}
		// When startup try to login Lenovo ID silently (in background),
		//  if user has already logged in before, this call will login automatically and update UI
		if (!this.deviceService.isArm && this.userService.isLenovoIdSupported()) {
			this.userService.loginSilently();
		}

		if (this.appsForYouService.showLmaMenu()) {
			this.appsForYouService.getAppStatus(AppsForYouEnum.AppGuidLenovoMigrationAssistant);
		}
	}

	private checkIsDesktopOrAllInOneMachine() {
		if (this.deviceService && this.deviceService.isShellAvailable) {
			this.deviceService.getMachineType();
		}
	}

	private notifyNetworkState(isOnline) {
		this.commonService.isOnline = isOnline;
		this.commonService.sendNotification(isOnline ? NetworkStatus.Online : NetworkStatus.Offline, { isOnline });
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
		} catch (error) { }
	}

	@HostListener('window:load', ['$event'])
	onLoad(event) {
		const scale = 1 / (window.devicePixelRatio || 1);
		const content = `shrink-to-fit=no, width=device-width, initial-scale=${scale}, minimum-scale=${scale}`;
		document.querySelector('meta[name="viewport"]').setAttribute('content', content);
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
									const armTutorialData = new WelcomeTutorial(2, this.newTutorialVersion, true, SegmentConst.ConsumerBase);
									this.localCacheService.setLocalCacheValue(LocalStorageKey.WelcomeTutorial, armTutorialData);
								} else {
									setTimeout(() => {
										this.launchWelcomeModal();
									}, 0);
								}
							}
						}).catch((error) => { });

					this.storeRating.showRatingAsync();
					break;
				case UpdateProgress.UpdateCheckCompleted:
				case UpdateProgress.InstallationComplete:
				case SecurityAdvisorNotifications.WifiSecurityTurnedOn:
					this.logger.info(`store rating should show in next start marked. ${notification.type}`);
					this.storeRating.markPromptRatingNextLaunch(true);
					break;
				case HardwareScanProgress.ScanResponse:
				case HardwareScanProgress.RecoverResponse:
					this.logger.info(`store rating should show in next start marked. ${notification.type}. ${notification.payload ? notification.payload.status : 'null'}`);
					if (notification.payload && notification.payload.status === true) {
						this.storeRating.markPromptRatingNextLaunch(true);
					}
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
	onActivate(component) {
		if (component.constructor.name !== 'HomeComponent' && !this.commonService.getSessionStorageValue(SessionStorageKey.FirstPageLoaded, false)) {
			this.commonService.setSessionStorageValue(SessionStorageKey.FirstPageLoaded, true);
		}
		this.commonService.scrollTop();
	}

	ngAfterViewInit() {
		this.metricService.pageContainer = this.pageContainer;
		this.metricService.onAppInitDone();
	}

	onPageScroll($event) {
		this.metricService.notifyPageScollEvent($event.target);
	}


	private removeOldSmartPerformanceScheduleScans() {
		try {
			const isSubscribed = this.localCacheService.getLocalCacheValue(LocalStorageKey.IsFreeFullFeatureEnabled);
			if (isSubscribed !== undefined && isSubscribed === true) {
				this.unregisterSmartPerformanceScheduleScan(enumSmartPerformance.OLDSCHEDULESCANANDFIX);
			} else {
				this.unregisterSmartPerformanceScheduleScan(enumSmartPerformance.OLDSCHEDULESCAN);
			}
		} catch (err) {
			this.logger.error('app.component.removeOldSmartPerformanceScheduleScans.then', err);
		}
	}

	async unregisterSmartPerformanceScheduleScan(scantype) {
		const payload = { scantype };
		this.logger.info('app.component.unregisterScheduleScan', payload);
		try {
			const res: any = await this.smartPerformanceService.unregisterScanSchedule(payload);
			if (res?.state) {
				this.localCacheService.setLocalCacheValue(LocalStorageKey.isOldScheduleScanDeleted, true);
			}
			this.logger.info('app.component.unregisterScheduleScan.then', res);
		} catch (err) {
			this.logger.error('app.component.unregisterScheduleScan.then', err);
		}
	}
}
