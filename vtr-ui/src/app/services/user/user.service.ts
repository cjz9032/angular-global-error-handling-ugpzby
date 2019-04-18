import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { CommsService } from '../comms/comms.service';
import { DevService } from '../dev/dev.service';
import { CommonService } from '../common/common.service';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { LenovoIdKey } from 'src/app/enums/lenovo-id-key.enum';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Injectable()
export class UserService {

	cookies = {};
	public auth = false;
	token = '';

	public isLenovoIdSupported = false;

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
		private commonService: CommonService,
		private translate: TranslateService
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
					self.lid.getUserProfile().then((profile) => {
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

				self.metrics.sendAsync(metricsData).catch((res) => {
					self.devService.writeLog('loginSilently() Exception happen when send metric ', res.message);
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
			const lidGuid = this.lid.userGuid;
			this.lid.logout().then(function (result) {
				let metricsData: any;
				if (result.success && result.status === 0) {
					self.translate.stream('lenovoId.user').subscribe((value) => {
						self.setName(value, '');
					});
					self.auth = false;
					metricsData = {
						ItemType: 'TaskAction',
						TaskName: 'LID.SignOut',
						TaskCount: '1',
						TaskResult: 'success',
						TaskParam: ''
					};
				} else {
					metricsData = {
						ItemType: 'TaskAction',
						TaskName: 'LID.SignOut',
						TaskCount: '1',
						TaskResult: 'failure',
						TaskParam: ''
					};
				}
				self.metrics.sendAsyncEx(metricsData, {
					lidGuid
				}).catch((res) => {
					self.devService.writeLog('removeAuth() Exception happen when send metric ', res.message);
				});
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
		if (!firstName && !lastName) {
			this.translate.stream('lenovoId.user').subscribe((value) => {
				this.firstName = value;
				this.initials = value ? value[0] : '';
			});
			this.lastName = "";
		} else {
			this.firstName = firstName ? firstName : "";
			this.lastName = lastName ? lastName : "";
			this.initials = this.firstName ? this.firstName[0] : '' +
				this.lastName ? this.lastName[0] : '';
		}
		this.commonService.sendNotification(LenovoIdKey.FirstName, firstName? firstName : "");
	}

}
