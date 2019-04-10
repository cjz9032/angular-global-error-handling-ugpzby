import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { DevService } from './services/dev/dev.service';
import { DisplayService } from './services/display/display.service';
import { environment } from '../environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalWelcomeComponent } from './components/modal/modal-welcome/modal-welcome.component';
import { DeviceService } from './services/device/device.service';
import { CommonService } from './services/common/common.service';
import { LocalStorageKey } from './enums/local-storage-key.enum';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from './services/user/user.service';
import { WelcomeTutorial } from './data-models/common/welcome-tutorial.model';
import { NetworkStatus } from './enums/network-status.enum';

@Component({
	selector: 'vtr-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	ngOnInit(): void {
		throw new Error("Method not implemented.");
	}
	title = 'vtr-ui';

	constructor(
		private devService: DevService,
		private displayService: DisplayService,
		private router: Router,
		private modalService: NgbModal,
		public deviceService: DeviceService,
		private commonService: CommonService,
		private translate: TranslateService,
		private userService: UserService
	) {
		translate.addLangs(['en', 'zh-Hans']);
		this.translate.setDefaultLang('en');
		const tutorial: WelcomeTutorial = commonService.getLocalStorageValue(LocalStorageKey.WelcomeTutorial);

		const modalRef = this.modalService.open(ModalWelcomeComponent,
			{
				backdrop: 'static'
				, windowClass: 'welcome-modal-size'
			});
		modalRef.result.then(
			(result: WelcomeTutorial) => {
				// on open
				console.log('welcome-modal-size', result);
				commonService.setLocalStorageValue(LocalStorageKey.WelcomeTutorial, result);
			},
			(reason: WelcomeTutorial) => {
				// on close
				console.log('welcome-modal-size', reason);
				commonService.setLocalStorageValue(LocalStorageKey.WelcomeTutorial, reason);
			}
		);

		/*if (tutorial === undefined && navigator.onLine) {
			const modalRef = this.modalService.open(ModalWelcomeComponent,
				{
					backdrop: 'static'
					, windowClass: 'welcome-modal-size'
				});
			modalRef.result.then(
				(result: WelcomeTutorial) => {
					// on open
					console.log('welcome-modal-size', result);
					commonService.setLocalStorageValue(LocalStorageKey.WelcomeTutorial, result);
				},
				(reason: WelcomeTutorial) => {
					// on close
					console.log('welcome-modal-size', reason);
					commonService.setLocalStorageValue(LocalStorageKey.WelcomeTutorial, reason);
				}
			);
		}

		window.addEventListener('online', (e) => {
			console.log('online', e, navigator.onLine);
			this.notifyNetworkState();
		}, false);

		window.addEventListener('offline', (e) => {
			console.log('offline', e, navigator.onLine);
			this.notifyNetworkState();
		}, false);
		this.notifyNetworkState();
	}

	ngOnInit() {
		this.devService.writeLog('APP INIT', window.location.href, window.devicePixelRatio);

		// use when deviceService.isArm is set to true
		// todo: enable below line when integrating ARM feature
		// document.getElementById('html-root').classList.add('is-arm');

		const self = this;
		window.onresize = function () {
			self.displayService.calcSize(self.displayService);
		};
		self.displayService.calcSize(self.displayService);

		const urlParams = new URLSearchParams(window.location.search);
		this.devService.writeLog('GOT PARAMS', urlParams.toString());

		// When startup try to login Lenovo ID silently (in background),
		//  if user has already logged in before, this call will login automatically and update UI
		this.deviceService.getMachineInfo().then((machineInfo) => {
			if (machineInfo.country != 'cn') {
				self.userService.loginSilently();
			} else {
				self.devService.writeLog('Do not login silently for China');
			}
		}, error => {
			self.devService.writeLog('getMachineInfo() failed ' + error);
			self.userService.loginSilently();
		});
		

		/********* add this for navigation within a page **************/
		this.router.events.subscribe(s => {
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
		this.checkIsDesktopMachine();
	}

	private getMachineInfo() {
		if (this.deviceService.isShellAvailable) {
			this.deviceService.getMachineInfo()
				.then((value: any) => {
					console.log('getMachineInfo.then', value);
					if (value.locale.toLowerCase() === 'zh-hans') {
						this.translate.setDefaultLang('zh-Hans');
					}
					this.commonService.setLocalStorageValue(LocalStorageKey.MachineInfo, value);
				}).catch(error => {
					console.error('getMachineInfo', error);
				});
		}
	}

	private checkIsDesktopMachine() {
		try {
			if (this.deviceService.isShellAvailable) {
				this.deviceService.getMachineType()
					.then((value: any) => {
						console.log('checkIsDesktopMachine.then', value);
						this.commonService.setLocalStorageValue(LocalStorageKey.DesktopMachine, !(value < 2))
					}).catch(error => {
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

	// public appEvent($event: { name: AppEvent, event: any }) {
	// 	const { name, event } = $event;
	// 	this.commonService.sendNotification(name, event);
	// }
}
