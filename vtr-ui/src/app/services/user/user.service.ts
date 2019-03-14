import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { CommsService } from '../comms/comms.service';
import { DevService } from '../dev/dev.service';
import { ContainerService } from '../container/container.service';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { JsonPipe } from '@angular/common';

@Injectable()
export class UserService {

	cookies = {};
	auth = false;
	token = '';

	firstName = 'User';
	lastName = '';
	initials = '';

	private lid: any;
	private metrics: any;

	constructor(
		private cookieService: CookieService,
		private commsService: CommsService,
		private devService: DevService,
		private vantageShellService: VantageShellService
	) {
		// DUMMY
		this.setName(this.firstName, this.lastName);
		this.lid = vantageShellService.getLenovoId();
		this.metrics = vantageShellService.getMetrics();
		if (!this.metrics) {
			this.devService.writeLog('UserService constructor: metrics object is undefined');
			this.metrics = {
				sendAsync() {}
			};
		}

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
				let metricsData: any;
				if (result.success && result.status === 0) {
					this.lid.getUserProfile().then((profile) => {
						if (profile.success && profile.status === 0) {
							self.setName(profile.firstName, profile.lastName);
							self.auth = true;
						}
					});
					metricsData = {
						ItemType: 'TaskAction',
						TaskName: 'LID.SignIn',
						TaskResult: 'success',
						TaskParam: JSON.stringify({
								StarterStatus: 'NA',
								AccountState: 'NA', //{Signin | AlreadySignedIn | NeverSignedIn},
								FeatureRequested: 'NA' // {AppOpen | SignIn | Vantage feature}
						})
					};
				} else {
					metricsData = {
						ItemType: 'TaskAction',
						TaskName: 'LID.SignIn',
						TaskResult: 'failure',
						TaskParam: JSON.stringify({
							StarterStatus: 'NA',
							AccountState: 'NA', //{Signin | AlreadySignedIn | NeverSignedIn},
							FeatureRequested: 'NA' // {AppOpen | SignIn | Vantage feature}
						})
					};
				}

				this.metrics.sendAsync(metricsData);
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

		this.metrics.sendAsync({
			ItemType: 'TaskAction',
			TaskName: 'LID.SignIn',
			TaskResult: 'success',
			TaskParam: JSON.stringify({
				StarterStatus: 'NA',
				AccountState: 'NA', //{Signin | AlreadySignedIn | NeverSignedIn},
				FeatureRequested: 'NA' // {AppOpen | SignIn | Vantage feature}
			})
		});

		return undefined;
	}

	public logout(): any {
		if (this.lid !== undefined) {
			const that = this;
			return this.lid.logout().then((result) => {
				that.metrics.sendAsync({
					ItemType: 'TaskAction',
					TaskName: 'LID.SignOut',
					TaskResult: result && result.success ? 'success' : 'failure'
				});

				return result;
			});
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
