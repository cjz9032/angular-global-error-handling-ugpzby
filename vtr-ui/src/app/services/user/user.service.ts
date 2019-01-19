import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { CommsService } from '../comms/comms.service';
import { DevService } from '../dev/dev.service';
import { ContainerService } from '../container/container.service';

@Injectable()
export class UserService {

	cookies = {};
	auth = false;
	token = '';

	constructor(
		private cookieService: CookieService,
		private commsService: CommsService,
		private devService: DevService,
		private containerService: ContainerService
	) { }

	checkCookies() {
		this.cookies = this.cookieService.getAll();
		this.devService.writeLog('CHECK COOKIES:', this.cookies);
		if (this.cookies['token']) {
			this.setToken(this.cookies['token']);
			this.setAuth();
		}
	}

	setAuth() {
		this.auth = true;
	}

	removeAuth() {
		this.devService.writeLog('REMOVE AUTH');
		const self = this;
		this.cookieService.deleteAll('/');
		this.cookies = this.cookieService.getAll();
		this.commsService.logout().subscribe((res) => {
			self.devService.writeLog('LOGOUT RES', res);
		}, (err) => {
			self.commsService.handleAPIError('Logout Settings', err);
		});
		this.auth = false;
	}

	setToken(token) {
		this.devService.writeLog('SET TOKEN', token);
		this.setAuth();
		this.token = token;
		this.commsService.token = token;
		this.cookieService.set('token', token, 99999999999999999, '/');
	}

}
