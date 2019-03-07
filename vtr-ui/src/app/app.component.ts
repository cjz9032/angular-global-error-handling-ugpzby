import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { DevService } from './services/dev/dev.service';
import { DisplayService } from './services/display/display.service';
import { TranslateService } from '@ngx-translate/core';


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
		// private modalService: NgbModal,
		private router: Router,
		translate: TranslateService
	) {
		translate.addLangs(['en', 'zh-Hans']);
		translate.setDefaultLang('zh-Hans');

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
					const element = document.querySelector('#' + tree.fragment);
					if (element) {
						element.scrollIntoView(true);
					}
				}
			}
		});
	}
}
