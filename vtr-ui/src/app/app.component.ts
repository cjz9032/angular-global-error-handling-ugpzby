import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ElectronService } from 'ngx-electron';
import { UserService } from './services/user/user.service';
import { ContainerService } from './services/container/container.service';
import { DevService } from './services/dev/dev.service';
import { DisplayService } from './services/display/display.service';
import { environment } from '../environments/environment';

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
		private electronService: ElectronService,
		private userService: UserService,
		private containerService: ContainerService,
		private devService: DevService,
		private displayService: DisplayService
	) { }

	ngOnInit() {
		this.devService.writeLog('APP INIT', window.location.href);

		const self = this;
		window.onresize = function () {
			self.displayService.calcSize(self.displayService);
		};
		self.displayService.calcSize(self.displayService);

		const urlParams = new URLSearchParams(window.location.search);
		this.devService.writeLog('GOT PARAMS', urlParams.toString());
		const token = urlParams.get('lenovoid.wust');
		this.devService.writeLog('GOT TOKEN', token);
		if (token !== undefined && token !== null && token !== '') {
			this.userService.setToken(token);
		} else {
			this.userService.checkCookies();
		}

		if (this.electronService.ipcRenderer) {
			this.electronService.ipcRenderer.on('GetGuidFromMain', function (event, data) {
				self.devService.writeLog('GUID FROM ELECTRON', data);
				self.containerService.setAppId(data);
				self.userService.loadSettings();
			});

			this.containerService.loadGUID();
		} else {
			// TEST
			self.containerService.setAppId('5f74e879-7241-ff6d-27db-8ddeed9424de');
			self.userService.loadSettings();
		}

	}




}
