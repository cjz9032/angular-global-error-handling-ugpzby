import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { CommsService } from '../comms/comms.service';
import { DevService } from '../dev/dev.service';
import { ContainerService } from '../container/container.service';
import { VantageShellService } from '../vantage-shell/vantage-shell.service'

@Injectable()
export class UserService {

	cookies = {};
	auth = false;
	token = '';

	firstName = 'Lenovo';
	lastName = 'User';
	initials = '';

	constructor(
		private cookieService: CookieService,
		private commsService: CommsService,
		private devService: DevService,
		private vantageShellService: VantageShellService
	) {
		// DUMMY
		this.setName(this.firstName, this.lastName);
	}

	checkCookies() {
		this.cookies = this.cookieService.getAll();
		this.devService.writeLog('CHECK COOKIES:', this.cookies);
		if (this.cookies['token']) {
			this.setToken(this.cookies['token']);
		}
	}

	setAuth(auth = false) {
		this.devService.writeLog('SET AUTH');
		const self = this;
		self.devService.writeLog('LOGIN RES', auth);
		this.auth = auth;
	}

	removeAuth() {
		this.devService.writeLog('REMOVE AUTH');
		const self = this;
		this.cookieService.deleteAll('/');
		this.cookies = this.cookieService.getAll();
		self.vantageShellService.logout().then(function (result) {
			if (result.success && result.status === 0) {
				self.setName("Lenovo", "User");
				self.auth = false;
			}
			this.devService.writeLog('LOGOUT: ', result.success);
		});
	}

	setToken(token) {
		this.devService.writeLog('SET TOKEN', token);
		this.setAuth(true);
		this.token = token;
		this.commsService.token = token;
		this.cookieService.set('token', token, 99999999999999999, '/');
	}

	setName(firstName, lastName) {
		this.firstName = firstName;
		this.lastName = lastName;
		this.initials = this.firstName[0] + this.lastName[0];
	}

}
