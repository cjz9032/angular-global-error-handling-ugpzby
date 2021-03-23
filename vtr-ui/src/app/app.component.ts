import { SelfSelectService } from 'src/app/services/self-select/self-select.service';
import { DOCUMENT } from '@angular/common';
import {
	Component,
	OnInit,
	HostListener,
	OnDestroy,
	Inject,
	AfterViewInit,
	ElementRef,
	ViewChild,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Overlay } from '@angular/cdk/overlay';

import { MAT_TOOLTIP_SCROLL_STRATEGY } from '@lenovo/material/tooltip';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@lenovo/material/dialog';

import { DisplayService } from './services/display/display.service';
import { NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
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
import { version } from '@lenovo/tan-client-bridge/package.json';
import { DeviceInfo } from './data-models/common/device-info.model';
import { AppNotification } from './data-models/common/app-notification.model';
import { LoggerService } from './services/logger/logger.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { AppsForYouService } from 'src/app/services/apps-for-you/apps-for-you.service';
import { AppsForYouEnum } from 'src/app/enums/apps-for-you.enum';
import { MetricService } from './services/metric/metrics.service';
import { VantageFocusHelper } from 'src/app/services/timer/vantage-focus.helper';
import { SegmentConst } from './services/self-select/self-select.service';
import { StoreRatingService } from './services/store-rating/store-rating.service';
import { UpdateProgress } from './enums/update-progress.enum';
import { HardwareScanProgress } from './modules/hardware-scan/enums/hardware-scan.enum';
import { SecurityAdvisorNotifications } from './enums/security-advisor-notifications.enum';
import { SessionStorageKey } from './enums/session-storage-key-enum';
import { HistoryManager } from './services/history-manager/history-manager.service';
import { SmartPerformanceService } from './services/smart-performance/smart-performance.service';
import { EnumSmartPerformance } from './enums/smart-performance.enum';
import { LocalCacheService } from './services/local-cache/local-cache.service';
import { MatSnackBar } from '@lenovo/material/snack-bar';
import { PerformanceNotifications } from './enums/performance-notifications.enum';
import { WarrantyService } from './services/warranty/warranty.service';

export const scrollStrategyClose = (overlay: Overlay) => () => overlay.scrollStrategies.close();

const tooltipScrollStrategy = {
	provide: MAT_TOOLTIP_SCROLL_STRATEGY,
	useFactory: scrollStrategyClose,
	deps: [Overlay],
};

@Component({
	selector: 'vtr-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	providers: [tooltipScrollStrategy],
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
	@ViewChild('pageContainer', { static: true }) pageContainer: ElementRef;
	environment = environment;
	private isFirstPageInitialized = false;

	constructor(
		private displayService: DisplayService,
		private router: Router,
		private dialog: MatDialog,
		public deviceService: DeviceService,
		private commonService: CommonService,
		private translate: TranslateService,
		private userService: UserService,
		private settingsService: SettingsService,
		private vantageShellService: VantageShellService,
		private activatedRoute: ActivatedRoute,
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
		private warrantyService: WarrantyService,
		@Inject(DOCUMENT) public document: Document,
		private snackBar: MatSnackBar
	) {
		this.ngbTooltipConfig.triggers = 'hover';
		// to check web and js bridge version in browser console
		const win: any = window;
		this.shellVersion = this.commonService.getShellVersion();

		win.webAppVersion = {
			web: environment.appVersion,
			bridge: version,
			shell: this.shellVersion,
		};

		// using error because by default its enabled in all
		this.logger.error('APP VERSION', win.webAppVersion);

		this.subscription = this.commonService.notification.subscribe(
			(notification: AppNotification) => {
				this.onNotification(notification);
			}
		);

		this.addInternetListener();
		this.vantageFocusHelper.start();
	}

	ngOnInit() {
		this.patchMatDialogOpen();
		if (this.deviceService.isAndroid) {
			return;
		}
		// session storage is not getting clear after vantage is close.
		// forcefully clearing session storage
		sessionStorage.clear();
		this.getMachineInfo();

		window.onresize = () => {}; // this line is necessary, please do not remove.

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

		this.removeOldSmartPerformanceScheduleScans();

		this.storeRating.showRatingAsync();

		this.warrantyService.fetchWarranty();
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

	private patchMatDialogOpen() {
		const original = MatDialog.prototype.open;
		const self = this;
		MatDialog.prototype.open = function openMatDialog(
			template: any,
			config?: MatDialogConfig<any>
		): MatDialogRef<any, any> {
			if (config?.panelClass && !config?.panelClass.includes('modern-preload-modal')) {
				if (
					Array.isArray(config.panelClass) &&
					!config.panelClass.includes('modal-common-responsive')
				) {
					config.panelClass.push('modal-common-responsive');
				} else if (
					!Array.isArray(config.panelClass) &&
					config.panelClass !== 'modal-common-responsive'
				) {
					config.panelClass = config.panelClass.split(' ');
					config.panelClass.push('modal-common-responsive');
				}
			} else if (!config?.panelClass) {
				config = Object.assign(config ?? {}, { panelClass: 'modal-common-responsive' });
			}
			if (self.deviceService?.isGaming) {
				if (config?.panelClass) {
					if (
						Array.isArray(config.panelClass) &&
						!config.panelClass.includes('is-gaming')
					) {
						config.panelClass.push('is-gaming');
					} else if (
						!Array.isArray(config.panelClass) &&
						config.panelClass !== 'is-gaming'
					) {
						config.panelClass = config.panelClass.split(' ');
						config.panelClass.push('is-gaming');
					}
				} else {
					config = Object.assign(config ?? {}, { panelClass: 'is-gaming' });
				}
				if (!config?.hasBackdrop) {
					return original.call(this, template, config);
				}
				if (config?.backdropClass) {
					if (
						Array.isArray(config.backdropClass) &&
						!config.backdropClass.includes('gaming-backdrop')
					) {
						config.backdropClass.push('gaming-backdrop');
					} else if (
						!Array.isArray(config.backdropClass) &&
						config.backdropClass !== 'gaming-backdrop'
					) {
						config.backdropClass = config.backdropClass.split(' ');
						config.backdropClass.push('gaming-backdrop');
					}
				} else {
					config = Object.assign(config ?? {}, { backdropClass: 'gaming-backdrop' });
				}
			}
			return original.call(this, template, config);
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
			window.addEventListener(
				'online',
				(e) => {
					this.notifyNetworkState(true);
				},
				false
			);
			window.addEventListener(
				'offline',
				(e) => {
					this.notifyNetworkState(false);
				},
				false
			);
			this.notifyNetworkState(navigator.onLine);
		}
	}

	private async launchWelcomeModal() {
		if (!this.deviceService.isArm && !this.deviceService.isAndroid) {
			const gamingTutorial: WelcomeTutorial = this.localCacheService.getLocalCacheValue(
				LocalStorageKey.GamingTutorial
			);
			let tutorial: WelcomeTutorial = this.localCacheService.getLocalCacheValue(
				LocalStorageKey.WelcomeTutorial
			);
			if (this.deviceService.isGaming) {
				this.newTutorialVersion = '3.3.0';
				if (gamingTutorial) {
					tutorial = gamingTutorial;
				} else if (tutorial && tutorial.isDone && tutorial.tutorialVersion === '') {
					tutorial.tutorialVersion = this.newTutorialVersion; // 3.1.6 will save tutorial empty version in gaming
					this.localCacheService.setLocalCacheValue(
						LocalStorageKey.GamingTutorial,
						tutorial
					);
					this.localCacheService.setLocalCacheValue(
						LocalStorageKey.WelcomeTutorial,
						tutorial
					);
				}
			}
			const newTutorialVersion = this.newTutorialVersion;
			let welcomeNeeded = false;
			let pageNumber = 1;
			const isOfflineMode = this.checkIsOfflineMode();
			if (
				(tutorial === undefined || tutorial.tutorialVersion !== newTutorialVersion) &&
				(navigator.onLine || !isOfflineMode)
			) {
				welcomeNeeded = true;
			} else if (tutorial && tutorial.page === 1 && (navigator.onLine || !isOfflineMode)) {
				welcomeNeeded = true;
				pageNumber = 2;
			}

			if (welcomeNeeded) {
				const externalSettings = await this.getWelcomeNeededExternalSettings();
				if (externalSettings) {
					this.openWelcomeModal(pageNumber, newTutorialVersion);
				} else {
					welcomeNeeded = false;
					const emptyTutorialData = new WelcomeTutorial(2, this.newTutorialVersion, true);
					this.localCacheService.setLocalCacheValue(
						LocalStorageKey.WelcomeTutorial,
						emptyTutorialData
					);
				}
			}

			this.metricService.onCheckedWelcomePageNeeded(welcomeNeeded);
		}
	}

	private checkIsOfflineMode() {
		const win: any = window;
		let isOffline = true;
		if (win.VantageShellExtension?.MsWebviewHelper?.getInstance()?.isInOfflineMode === false) {
			isOffline = false;
		}
		return isOffline;
	}

	async getWelcomeNeededExternalSettings() {
		const cache = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.ExternalMetricsSettings
		);
		if (cache) {
			return false;
		} else {
			const [lenovoWelcomeSegment, externalMetricsState] = await Promise.all([
				this.selfSelectService.getPersonaFromLenovoWelcome(),
				this.metricService.getExternalMetricsSettings(),
			]);

			if (lenovoWelcomeSegment && externalMetricsState && !this.deviceService.isGaming) {
				this.localCacheService.setLocalCacheValue(
					LocalStorageKey.ExternalMetricsSettings,
					true
				);
				return false;
			}

			return true;
		}
	}

	openWelcomeModal(page: number, tutorialVersion: string) {
		const modalRef = this.dialog.open(ModalWelcomeComponent, {
			maxWidth: '50rem',
			autoFocus: true,
			hasBackdrop: true,
			disableClose: true,
			panelClass: 'welcome-modal-size',
			ariaLabelledBy: 'welcome-tutorial-page-basic-title',
		});
		modalRef.componentInstance.page = page;
		modalRef.componentInstance.tutorialVersion = tutorialVersion;
		modalRef.afterClosed().subscribe(
			(result: WelcomeTutorial) => {
				// on open
				if (this.deviceService.isGaming) {
					this.localCacheService.setLocalCacheValue(
						LocalStorageKey.GamingTutorial,
						result
					);
				}
				this.localCacheService.setLocalCacheValue(LocalStorageKey.WelcomeTutorial, result);
			},
			(reason: WelcomeTutorial) => {
				// on close
				if (reason instanceof WelcomeTutorial) {
					if (this.deviceService.isGaming) {
						this.localCacheService.setLocalCacheValue(
							LocalStorageKey.GamingTutorial,
							reason
						);
					}
					this.localCacheService.setLocalCacheValue(
						LocalStorageKey.WelcomeTutorial,
						reason
					);
				}
			}
		);
	}

	private async getMachineInfo() {
		if (this.deviceService.isShellAvailable) {
			return this.deviceService
				.getMachineInfo()
				.then((value: any) => {
					this.onMachineInfoReceived(value);
				})
				.catch((error) => {});
		} else {
			this.isMachineInfoLoaded = true;
			this.machineInfo = { hideMenus: false };
		}
	}

	private onMachineInfoReceived(value: any) {
		this.setFontFamilyByLocale(value.locale);
		const cachedDeviceInfo: DeviceInfo = {
			isGamingDevice: value.isGaming,
			locale: value.locale,
		};
		this.localCacheService.setLocalCacheValue(LocalStorageKey.DeviceInfo, cachedDeviceInfo);
		this.machineInfo = value;
		this.isMachineInfoLoaded = true;
		this.isGaming = value.isGaming;
		this.commonService.sendNotification('MachineInfo', this.machineInfo);
		this.localCacheService.setLocalCacheValue(LocalStorageKey.MachineFamilyName, value.family);
		this.localCacheService.setLocalCacheValue(
			LocalStorageKey.SubBrand,
			value.subBrand.toLowerCase()
		);

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

		if (value.cpuArchitecture && value.cpuArchitecture.toUpperCase().trim() === 'ARM64') {
			const armTutorialData = new WelcomeTutorial(
				2,
				this.newTutorialVersion,
				true,
				SegmentConst.ConsumerBase
			);
			this.localCacheService.setLocalCacheValue(
				LocalStorageKey.WelcomeTutorial,
				armTutorialData
			);
		} else {
			setTimeout(() => {
				this.launchWelcomeModal();
			}, 0);
		}
	}

	private checkIsDesktopOrAllInOneMachine() {
		if (this.deviceService && this.deviceService.isShellAvailable) {
			this.deviceService.getMachineType();
		}
	}

	private notifyNetworkState(isOnline) {
		this.commonService.isOnline = isOnline;
		this.commonService.sendNotification(
			isOnline ? NetworkStatus.Online : NetworkStatus.Offline,
			{ isOnline }
		);
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
			if (
				activeDom &&
				((activeDom.type === 'textarea' && activeDom.tagName === 'TEXTAREA') ||
					(activeDom.type === 'text' && activeDom.tagName === 'INPUT'))
			) {
				return;
			}
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
				case UpdateProgress.UpdateCheckCompleted:
				case UpdateProgress.InstallationComplete:
				case SecurityAdvisorNotifications.WifiSecurityTurnedOn:
					this.logger.info(
						`store rating should show in next start marked. ${notification.type}`
					);
					this.storeRating.markPromptRatingNextLaunch(true);
					break;
				case HardwareScanProgress.ScanResponse:
				case HardwareScanProgress.RecoverResponse:
					this.logger.info(
						`store rating should show in next start marked. ${notification.type}. ${
							notification.payload ? notification.payload.status : 'null'
						}`
					);
					if (notification.payload && notification.payload.status === true) {
						this.storeRating.markPromptRatingNextLaunch(true);
					}
					break;
				case PerformanceNotifications.firstPageInitialized:
					if (!this.isFirstPageInitialized) {
						this.isFirstPageInitialized = true;
						this.analyzePerformance(notification.payload);
					}
					break;
				case NetworkStatus.Online:
					if (!this.warrantyService.warrantyData.isAvailable) {
						this.warrantyService.fetchWarranty();
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
				regUtil.queryValue(regPath).then((val) => {
					if (!val || (val.keyList || []).length === 0) {
						return;
					}
					regUtil
						.writeValue(
							regPath + '\\PluginData\\LenovoCompanionAppPlugin\\AutoLaunch',
							'LastRunVersion',
							runVersion,
							'String'
						)
						.then((val2) => {
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
		this.commonService.setSessionStorageValue(SessionStorageKey.FirstPageLoaded, true);
		this.commonService.scrollTop();
	}

	ngAfterViewInit() {
		this.commonService.markPerformanceNode('app entry loaded');
		this.metricService.pageContainer = this.pageContainer;
		this.metricService.onAppInitDone();
	}

	onPageScroll($event) {
		this.metricService.notifyPageScollEvent($event.target);
	}

	private removeOldSmartPerformanceScheduleScans() {
		const isOldScheduleScanDeleted = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.isOldScheduleScanDeleted
		);
		if (isOldScheduleScanDeleted === undefined || isOldScheduleScanDeleted === false) {
			this.smartPerformanceService.unregisterScanSchedule(
				EnumSmartPerformance.OLDSCHEDULESCANANDFIX
			);
			this.smartPerformanceService.unregisterScanSchedule(
				EnumSmartPerformance.OLDSCHEDULESCAN
			);
			this.smartPerformanceService.unregisterScanSchedule(EnumSmartPerformance.SCHEDULESCAN);
			this.smartPerformanceService.unregisterScanSchedule(
				EnumSmartPerformance.SCHEDULESCANANDFIX
			);

			this.localCacheService.setLocalCacheValue(
				LocalStorageKey.isOldScheduleScanDeleted,
				true
			);
		}
	}

	private analyzePerformance(firstPage: string) {
		const win: any = window;
		const navPerf = performance.getEntriesByType(
			'navigation'
		)[0] as PerformanceNavigationTiming;
		let navigationStartTime = 0; // for browser
		if (win.VantageStub?.navigationStartingTime && win.VantageStub?.appStartTime) {
			// for vantage3.5 shell
			navigationStartTime =
				win.VantageStub.navigationStartingTime - win.VantageStub.appStartTime;
		} else if (win.VantageStub?.navigateTime && win.VantageStub?.appStartTime) {
			// for shell before vantage3.5
			navigationStartTime = win.VantageStub.navigateTime - win.VantageStub.appStartTime;
		}
		const performanceTimePoints = {
			certPingDone: win.VantageStub?.certpinTime ?? null,
			source: win.VantageShellExtension?.MsWebviewHelper?.getInstance()?.isInOfflineMode
				? 'local'
				: 'remote',
			hostname: win.VantageShellExtension?.MsWebviewHelper?.getInstance()?.isInOfflineMode
				? ''
				: win.location.host,
			navigationStarts: Math.round(navigationStartTime),
			indexPageEstablished: Math.round(
				navigationStartTime + navPerf.responseEnd - navPerf.startTime
			),
			domInteractived: Math.round(
				navigationStartTime + navPerf.domInteractive - navPerf.startTime
			),
			scriptLoaded: Math.round(navigationStartTime + navPerf.duration),
			appInitialized: this.commonService.getPerformanceNode('app initialized')?.startTime
				? Math.round(
						navigationStartTime +
							this.commonService.getPerformanceNode('app initialized').startTime -
							navPerf.startTime
				  )
				: null,
			appEntryLoaded: this.commonService.getPerformanceNode('app entry loaded')?.startTime
				? Math.round(
						navigationStartTime +
							this.commonService.getPerformanceNode('app entry loaded').startTime -
							navPerf.startTime
				  )
				: null,
			firstPageLoaded: this.commonService.getPerformanceNode(firstPage)?.startTime
				? Math.round(
						navigationStartTime +
							this.commonService.getPerformanceNode(firstPage).startTime -
							navPerf.startTime
				  )
				: null,

			dnsLookup: Math.round(navPerf.domainLookupEnd - navPerf.domainLookupStart),
			initTcp: Math.round(navPerf.secureConnectionStart - navPerf.connectStart),
			initSsl: Math.round(navPerf.connectEnd - navPerf.secureConnectionStart),
			request: Math.round(navPerf.responseStart - navPerf.requestStart),
			response: Math.round(navPerf.responseEnd - navPerf.responseStart),
		};
		performanceTimePoints.indexPageEstablished =
			performanceTimePoints.indexPageEstablished > performanceTimePoints.domInteractived
				? performanceTimePoints.domInteractived
				: performanceTimePoints.indexPageEstablished;
		this.metricService.sendAppLoadedMetric(performanceTimePoints);
		let content = `You are now accessing ${performanceTimePoints.source}, ${performanceTimePoints.hostname} \n \n`;
		content += `Certpin done: ${performanceTimePoints.certPingDone} ms \n`;
		content += `Navigation starts: ${performanceTimePoints.navigationStarts} ms \n`;
		content += `Source downloaded: ${performanceTimePoints.indexPageEstablished} ms \n`;
		content += `DOM interactive: ${performanceTimePoints.domInteractived} ms \n`;
		content += `Script loaded: ${performanceTimePoints.scriptLoaded} ms \n`;
		content += `App initialized: ${performanceTimePoints.appInitialized} ms \n`;
		content += `App entry loaded: ${performanceTimePoints.appEntryLoaded} ms \n`;
		content += `First page loaded: ${performanceTimePoints.firstPageLoaded} ms \n`;
		content += `DNS look up: ${performanceTimePoints.dnsLookup} ms \n`;
		content += `TCP connection initiation: ${performanceTimePoints.initTcp} ms \n`;
		content += `SSL connection initiation: ${performanceTimePoints.initSsl} ms \n`;
		content += `HTTP request: ${performanceTimePoints.request} ms \n`;
		content += `HTTP response: ${performanceTimePoints.response} ms`;
		this.logger.info(content);
		if (this.environment.debuggingSnackbar) {
			this.snackBar.open(content, 'Close', {
				panelClass: ['snackbar'],
			});
			const snackbar = document.getElementsByClassName('snackbar')[0];
			snackbar.querySelector('button').id = 'snackbar-close-btn';
		}
	}
}
