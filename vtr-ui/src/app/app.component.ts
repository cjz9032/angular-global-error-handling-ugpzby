import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { DevService } from './services/dev/dev.service';
import { DisplayService } from './services/display/display.service';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from './services/user/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalWelcomeComponent } from './components/modal/modal-welcome/modal-welcome.component';
import { DeviceService } from './services/device/device.service';
import { environment } from '../environments/environment';
import { MetricService } from "./services/metric/metric.service";

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
		private modalService: NgbModal,
		private router: Router,
		translate: TranslateService,
		private userService: UserService,
		public deviceService: DeviceService,
		private metricService: MetricService
	) {
		translate.addLangs(['en', 'zh-Hans']);
		translate.setDefaultLang('zh-Hans');
		this.modalService.open(ModalWelcomeComponent, { backdrop: 'static' });
	}

	ngOnInit() {
		this.devService.writeLog('APP INIT', window.location.href);

		// use when deviceService.isArm is set to true
		document.getElementById("html-root").classList.add('is-arm');

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
	}
}
