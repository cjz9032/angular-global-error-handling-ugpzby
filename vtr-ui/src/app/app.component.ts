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

@Component({
	selector: 'vtr-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	title = 'vtr-ui';

	constructor(
		private devService: DevService,
		private displayService: DisplayService,
		private router: Router,
		private modalService: NgbModal,
		private deviceService: DeviceService,
		private commonService: CommonService,
		translate: TranslateService,
		private userService: UserService
	) {
		translate.addLangs(['en', 'zh-Hans']);
		translate.setDefaultLang('en');
		this.modalService.open(ModalWelcomeComponent,
			{
				backdrop: 'static'
				, windowClass: 'welcome-modal-size'
			});
	}

	ngOnInit() {
		this.devService.writeLog('APP INIT', window.location.href);

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
		this.userService.loginSilently();

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
	}

	private getMachineInfo() {
		if (this.deviceService.isShellAvailable) {
			this.deviceService.getMachineInfo()
				.then((value: any) => {
					console.log('getMachineInfo.then', value);
					this.commonService.setLocalStorageValue(LocalStorageKey.MachineInfo, value);
				}).catch(error => {
					console.error('getMachineInfo', error);
				});
		}
	}
}
