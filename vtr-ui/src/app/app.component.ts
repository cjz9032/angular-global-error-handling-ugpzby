import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { UserService } from './services/user/user.service';
import { DevService } from './services/dev/dev.service';
import { DisplayService } from './services/display/display.service';
import { environment } from '../environments/environment';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ModalWelcomeComponent } from "./components/modal/modal-welcome/modal-welcome.component";

@Component({
	selector: 'vtr-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

	env = environment;
	title = 'vtr-ui';

	constructor(
		private userService: UserService,
		private devService: DevService,
		private displayService: DisplayService,
		private router: Router,
		private modalService: NgbModal
	) {
		this.modalService.open(ModalWelcomeComponent,{backdrop:'static'});
	}

	ngOnInit() {
		this.devService.writeLog('APP INIT', window.location.href);

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
