import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { CommsService } from '../comms/comms.service';
import { DevService } from '../dev/dev.service';
import { ContainerService } from '../container/container.service';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';

@Injectable()
export class UserService {

	cookies = {};
	auth = false;
	token = '';

	firstName = 'User';
	lastName = '';
	initials = '';

	private lid: any;

	constructor(
		private cookieService: CookieService,
		private commsService: CommsService,
		private devService: DevService,
		private vantageShellService: VantageShellService
	) {
		// DUMMY
		this.setName(this.firstName, this.lastName);
		this.lid = vantageShellService.getLenovoId();
		if (this.lid === undefined) {
			this.devService.writeLog('UserService constructor: lid object is undefined');
		}
	}

	checkCookies() {
		this.cookies = this.cookieService.getAll();
		this.devService.writeLog('CHECK COOKIES:', this.cookies);
		if (this.cookies['token']) {
			this.setToken(this.cookies['token']);
		}
	}

	loginSilently() {
		const self = this;
		if (this.lid !== undefined) {
			this.lid.loginSilently().then((result) => {
				if (result.success && result.status === 0) {
					this.lid.getUserProfile().then((profile) => {
						if (profile.success && profile.status === 0) {
							self.setName(profile.firstName, profile.lastName);
							self.auth = true;
						}
					});
				}
			});
		}
		this.devService.writeLog('LOGIN(SILENTLY): ', self.auth);
	}

	public getLoginUrl(): any {
		if (this.lid !== undefined) {
			return this.lid.getLoginUrl();
		}
		return undefined;
	}

	public enableSSO(useruad, username, userid, userguid): any {
		if (this.lid !== undefined) {
			return this.lid.enableSSO(useruad, username, userid, userguid);
		}
		return undefined;
	}

	public logout(): any {
		if (this.lid !== undefined) {
			return this.lid.logout();
		}
		return undefined;
	}

	public getLoginStatus(): any {
		if (this.lid !== undefined) {
			return this.lid.getLoginStatus();
		}
		return undefined;
	}

	public getUserProfile(): any {
		if (this.lid !== undefined) {
			return this.lid.getUserProfile();
		}
		return undefined;
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
		if (this.lid !== undefined) {
			this.lid.logout().then(function (result) {
				if (result.success && result.status === 0) {
					self.setName('User', '');
					self.auth = false;
				}
				this.devService.writeLog('LOGOUT: ', result.success);
			});
		}
	}

	setToken(token: any) {
		this.devService.writeLog('SET TOKEN', token);
		this.setAuth(true);
		this.token = token;
		this.commsService.token = token;
		this.cookieService.set('token', token, 99999999999999999, '/');
	}

	setName(firstName: string, lastName: string) {
		this.firstName = firstName;
		this.lastName = lastName;
		this.initials = this.firstName ? this.firstName[0] : '' +
			this.lastName ? this.lastName[0] : '';
	}

}
