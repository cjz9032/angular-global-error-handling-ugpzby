import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../services/user/user.service';
import { SupportService } from '../../../services/support/support.service';
import { DevService } from '../../../services/dev/dev.service';
import { VantageShellService } from '../../../services/vantage-shell/vantage-shell.service';
import { CommonService } from 'src/app/services/common/common.service';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalCommonConfirmationComponent } from '../../modal/modal-common-confirmation/modal-common-confirmation.component';

enum ssoErroType {

	SSO_ErrorType_NoErr = 0,

	//
	// server error type
	//

	// Invalid request parameters, some parameters may be empty
	SSO_ErrorType_InvalidParam,

	// Sign error
	SSO_ErrorType_SignInFailed,

	// Invalid aid
	SSO_ErrorType_InvalidAID,

	SSO_ErrorType_InvalidDidByServer,

	// Invalid UAD
	SSO_ErrorType_InvalidUAD,

	// Invalid UD
	SSO_ErrorType_InvalidUD,

	// Invalid UAD type
	SSO_ErrorType_InvalidUADType,

	// ClientTimeStamp is incorrect
	SSO_ErrorType_TimeStampIncorrect,

	// Server Error
	SSO_ErrorType_ServerError = -99,

	//
	// sso client error type
	//

	// Unknown/Undefined client error
	SSO_ErrorType_Unknown = 1000,

	// Error communicating with server
	SSO_ErrorType_Conmmunicating,

	// Invalid response from server
	SSO_ErrorTyoe_InvalidResponse,

	// Invalid response logon URL returned from server
	SSO_ErrorType_InvalidURL,

	// Invalid dId returned from server
	SSO_ErrorType_InvalidDID,

	// Error accessing Windows credential manager
	SSO_ErrorType_CannotAccessCredential,

	// Problem obtaining MTM/serial number 
	SSO_ErrorType_MTMORSerialNumber,

	// custom
	// the user was not signed in yet,
	SSO_ErrorType_NotSignedIn = 2000,

	SSO_ErrorType_UnknownCrashed = 2001,

	SSO_ErrorType_DisConnect = 2002,

	SSO_ErrorType_SSORequestTimeOut = 2003,

	SSO_ErrorType_AccountPluginDoesnotExist = 2004,
}

@Component({
	selector: 'vtr-modal-lenovo-id',
	templateUrl: './modal-lenovo-id.component.html',
	styleUrls: ['./modal-lenovo-id.component.scss']
})
export class ModalLenovoIdComponent implements OnInit, AfterViewInit, OnDestroy {
	public isOnline = true;
	private cacheCleared: boolean;
	public isBroswerVisible = false; // show or hide web browser, hide or show progress spinner
	private metrics: any;
	private starterStatus: any;
	private everSignIn: any;
	public appFeature = null;

	constructor(
		public activeModal: NgbActiveModal,
		private userService: UserService,
		private supportService: SupportService,
		private devService: DevService,
		private vantageShellService: VantageShellService,
		private commonService: CommonService,
		private modalService: NgbModal,
	) {
		this.cacheCleared = false;
		this.isBroswerVisible = false;
		this.isOnline = this.commonService.isOnline;
		this.metrics = vantageShellService.getMetrics();
		this.starterStatus = this.userService.getStarterIdStatus();
		this.everSignIn = this.userService.hadEverSignIn();
		if (!this.metrics) {
			this.devService.writeLog('ModalLenovoIdComponent constructor: metrics object is undefined');
			this.metrics = {
				sendAsync() {}
			};
		}
	}

	// Capture the html content in webView
	captureWebViewContent(msWebView) {
		const promise = new Promise(function (resolve, reject) {
			const op = msWebView.invokeScriptAsync('eval', 'document.documentElement.outerHTML');
			op.oncomplete = function (args) {
				resolve(args.target.result);
			};
			op.onerror = function (e) { reject(e); };
			op.start();
		});

		promise.then(function (result) {
			// For result
			//console.log(result);
		}).catch(function (error) {
			// Error
			console.log(error);
		});
		return promise;
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

		var header = 'lenovoId.ssoErrorTitle';
		var description = 'lenovoId.ssoErrorCommonEx';

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
		modalRef.componentInstance.CancelText = "";
		modalRef.componentInstance.header = header;
		modalRef.componentInstance.description = description;
	}

	ngOnInit() {

		this.commonService.notification.subscribe((notification: AppNotification) => {
			this.onNotification(notification);
		});

		if (!this.isOnline) {
			this.popupErrorMessage(ssoErroType.SSO_ErrorType_DisConnect);
			this.activeModal.dismiss();
			return;
		}

		interface MsWebView {
			src?: string;
		}

		const webView = document.querySelector('#lid-webview') as MsWebView;
		if (!this.cacheCleared) {
			// This is the link for SSO production environment
			webView.src = 'https://passport.lenovo.com/wauthen5/userLogout?lenovoid.action=uilogout&lenovoid.display=null';
			// This is the link for SSO dev environment
			//webView.src = 'https://uss-test.lenovomm.cn/wauthen5/userLogout?lenovoid.action=uilogout&lenovoid.display=null';
			this.cacheCleared = true;
		}
	}

	//
	// The input parameter 'locale' come from field 'locale' in machine info xml, 
	// it is system locale setting, this fucntion is to convert the locale to LID supported 17 languages.
	// here is map for each language:
	//	zh_CN: 中文(简体)
	// 	zh_HANT: 中文(繁体)
	//	da_DK: Dansk
	// 	de_DE: Deutsch
	//	en_US: English
	// 	fr_FR: Francais
	// 	it_IT: Italiano
	// 	ja_JP: 日本語
	// 	ko_kR: Korean
	//	no_NO: Norsk
	//  nl_NL: Nederlands
	//  pt_BR: Portugues(Brasi1)
	//  pt_PT: Portugues(Portugal)
	//  fi_FI: Suomi
	//  es_ES: Espanol
	//  sv_SE: Svenska
	//  ru_RU: Russian
	//
	getLidSupportedLanguageFromLocale(locale) {
		var lang = "en_US";
		switch (locale) {
			case "zh-hans":
				lang = "zh_CN";
				break;
			case "zh-hant":
				lang = "zh_HANT";
				break;
			case "da":
				lang = "da_DK";
				break;
			case "de":
				lang = "de_DE";
				break;
			case "en":
				lang = "en_US";
				break;
			case "fr":
				lang = "fr_FR";
				break;
			case "it":
				lang = "it_IT";
				break;
			case "ja":
				lang = "ja_JP";
				break;
			case "ko":
				lang = "ko_kR";
				break;
			case "no":
				lang = "no_NO";
				break;
			case "nl":
				lang = "nl_NL";
				break;
			case "pt_BR":
				lang = "pt_BR";
				break;
			case "pt":
				lang = "pt_PT";
				break;
			case "fi":
				lang = "fi_FI";
				break;
			case "es":
				lang = "es_ES";
				break;
			case "sv":
				lang = "sv_SE";
				break;
			case "ru":
				lang = "ru_RU";
				break;
			default:
				lang = "en_US";
				break;
		}
		return lang;
	}

	ngAfterViewInit() {
		// For typescript we need to declare the data types for ms-webView and variables exist in the functions and events
		interface WebViewEvent {
			isSuccess?: boolean;
			hasContent?: boolean;
		}

		interface MsWebView {
			src?: string;
			navigate?: Function;
			addEventListener?: Function;
			invokeScriptAsync?: Function;
		}

		const self = this;
		const webView = document.querySelector('#lid-webview') as MsWebView;
		// Get logon url and navigate to it
		self.userService.getLoginUrl().then((result) => {
			if (result.success && result.status === ssoErroType.SSO_ErrorType_NoErr) {
				var loginUrl = result.logonURL;
				if (loginUrl.indexOf('sso.lenovo.com') === -1) {
					self.devService.writeLog('User has already logged in');
					self.activeModal.dismiss();
					return;
				} else {
					// Change UI language to current system local or user selection saved in cookie
					self.supportService.getMachineInfo().then((machineInfo) => {
						let lang = self.userService.getLidLanguageSelectionFromCookies('https://passport.lenovo.com');
						if (lang != '') {
							loginUrl += "&lang=" + lang;
						} else {
							loginUrl += "&lang=" + self.getLidSupportedLanguageFromLocale(machineInfo.locale);
						}
						webView.src = loginUrl;
						self.devService.writeLog('Loading login page ', loginUrl);
					}, error => {
						webView.src = loginUrl;
						self.devService.writeLog('getMachineInfo() failed ' + error + ', loading default login page ' + loginUrl);
					});
				}
			} else {
				this.popupErrorMessage(result.status);
				self.devService.writeLog('getLoginUrl() failed ' + result.status);
				self.activeModal.dismiss();
			}
		});

		webView.addEventListener('MSWebViewNavigationCompleted', (EventArgs) => {
			const webViewEvent = EventArgs as WebViewEvent;
			if (webViewEvent.isSuccess) {
				if (EventArgs.uri.startsWith('https://passport.lenovo.com/wauthen5/userLogout?')) {
					return;
				}
				//if (EventArgs.uri.startsWith('https://uss-test.lenovomm.cn/wauthen5/userLogout?')) {
				//	return;
				//}
				self.isBroswerVisible = true;
				if (EventArgs.srcElement.documentTitle.startsWith('Login success')) {
					self.captureWebViewContent(webView).then((htmlContent: any) => {
						try {
							// Parse html content to get user info
							const parser = new DOMParser();
							const el = parser.parseFromString(htmlContent, 'text/html').documentElement;
							const username = (el.querySelector('#username') as HTMLInputElement).value;
							const useruad = (el.querySelector('#useruad') as HTMLInputElement).value;
							const userid = (el.querySelector('#userid') as HTMLInputElement).value;
							const userguid = (el.querySelector('#userguid') as HTMLInputElement).value;
							const firstname = (el.querySelector('#firstname') as HTMLInputElement).value;
							const lastname = (el.querySelector('#lastname') as HTMLInputElement).value;
							// Default to enable SSO after login success
							self.userService.enableSSO(useruad, username, userid, userguid).then(function (result) {
								if (result.success && result.status === 0) {
									self.userService.setName(firstname, lastname);
									self.userService.setToken(useruad);
									self.userService.setAuth(true);
									// Close logon dialog
									self.activeModal.dismiss();
									self.devService.writeLog('MSWebViewNavigationCompleted: Login success!');
									//the metrics need to be sent after enabling sso, some data like user guid would be available after that.
									self.userService.sendSigninMetrics('success', self.starterStatus, 'AlreadySignedIn', self.appFeature);
								}
							});
						} catch (error) {
							self.devService.writeLog('MSWebViewNavigationCompleted: ' + error);
						}
					})
						.catch(console.error);
				}
			} else {
				// Handle error
				//self.activeModal.dismiss();
				self.userService.sendSigninMetrics('failure', self.starterStatus, self.everSignIn, self.appFeature);
				self.devService.writeLog('MSWebViewNavigationCompleted: Login failed!');
			}
		});

		//
		// Create facebook new account within webview control will increase memory rapidly and crash app finally,
		//  this maybe issue with script running in facebook page.
		//  this is workaround borrow from Vantage 2.x to launch external browser and avoid the crash. 
		//  The side effect are:
		//  1, user have to back to the app and log in again after he/she created account in the brwoser; 
		//  2, if url was changed by facebook the workaround will not work anymore.
		//
		webView.addEventListener('MSWebViewNavigationStarting', (EventArgs) => {
			if (EventArgs.uri.indexOf("facebook.com/r.php") != -1 ||
				EventArgs.uri.indexOf("facebook.com/reg/") != -1) {
				// Open new window to launch default browser to create facebook account
				if (window) {
					window.open(EventArgs.uri);
				}
				// Prevent navigations to create facebook account
				EventArgs.preventDefault();
				return;
			} else {
				this.isBroswerVisible = false;
			}
		});
	}

	private onNotification(notification: AppNotification) {
		if (notification) {
			switch (notification.type) {
				case NetworkStatus.Online:
				case NetworkStatus.Offline:
					this.isOnline = notification.payload.isOnline;
					break;
				default:
					break;
			}
		}
	}

	

	onClose(): void {
		this.userService.sendSigninMetrics('failure(rc=UserCancelled)', this.starterStatus, this.everSignIn, this.appFeature);
		this.activeModal.dismiss();
	}

	ngOnDestroy(): void {
	}
}
