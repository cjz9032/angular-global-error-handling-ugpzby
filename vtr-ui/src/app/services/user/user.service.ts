import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { CommsService } from '../comms/comms.service';
import { DevService } from '../dev/dev.service';
import { CommonService } from '../common/common.service';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { LenovoIdKey } from 'src/app/enums/lenovo-id-key.enum';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DeviceService } from '../../services/device/device.service';
import {LIDStarterHelper} from './stater.helper';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';


declare var Windows;

@Injectable()
export class UserService {

	cookies = {};
	public auth = false;
	public starter = false;
	token = '';

	public firstName = 'User';
	lastName = '';
	initials = '';

	private lid: any;
	private metrics: any;
	private lidStarterHelper: LIDStarterHelper;
	constructor(
		private cookieService: CookieService,
		private commsService: CommsService,
		private devService: DevService,
		private vantageShellService: VantageShellService,
		private commonService: CommonService,
		private translate: TranslateService,
		public deviceService: DeviceService
	) {
		// DUMMY
		this.setName(this.firstName, this.lastName);
		this.lid = vantageShellService.getLenovoId();
		this.metrics = vantageShellService.getMetrics();
		if (!this.metrics) {
			this.devService.writeLog('UserService constructor: metrics object is undefined');
			this.metrics = {
				sendAsync() { }
			};
		}

		if (!this.lid) {
			this.devService.writeLog('UserService constructor: lid object is undefined');
		}

		this.lidStarterHelper = new LIDStarterHelper(devService, commonService, deviceService, vantageShellService);
	}

	async getStarterIdStatus() {
		const result = await this.lidStarterHelper.hasCreateStarterAccount();
		if (result) {
			return 'created';
		}

		return 'none';
	}

	checkCookies() {
		this.cookies = this.cookieService.getAll();
		this.devService.writeLog('CHECK COOKIES:', this.cookies);
		if (this.cookies['token']) {
			this.setToken(this.cookies['token']);
		}
	}

	deleteCookies(domain: string) {
		const myFilter = new Windows.Web.Http.Filters.HttpBaseProtocolFilter();
		const cookieManager = myFilter.cookieManager;
		const myCookieJar = cookieManager.getCookies(new Windows.Foundation.Uri(domain));
		if (myCookieJar) {
			myCookieJar.forEach(cookie => cookieManager.deleteCookie(cookie));
		}
	}

	loginSilently(appFeature = null) {
		const self = this;
		const accountState = this.hadEverSignIn();
		const starterStatus = this.getStarterIdStatus();
		let loginSuccess = false;
		this.lidStarterHelper.isStarterAccountScenario().then((isStarterAccount) => {
			if (self.lid !== undefined) {
				if (!isStarterAccount) {
					self.lid.loginSilently().then((result) => {
						if (result.success && result.status === 0) {
							loginSuccess = true;
							self.lid.getUserProfile().then((profile) => {
								if (profile.success && profile.status === 0) {
									self.setName(profile.firstName, profile.lastName);
									self.setAuth(true);
								}
							});
						}
		
						self.sendSigninMetrics(loginSuccess ? 'success' : 'failure', starterStatus, accountState, 'AppOpen');
					});
				} else {
					self.lidStarterHelper.getStarterAccountToken().then((token) => {
						if (token && self.lidStarterHelper.isStarterAccount(token)) {
							self.starter = true;
						}
					})
				}
			}
		})

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

	setAuth(auth = false, appFeature = null) {
		let signinDate = this.commonService.getLocalStorageValue(LocalStorageKey.LidFirstSignInDate);
		if (!signinDate) {
			signinDate = new Date().toISOString().substring(0, 19);
			this.commonService.getLocalStorageValue(LocalStorageKey.LidFirstSignInDate, signinDate);
			this.lidStarterHelper.updateUserSettingXml({ lastSignIndate: signinDate, staterAccount: null });
		}
		if (auth && this.starter) {
			this.starter = false;
		}
		this.devService.writeLog('SET AUTH');
		this.devService.writeLog('LOGIN RES', auth);
		this.auth = auth;
	}

	removeAuth() {
		this.devService.writeLog('REMOVE AUTH');
		const self = this;
		this.cookieService.deleteAll('/');
		this.cookies = this.cookieService.getAll();

		this.deleteCookies('https://passport.lenovo.com');
		this.deleteCookies('https://www.facebook.com');
		this.deleteCookies('https://login.live.com');
		this.deleteCookies('https://www.google.com');

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
			this.lastName = '';
		} else {
			this.firstName = firstName ? firstName : '';
			this.lastName = lastName ? lastName : '';
			this.initials = this.firstName ? this.firstName[0] : '' +
				this.lastName ? this.lastName[0] : '';
		}
		this.commonService.sendNotification(LenovoIdKey.FirstName, firstName ? firstName : '');
	}

	async hadEverSignIn() {
		return await this.lidStarterHelper.hadEverSignIn();
	}

	async sendSigninMetrics(taskResult, starterStatus, everSignIn, appFeature = null) {
		const starterStatusResult = await starterStatus;
		const everSignInResult = await everSignIn;
		const self = this;
		const metricsData = {
			ItemType: 'TaskAction',
			TaskName: 'LID.SignIn',
			TaskResult: taskResult,
			TaskParam: {
				StarterStatus: starterStatusResult,
				AccountState: everSignInResult ? 'AlreadySignedIn' : 'NeverSignedIn', //{Signin | AlreadySignedIn | NeverSignedIn},
				FeatureRequested: appFeature ? appFeature : 'SignIn' // {AppOpen | SignIn | Vantage feature}
			}
		};

		self.metrics.sendAsync(metricsData).catch((ex) => {
			self.devService.writeLog('Exception happen when send metric ', ex.message);
		});
	}

}
