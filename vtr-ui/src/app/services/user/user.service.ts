import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { CommsService } from '../comms/comms.service';
import { DevService } from '../dev/dev.service';
import { CommonService } from '../common/common.service';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { LenovoIdKey } from 'src/app/enums/lenovo-id-key.enum';

@Injectable()
export class UserService {

	cookies = {};
	auth = false;
	token = '';

	public firstName = 'User';
	lastName = '';
	initials = '';

	private lid: any;
	private metrics: any;

	constructor(
		private cookieService: CookieService,
		private commsService: CommsService,
		private devService: DevService,
		private vantageShellService: VantageShellService,
		private commonService: CommonService
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

		if (!this.lid) {
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

				this.metrics.sendAsync(metricsData).catch((res) => {
					this.devService.writeLog('loginSilently() Exception happen when send metric ', res.message);
				});
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
			const that = this;
			return this.lid.logout().then((result) => {
				that.metrics.sendAsync({
					ItemType: 'TaskAction',
					TaskName: 'LID.SignOut',
					TaskResult: result && result.success ? 'success' : 'failure'
				}).catch((res) => {
					this.devService.writeLog('logout() Exception happen when send metric ', res.message);
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
		if (auth) {
			this.metrics.sendAsync({
				ItemType: 'TaskAction',
				TaskName: 'LID.SignIn',
				TaskResult: 'success',
				TaskParam: JSON.stringify({
					StarterStatus: 'NA',
					AccountState: 'NA', //{Signin | AlreadySignedIn | NeverSignedIn},
					FeatureRequested: 'NA' // {AppOpen | SignIn | Vantage feature}
				})
			}).catch((res) => {
				this.devService.writeLog('setAuth() Exception happen when send metric ', res.message);
			});
		}
		this.devService.writeLog('LOGIN RES', auth);
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
				self.devService.writeLog('LOGOUT: ', result.success);
			});
		}
	}

	setToken(token: any) {
		this.devService.writeLog('SET TOKEN', token);
		this.token = token;
		this.commsService.token = token;
		this.cookieService.set('token', token, 99999999999999999, '/');
	}

	setName(firstName: string, lastName: string) {
		// TODO: NLS
		if ((!firstName || firstName.length === 0) && (!lastName || lastName.length === 0)) {
			firstName = 'User';
		}
		this.firstName = firstName;
		this.lastName = lastName;
		this.initials = (this.firstName && this.firstName.length > 0) ? this.firstName[0] : '' +
			(this.lastName && this.lastName.length > 0) ? this.lastName[0] : '';
		this.commonService.sendNotification(LenovoIdKey.FirstName, firstName);
	}
}
