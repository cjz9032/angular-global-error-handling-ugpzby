import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd, ParamMap, ActivatedRoute } from '@angular/router';
import { DevService } from './services/dev/dev.service';
import { DisplayService } from './services/display/display.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalWelcomeComponent } from './components/modal/modal-welcome/modal-welcome.component';
import { DeviceService } from './services/device/device.service';
import { CommonService } from './services/common/common.service';
import { LocalStorageKey } from './enums/local-storage-key.enum';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from './services/user/user.service';
import { WelcomeTutorial } from './data-models/common/welcome-tutorial.model';
import { NetworkStatus } from './enums/network-status.enum';
import { KeyPress } from './data-models/common/key-press.model';
import { VantageShellService } from './services/vantage-shell/vantage-shell.service';
import { SettingsService } from './services/settings.service';
import { ModalServerSwitchComponent } from './components/modal/modal-server-switch/modal-server-switch.component'; // VAN-5872, server switch feature
import { AppAction } from 'src/app/data-models/metrics/events.model';
import * as MetricsConst from 'src/app/enums/metrics.enum';
import { TimerService } from 'src/app/services/timer/timer.service';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'vtr-root',
	templateUrl: './app.component.html',
	styleUrls: [ './app.component.scss' ],
	providers: [ TimerService ]
})
export class AppComponent implements OnInit {
	title = 'vtr-ui';

	machineInfo: any;
	public isMachineInfoLoaded = false;
	public isGaming: any = false;
	private metricsClient: any;
	constructor(
		private devService: DevService,
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
		private timerServcie: TimerService
	) {
		// to check web version in browser
		const win: any = window;
		win.webAppVersion = environment.appVersion;

		translate.addLangs([
			'en',
			'zh-Hans',
			'ar',
			'cs',
			'da',
			'de',
			'el',
			'es',
			'fi',
			'fr',
			'he',
			'hr',
			'hu',
			'it',
			'ja',
			'ko',
			'nb',
			'nl',
			'pl',
			'pt-BR',
			'pt',
			'ro',
			'ru',
			'sk',
			'sl',
			'sr-Latn',
			'sv',
			'tr',
			'uk',
			'zh-Hant'
		]);
		this.translate.setDefaultLang('en');
		this.metricsClient = this.vantageShellService.getMetrics();
		//#region VAN-2779 this is moved in MVP 2
		this.deviceService
			.getIsARM()
			.then((status: boolean) => {
				console.log('getIsARM.then', status);
				if (!status) {
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
			.catch((error) => {
				console.error('getIsARM', error);
			});

		//#endregion

		window.addEventListener(
			'online',
			(e) => {
				console.log('online', e, navigator.onLine);
				this.notifyNetworkState();
			},
			false
		);

		window.addEventListener(
			'offline',
			(e) => {
				console.log('offline', e, navigator.onLine);
				this.notifyNetworkState();
			},
			false
		);

		document.addEventListener('visibilitychange', (e) => {
			if (document.hidden) {
				this.sendAppSuspendMetric();
			} else {
				this.sendAppResumeMetric();
			}
		});
		this.notifyNetworkState();
	}

	public sendAppLaunchMetric(lauchType: string) {
		this.timerServcie.start();
		this.metricsClient.sendAsync(new AppAction(MetricsConst.MetricString.ActionOpen, lauchType, null, 0));
	}

	public sendAppResumeMetric() {
		this.timerServcie.start(); // restart timer
		this.metricsClient.sendAsync(new AppAction(MetricsConst.MetricString.ActionResume, null, null, 0));
	}

	public sendAppSuspendMetric() {
		const duration = this.timerServcie.stop();
		this.metricsClient.sendAsync(new AppAction(MetricsConst.MetricString.ActionSuspend, null, null, duration));
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
				console.log('welcome-modal-size', result);
				this.commonService.setLocalStorageValue(LocalStorageKey.WelcomeTutorial, result);
			},
			(reason: WelcomeTutorial) => {
				// on close
				console.log('welcome-modal-size', reason);
				if (reason instanceof WelcomeTutorial) {
					this.commonService.setLocalStorageValue(LocalStorageKey.WelcomeTutorial, reason);
				}
			}
		);
	}

	ngOnInit() {
		// session storage is not getting clear after vantage is close.
		// forcefully clearing session storage
		if (this.deviceService.isAndroid) {
			return;
		}
		sessionStorage.clear();

		this.sendAppLaunchMetric('launch');
		this.devService.writeLog('APP INIT', window.location.href, window.devicePixelRatio);

		// use when deviceService.isArm is set to true
		// todo: enable below line when integrating ARM feature
		// document.getElementById('html-root').classList.add('is-arm');

		const self = this;
		window.onresize = () => {
			self.displayService.calcSize(self.displayService);
		};
		self.displayService.calcSize(self.displayService);

		const urlParams = new URLSearchParams(window.location.search);
		this.devService.writeLog('GOT PARAMS', urlParams.toString());

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
		this.getMachineInfo();
		// const result = this.getMachineInfo();
		// const hadRunApp: boolean = this.commonService.getLocalStorageValue(LocalStorageKey.HadRunApp);
		// const appFirstRun = !hadRunApp;
		// if (appFirstRun && this.deviceService.isShellAvailable) {
		// 	this.commonService.setLocalStorageValue(LocalStorageKey.HadRunApp, true);
		// 	if (result) {
		// 		result.then((machineInfo) => {
		// 			this.sendFirstRunEvent(machineInfo);
		// 		});
		// 	}
		// }

		// if (result) {
		// 	result.then((machineInfo) => {
		// 		this.machineInfo = machineInfo;
		// 	});
		// }

		this.checkIsDesktopOrAllInOneMachine();
		this.settingsService.getPreferenceSettingsValue();

		// VAN-5872, server switch feature
		this.serverSwitchThis();
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

	private getMachineInfo() {
		if (this.deviceService.isShellAvailable) {
			return this.deviceService
				.getMachineInfo()
				.then((value: any) => {
					console.log(`SUCCESSFULLY got the machine info =>`, value);
					this.commonService.sendNotification('MachineInfo', this.machineInfo);
					this.commonService.setLocalStorageValue(LocalStorageKey.MachineFamilyName, value.family);
					this.isMachineInfoLoaded = true;
					this.machineInfo = value;
					this.isGaming = value.isGaming;
					this.updateLanguageSettings(value);
					// if first launch, send a first run metric
					const hadRunApp: boolean = this.commonService.getLocalStorageValue(LocalStorageKey.HadRunApp);
					const appFirstRun = !hadRunApp;
					if (appFirstRun && this.deviceService.isShellAvailable) {
						this.commonService.setLocalStorageValue(LocalStorageKey.HadRunApp, true);
						this.sendFirstRunEvent(value);
					}

					// if u want to see machineinfo in localstorage
					// just add a key "machineinfo-cache-enable" and set it true
					// then relaunch app you will see the machineinfo in localstorage.
					return value;
				})
				.catch((error) => {
					console.error('getMachineInfo', error);
				});
		} else {
			this.isMachineInfoLoaded = true;
			this.machineInfo = { hideMenus: false };
			this.router.navigate([ '/dashboard' ]);
		}
	}

	private updateLanguageSettings(value: any) {
		try {
			if (value && ![ 'zh', 'pt' ].includes(value.locale.substring(0, 2).toLowerCase())) {
				this.translate.use(value.locale.substring(0, 2));
				this.commonService.setLocalStorageValue(LocalStorageKey.SubBrand, value.subBrand.toLowerCase());
			} else {
				if (value && value.locale.substring(0, 2).toLowerCase() === 'pt') {
					value.locale.toLowerCase() === 'pt-br' ? this.translate.use('pt-BR') : this.translate.use('pt');
				}
				if (value && value.locale.toLowerCase() === 'zh-hans') {
					this.translate.use('zh-Hans');
				}
				if (value && value.locale.toLowerCase() === 'zh-hant') {
					this.translate.use('zh-Hant');
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
						console.log('checkIsDesktopMachine.then', value);
						this.commonService.setLocalStorageValue(LocalStorageKey.DesktopMachine, value === 4);
						this.commonService.setLocalStorageValue(LocalStorageKey.MachineType, value);
					})
					.catch((error) => {
						console.error('checkIsDesktopMachine', error);
					});
			}
		} catch (error) {
			console.error(error.message);
		}
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

					let langCode = serverSwitchLocalData.language.Value.toLowerCase();
					const langMap = {
						'zh-hant': 'zh-Hant',
						'zh-hans': 'zh-Hans',
						'pt-br': 'pt-BR'
					};
					if (langMap[langCode]) {
						langCode = langMap[langCode];
					}

					const allLangs = this.translate.getLangs();
					if (allLangs.indexOf(langCode) >= 0) {
						// this.translate.resetLang('ar');
						this.translate.reloadLang(langCode);
						this.translate.use(langCode).subscribe(
							(data) => console.log('@sahinul trans use NEXT'),
							(error) => console.log('@sahinul server switch error ', error),
							() => {
								// Evaluate the translations for QA on language Change
								// this.qaService.setTranslationService(this.translate);
								// this.qaService.setCurrentLangTranslations();
								console.log('@sahinul server switch completed');

								// VAN-6417, language right to left
								/*if ((['ar', 'he']).indexOf(langCode) >= 0) {
									window.document.getElementsByTagName("html")[0].dir = 'rtl';
									window.document.getElementsByTagName("html")[0].lang = langCode;
								} else {
									window.document.getElementsByTagName("html")[0].dir = 'ltr';
									window.document.getElementsByTagName("html")[0].lang = langCode;
								}*/
							}
						);
					}
				}
			}
		});
	}

	@HostListener('window:keyup', [ '$event' ])
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

			// VAN-5872, server switch feature
			if (event.ctrlKey && event.shiftKey && event.keyCode === 67) {
				const serverSwitchModal: NgbModalRef = this.modalService.open(ModalServerSwitchComponent, {
					backdrop: true,
					size: 'lg',
					centered: true,
					windowClass: 'Server-Switch-Modal',
					keyboard: false
				});
			}
		} catch (error) {
			console.error('AppComponent.onKeyUp', error);
		}
	}

	@HostListener('window:load', [ '$event' ])
	onLoad(event) {
		const scale = 1 / (window.devicePixelRatio || 1);
		const content = `shrink-to-fit=no, width=device-width, initial-scale=${scale}, minimum-scale=${scale}`;
		document.querySelector('meta[name="viewport"]').setAttribute('content', content);
		// console.log('DPI: ', content);
		// alert('I am at onload');

		// VAN-5872, server switch feature
		// when app loads for the 1st time then remove ServerSwitch values
		window.localStorage.removeItem(LocalStorageKey.ServerSwitchKey);

		// VAN-6417, language right to left
		/*let currLang = this.translate.currentLang;
		if ((['ar', 'he']).indexOf(currLang) >= 0) {
			window.document.getElementsByTagName("html")[0].dir = 'rtl';
			window.document.getElementsByTagName("html")[0].lang = currLang;
		} else {
			window.document.getElementsByTagName("html")[0].dir = 'ltr';
			window.document.getElementsByTagName("html")[0].lang = currLang;
		}*/
	}

	// Defect fix VAN-2988
	@HostListener('window:keydown', [ '$event' ])
	disbleCtrlACV($event: KeyboardEvent) {
		// console.log('$event.keyCode ' + $event.keyCode);
		if (
			($event.ctrlKey || $event.metaKey) &&
			($event.keyCode === 65 || $event.keyCode === 67 || $event.keyCode === 86)
		) {
			// if ($event.keyCode === 65) {
			// 	console.log('Disable CTRL + A');
			// }
			// if ($event.keyCode === 67) {
			// 	console.log('Disable CTRL + C');
			// }
			// if ($event.keyCode === 86) {
			// 	console.log('Disable CTRL +  V');
			// }
			$event.stopPropagation();
			$event.preventDefault();
		}
	}
}
