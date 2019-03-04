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

	firstName = 'John';
	lastName = 'Doe';
	initials = '';

	constructor(
		private cookieService: CookieService,
		private commsService: CommsService,
		private devService: DevService,
		private containerService: ContainerService
	) {
		// DUMMY
		this.setName(this.firstName, this.lastName);
	}

	checkCookies() {
		this.cookies = this.cookieService.getAll();
		this.devService.writeLog('CHECK COOKIES:', this.cookies);
		if (this.cookies['token']) {
			this.setToken(this.cookies['token']);
			this.setAuth();
		}
	}

	setAuth(auth = false) {
		this.devService.writeLog('SET AUTH');
		const self = this;
		this.commsService.login().subscribe((res) => {
			self.devService.writeLog('LOGIN RES', res);
			this.auth = true;
		}, (err) => {
			self.commsService.handleAPIError('Login Error', err);
		});
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

	setName(firstName, lastName) {
		this.firstName = firstName;
		this.lastName = lastName;
		this.initials = this.firstName[0] + this.lastName[0];
	}

}
