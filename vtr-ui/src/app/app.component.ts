import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute,NavigationEnd } from '@angular/router';
import { UserService } from './services/user/user.service';
import { ContainerService } from './services/container/container.service';
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
		private route: ActivatedRoute,
		private userService: UserService,
		private containerService: ContainerService,
		private devService: DevService,
		private displayService: DisplayService,
		private modalService: NgbModal,
		private router:Router
	) {

		/*this.modalService.open(ModalWelcomeComponent, {
		  backdrop: 'static',
		  size: 'lg',
		  centered: true,
		  windowClass: 'modal-body'
		});*/
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


          /********* add this for navigation within a page **************/
		this.router.events.subscribe(s => {
			if (s instanceof NavigationEnd) {

				const tree = this.router.parseUrl(this.router.url);
				if (tree.fragment) {
					const element = document.querySelector("#" + tree.fragment);
					if (element) {
						element.scrollIntoView(true);
					}
				}
			}
		});

	}


}
