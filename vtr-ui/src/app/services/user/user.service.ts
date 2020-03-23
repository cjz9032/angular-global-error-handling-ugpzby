import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { CommsService } from '../comms/comms.service';
import { DevService } from '../dev/dev.service';
import { CommonService } from '../common/common.service';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { LenovoIdKey, LenovoIdStatus, ssoErroType } from 'src/app/enums/lenovo-id-key.enum';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { DeviceService } from '../../services/device/device.service';
import { LIDStarterHelper } from './stater.helper';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { LocalInfoService } from '../local-info/local-info.service';
import { SegmentConst } from 'src/app/services/self-select/self-select.service';
import { ModalCommonConfirmationComponent } from 'src/app/components/modal/modal-common-confirmation/modal-common-confirmation.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { SelfSelectEvent } from 'src/app/enums/self-select.enum';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import AES from 'crypto-js/aes';
import enc_utf8 from 'crypto-js/enc-utf8';

declare var Windows;

@Injectable({
	providedIn: 'root'
})
export class UserService {

	cookies: any = {};
	public auth = false;
	public starter = false;
	public silentlyLoginSuccess = false;
	token = '';
	public hasFirstName = false;
	public firstName = 'User';
	lastName = '';
	initials = 'U';
	accountState = null;
	starterStatus = null;

	private lid: any;
	private metrics: any;
	private lidStarterHelper: LIDStarterHelper;
	private lidSupported = true;
	private subscription: Subscription;
	private webView = null;

	public readonly webDom = `
	<div style=\'display: block;position: fixed;z-index: 1;padding-top:5%;width: 100%;height: 100%;overflow: auto;\'>
		<div class=\'queryHeight\'>
			<style>
				.queryHeight { position: relative;background-color: #fefefe;margin: auto;padding: auto;border: 1px solid #888;max-width: 460px; height: 80%;}
				@media only screen and (min-height: 768px) {.queryHeight{height: 60%;}}
				@media only screen and (min-height: 1080px) {.queryHeight{height: 50%;}}
				@media only screen and (min-height: 2160px) {.queryHeight{height: 40%;}}
				.close {  color: black;  float: right;  font-size: 28px;  font-weight: bold;}
				.close:hover, .close:focus {  color: black;  text-decoration: none;  cursor: pointer;}
				@keyframes spinner { to {transform: rotate(360deg);} }
				.holder { position: absolute; width: 60px; height: 60px; left: 50%; top: 50%; transform: translate(-50%, -50%); }
				.holder .spinner { display: block; width: 100%; height: 100%; border-radius: 50%; border: 3px solid #ccc; border-top-color: #07d; animation: spinner .8s linear infinite; }
			</style>
			<div id=\'btnClose\' style=\'padding: 2px 16px;background-color: white;color: black;border-bottom: 1px solid #e5e5e5;\'>
				<span class=\'close\' id=\'txtClose\' tabindex=\'99\' aria-current=\'true\'>&times;</span>
				<div style=\'height:45px;\'></div>
			</div>
			<div style=\'height: 100%; min-height: 400px;\' id=\'webviewBorder\'>
				<div class=\'holder\'><span id=\'spinnerCtrl\' class=\'spinner\'></span></div>
				<div id=\'webviewPlaceHolder\' attr.aria-label=\'lid-login-dialog-webview\'></div>
			</div>
		</div>
	</div>
`.replace(/[\r\n]/g, '').replace(/[\t]/g, ' ');


	constructor(
		private cookieService: CookieService,
		private commsService: CommsService,
		private devService: DevService,
		private vantageShellService: VantageShellService,
		private commonService: CommonService,
		private translate: TranslateService,
		public deviceService: DeviceService,
		private localInfoService: LocalInfoService,
		private modalService: NgbModal
	) {
		this.translate.stream('lenovoId.user').subscribe((firstName) => {
			if (!this.auth && firstName !== 'lenovoId.user') {
				this.setName(firstName, this.lastName);
			}
		});
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

		this.updateLidSupported();

		this.lidStarterHelper = new LIDStarterHelper(devService, commonService, deviceService, vantageShellService);

		this.subscription = this.commonService.notification.subscribe((notification: AppNotification) => {
			this.onNotification(notification);
		});
	}

	// error is come from response status of LID contact request
	popupErrorMessage(error: number) {
		const modalRef = this.modalService
			.open(ModalCommonConfirmationComponent, {
				backdrop: 'static',
				size: 'lg',
				centered: true,
				windowClass: 'common-confirmation-modal'
			});
		const header = 'lenovoId.ssoErrorTitle';
		let description = 'lenovoId.ssoErrorCommonEx';
		switch (error) {
			case ssoErroType.SSO_ErrorType_TimeStampIncorrect:
				description = 'lenovoId.ssoErrorTimeStampIncorrect';
				break;
			case ssoErroType.SSO_ErrorType_DisConnect:
				description = 'lenovoId.ssoErrorNetworkDisconnected';
				break;
			case ssoErroType.SSO_ErrorType_Conmmunicating:
				description = 'lenovoId.ssoErrorCommunicating';
				break;
			case ssoErroType.SSO_ErrorType_AccountPluginDoesnotExist:
				description = 'lenovoId.ssoErrorAccountPluginNotExist';
				break;
			default:
				description = 'lenovoId.ssoErrorCommonEx';
				break;
		}
		modalRef.componentInstance.CancelText = '';
		modalRef.componentInstance.header = header;
		modalRef.componentInstance.description = description;
	}

	async getStarterIdStatus() {
		const result = await this.lidStarterHelper.hasCreateStarterAccount();
		if (result) {
			return 'created';
		}

		return 'none';
	}

	getLidLanguageSelectionFromCookies(domain: string) {
		let lang = '';
		const myFilter = new Windows.Web.Http.Filters.HttpBaseProtocolFilter();
		const cookieManager = myFilter.cookieManager;
		const myCookieJar = cookieManager.getCookies(new Windows.Foundation.Uri(domain));
		if (myCookieJar) {
			for (const cookie of myCookieJar) {
				if (cookie.name === 'lang') {
					lang = cookie.value;
					break;
				}
			}
		}
		return lang;
	}

	deleteCookies(domain: string) {
		const myFilter = new Windows.Web.Http.Filters.HttpBaseProtocolFilter();
		const cookieManager = myFilter.cookieManager;
		const myCookieJar = cookieManager.getCookies(new Windows.Foundation.Uri(domain));
		if (myCookieJar) {
			myCookieJar.forEach(cookie => cookieManager.deleteCookie(cookie));
		}
	}

	getLidUserFirstNameFromLocalStorage(userGuid: string) {
		const firstName = this.commonService.getLocalStorageValue(
			LocalStorageKey.LidUserFirstName,
			undefined
		);
		if (firstName && userGuid) {
			const decrptedFirstName = AES.decrypt(firstName, userGuid).toString(enc_utf8);
			return decrptedFirstName;
		} else {
			return undefined;
		}
	}

	obscureUserName(userName: string) {
		let result = '';
		if (!userName) {
			return result;
		}
		if (userName.match(/\w+[@]{1}\w+[.]\w+/)) {
			// Should be email, only show part of name and domain
			const parts = userName.split('@');
			const name = parts[0];
			if (name.length > 2) {
				result = name.charAt(0);
				for (let i = 1; i < name.length - 1; i++) {
					result += '*';
				}
				result += name.charAt(name.length - 1);
			} else {
				if (name.length > 1) {
					result = name.charAt(0);
				}
				result += '*';
			}
			result += '@';
			const domain = parts[1];
			result += domain.charAt(0);
			const dot = domain.indexOf('.');
			for (let i = 1; i < dot; i++) {
				result += '*';
			}
			result += domain.substring(dot);
		} else {
			// Should be phone number, hide middle 4 digits
			result = userName.replace(/(\d{3})(\d{4})/, '$1****');
		}
		return result;
	}

	async loginSilently(appFeature = null) {
		const self = this;
		this.commonService.sendNotification(LenovoIdStatus.Pending, this.auth);
		const isStarterAccount = await this.lidStarterHelper.isStarterAccountScenario();
		if (!isStarterAccount && self.lid) {
			self.lid.loginSilently().then(result => {
				if (result.success && result.status === 0) {
					self.silentlyLoginSuccess = true;
					const firstName = self.getLidUserFirstNameFromLocalStorage(result.userGuid);
					if (firstName) {
						self.setName(firstName, '');
					}
					self.lid.getUserProfile().then(profile => {
						self.hasFirstName = Boolean(profile.firstName);
						if (profile.success && profile.status === 0) {
							if (profile.firstName && profile.firstName !== firstName) {
								self.setName(profile.firstName, profile.lastName);
							}
						} else {
							if (result.userName && !firstName) {
								const userName = self.obscureUserName(result.userName);
								self.setName(userName, '');
							}
						}
					}).catch((res) => {
						self.devService.writeLog('getUserProfile() Exception happen ', res);
					});
					self.setAuth(true);
					self.commonService.sendNotification(LenovoIdStatus.SignedIn, appFeature);
					self.sendSilentlyLoginMetric();
				} else {
					self.commonService.sendNotification(LenovoIdStatus.SignedOut, appFeature);
					self.sendSilentlyLoginMetric();
				}
			}).catch((res) => {
				self.devService.writeLog('loginSilently() Exception happen ', res);
			});
		} else {
			this.lidStarterHelper.getStarterAccountToken().then((token) => {
				if (token && self.lidStarterHelper.isStarterToken(token)) {
					self.starter = true;
					self.sendSilentlyLoginMetric();
				}
				self.commonService.sendNotification(self.starter ? LenovoIdStatus.StarterId : LenovoIdStatus.SignedOut, appFeature);
			}).catch(() => {
				self.commonService.sendNotification(self.starter ? LenovoIdStatus.StarterId : LenovoIdStatus.SignedOut, appFeature);
			});
		}
	}

	public sendSilentlyLoginMetric() {
		if (!this.accountState) {
			this.accountState = this.hadEverSignIn();
		}
		if (!this.starterStatus) {
			this.starterStatus = this.getStarterIdStatus();
		}
		if (this.starter === true || this.silentlyLoginSuccess === true) {
			this.sendSigninMetrics('success', this.starterStatus, this.accountState, 'AppOpen');
		} else {
			this.sendSigninMetrics('failure(rc=UserInteractionRequired)', this.starterStatus, this.accountState, 'AppOpen');
		}
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
		this.devService.writeLog('setAuth(): auth = ', auth);
		if (this.auth !== auth) {
			this.auth = auth;
			this.commonService.sendNotification(auth ? LenovoIdStatus.SignedIn : LenovoIdStatus.SignedOut, auth);
		}
	}

	async removeAuth() {
		this.cookieService.deleteAll('/');
		this.cookies = this.cookieService.getAll();

		this.deleteCookies('https://passport.lenovo.com');
		this.deleteCookies('https://www.facebook.com');
		this.deleteCookies('https://login.live.com');
		this.deleteCookies('https://www.google.com');

		if (this.lid !== undefined) {
			const lidGuid = this.lid.userGuid;
			this.commonService.sendNotification(LenovoIdStatus.LoggingOut, true);
			const win: any = window;
			if (win && win.webviewPopup && !this.webView) {
				this.webView = win.webviewPopup;
				await this.webView.create(this.webDom);
			}
			if (this.webView) {
				// This is the link to clear cache for SSO production environment
				await this.webView.navigate('https://passport.lenovo.com/wauthen5/userLogout?lenovoid.action=uilogout&lenovoid.display=null');
			}
			this.lid.logout().then((result) => {
				let metricsData: any;
				if (result.success && result.status === 0) {
					metricsData = {
						ItemType: 'TaskAction',
						TaskName: 'LID.SignOut',
						TaskCount: '1',
						TaskResult: 'success',
						TaskParam: ''
					};
				} else {
					this.devService.writeLog('removeAuth(): request lid.logout() failed - ', result.status);
					this.popupErrorMessage(result.status);
					metricsData = {
						ItemType: 'TaskAction',
						TaskName: 'LID.SignOut',
						TaskCount: '1',
						TaskResult: 'failure',
						TaskParam: ''
					};
				}
				this.metrics.sendAsyncEx(metricsData, {
					lidGuid
				}).catch((error) => {
					this.devService.writeLog('removeAuth(): Exception happen when send metric - ', error);
				});
				this.devService.writeLog('removeAuth(): ', result.success);
			}).catch((error) => {
				this.devService.writeLog('removeAuth(): Exception happen when request lid.logout() - ', error);
				this.popupErrorMessage(ssoErroType.SSO_ErrorType_UnknownCrashed);
			}).finally(() => {
				this.setAuth(false);
				this.translate.stream('lenovoId.user').subscribe((value) => {
					this.setName(value, '');
				});
				this.commonService.sendNotification(LenovoIdStatus.LoggingOut, false);
				this.commonService.sendNotification(LenovoIdStatus.SignedOut, this.auth);
			});
		} else {
			this.devService.writeLog('removeAuth(): undefined lid object!');
		}
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
				AccountState: everSignInResult ? 'AlreadySignedIn' : 'NeverSignedIn', // {Signin | AlreadySignedIn | NeverSignedIn},
				FeatureRequested: appFeature ? appFeature : 'SignIn' // {AppOpen | SignIn | Vantage feature}
			}
		};

		self.metrics.sendAsync(metricsData).catch((ex) => {
			self.devService.writeLog('Exception happen when send metric ', ex.message);
		});
	}

	isLenovoIdSupported() {
		// VAN-7119 add version check, if client version below 1908, hide the LID function
		return this.lidSupported;
	}

	onNotification(notification: any) {
		if (notification) {
			switch (notification.type) {
				case SelfSelectEvent.SegmentChange:
					this.updateLidSupported();
					break;
				default:
					break;
			}
		}
	}


	private updateLidSupported() {
		let lidSupported = true;
		if (typeof Windows !== 'undefined') {
			const packageVersion = Windows.ApplicationModel.Package.current.id.version;
			if (packageVersion.minor < 1908) {
				lidSupported = false;
			}
		}
		this.localInfoService.getLocalInfo().then(localInfo => {
			if (localInfo && localInfo.Segment === SegmentConst.Commercial) {
				lidSupported = false;
			}
			this.lidSupported = lidSupported;
		});
	}
}
