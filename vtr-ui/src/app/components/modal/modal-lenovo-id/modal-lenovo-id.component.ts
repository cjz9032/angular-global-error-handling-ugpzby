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
	private webView = null;

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
		const win: any = window;
		if (win.webviewPopup) {
			this.webView = win.webviewPopup;
		}
		this.starterStatus = this.userService.getStarterIdStatus();
		this.everSignIn = this.userService.hadEverSignIn();
		if (!this.metrics) {
			this.devService.writeLog('ModalLenovoIdComponent constructor: metrics object is undefined');
			this.metrics = {
				sendAsync() { }
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

		if (!this.webView) {
			this.devService.writeLog('ModalLenovoIdComponent constructor: webView object is undefined, critical error exit!');
			this.activeModal.dismiss();
			return;
		}
		
		if (!navigator.onLine) {
			this.popupErrorMessage(ssoErroType.SSO_ErrorType_DisConnect);
			this.activeModal.dismiss();
			return;
		}

		this.webView.create("<div style='display: block;position: fixed;z-index: 1;padding-top:5%;width: 100%;height: 100%;overflow: auto;background-color: rgb(0,0,0);background-color: rgba(0,0,0,0.4);'>  <div style='position: relative;background-color: #fefefe;margin: auto;padding: auto;border: 1px solid #888;max-width: 460px;height: 80%;'>  <style>.close {  color: black;  float: right;  font-size: 28px;  font-weight: bold;}.close:hover,.close:focus {  color: black;  text-decoration: none;  cursor: pointer;} @keyframes spinner {  to {transform: rotate(360deg);}} .spinner:before {  content: '';  box-sizing: border-box;  position: absolute;  top: 50%;  left: 50%;  width: 60px;  height: 60px;  margin-top: -15px;  margin-left: -30px;  border-radius: 50%;  border: 3px solid #ccc;  border-top-color: #07d;  animation: spinner .6s linear infinite;} </style>  <div id='btnClose' style='padding: 2px 16px;background-color: white;color: black;border-bottom: 1px solid #e5e5e5;'>  <span class='close'>&times;</span> <div style='height:45px;'></div>  </div>    <div style='height: 100%;' id='webviewBorder'> <div id='spinnerCtrl' class='spinner'></div> <div id='webviewPlaceHolder'></div>    </div>  </div></div>");
		this.webView.show();
		this.webView.addEventListener("eventtriggered", this.onEvent.bind(this));
		this.webView.addEventListener("navigationstarting", this.onNavigationStart.bind(this));
		this.webView.addEventListener("navigationcompleted", this.onNavigationCompleted.bind(this));

		if (!this.cacheCleared) {
			// Hide browser while clearing cache
			this.webView.changeVisibility('webviewPlaceHolder', false);
			// This is the link for SSO production environment
			this.webView.navigate('https://passport.lenovo.com/wauthen5/userLogout?lenovoid.action=uilogout&lenovoid.display=null');
			// This is the link for SSO dev environment
			//this.webView.navigate('https://uss-test.lenovomm.cn/wauthen5/userLogout?lenovoid.action=uilogout&lenovoid.display=null');
			this.cacheCleared = true;
		}
	}

	onEvent(e) {
		if (!e.target) {
			return;
		}
		const eventData = JSON.parse(e.target);
		if (eventData && eventData.event === 'click' && eventData.id === 'btnClose') {
			this.userService.sendSigninMetrics('failure(rc=UserCancelled)', this.starterStatus, this.everSignIn, this.appFeature);
			this.activeModal.dismiss();
		}
	}

	//
	// Create facebook new account within webview control will increase memory rapidly and crash app finally,
	//  this maybe issue with script running in facebook page.
	//  this is workaround borrow from Vantage 2.x to launch external browser and avoid the crash. 
	//  The side effect are:
	//  1, user have to back to the app and log in again after he/she created account in the brwoser; 
	//  2, if url was changed by facebook the workaround will not work anymore.
	//
	onNavigationStart(e) {
		const self = this;
		if (!e.target) {
			return;
		}
		const url = e.target;
		if (url.indexOf("facebook.com/r.php") != -1 ||
			url.indexOf("facebook.com/reg/") != -1) {
			// Open new window to launch default browser to create facebook account
			if (window) {
				window.open(url);
			}
			// BUGBUG: shell does not provide similar function
			// Prevent navigations to create facebook account
			//EventArgs.preventDefault();
			return;
		} else {
			self.webView.changeVisibility('webviewPlaceHolder', false);
		}
	}

	onNavigationCompleted(e) {
		const self = this;
		if (!e.target) {
			return;
		}
		const eventData = JSON.parse(e.target);
		if (eventData.isSuccess) {
			if (eventData.url.startsWith('https://passport.lenovo.com/wauthen5/userLogout?')) {
				return;
			}
			//if (eventData.url.startsWith('https://uss-test.lenovomm.cn/wauthen5/userLogout?')) {
			//	return;
			//}
			self.webView.changeVisibility('spinnerCtrl', false);
			self.webView.changeVisibility('webviewPlaceHolder', true);
			let htmlContent = eventData.content;
			try {
				// Parse html content to get user info
				const parser = new DOMParser();
				const doc = parser.parseFromString(htmlContent, 'text/html');
				const el = doc.documentElement;
				const title = doc.getElementsByTagName("title")[0].childNodes[0].nodeValue;
				if (title.startsWith('Login success')) {
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
							self.webView.close();
							self.activeModal.dismiss();
							self.devService.writeLog('onNavigationCompleted: Login success!');
							// The metrics need to be sent after enabling sso, some data like user guid would be available after that.
							self.userService.sendSigninMetrics('success', self.starterStatus, self.everSignIn, self.appFeature);
						}
					});
				}
			}
			catch (error) {
				self.devService.writeLog('onNavigationCompleted: ' + error);
			}
		} else {
			// Handle error
			self.activeModal.dismiss();
			self.userService.sendSigninMetrics('failure', self.starterStatus, self.everSignIn, self.appFeature);
			self.devService.writeLog('onNavigationCompleted: Login failed!');
		}
	}

	//
	// The input parameter 'locale' come from field 'locale' in machine info xml, 
	// it is system locale setting, this fucntion is to convert the locale to LID supported 16 languages.
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
				lang = "ko_KR";
				break;
			case "nb":
				lang = "no_NO";
				break;
			case "nl":
				lang = "nl_NL";
				break;
			case "pt-br":
				lang = "pt_BR";
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

	isLidSupportedLanguage(lang) {
		let supportedLangs = ["zh_CN", "zh_HANT", "da_DK", "de_DE", "en_US", "fr_FR", "it_IT", "ja_JP", "ko_KR", "no_NO", "nl_NL", "pt_BR", "fi_FI", "es_ES", "sv_SE", "ru_RU"];
		return supportedLangs.includes(lang, 0);
	}

	ngAfterViewInit() {
		const self = this;
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
							if (self.isLidSupportedLanguage(lang)) {
								loginUrl += "&lang=" + lang;
							} else {
								loginUrl += "&lang=en_US";
							}
						} else {
							loginUrl += "&lang=" + self.getLidSupportedLanguageFromLocale(machineInfo.locale);
						}
						self.webView.navigate(loginUrl);
						self.devService.writeLog('Loading login page ', loginUrl);
					}, error => {
						self.webView.navigate(loginUrl);
						self.devService.writeLog('getMachineInfo() failed ' + error + ', loading default login page ' + loginUrl);
					});
				}
			} else {
				self.webView.close();
				self.popupErrorMessage(result.status);
				self.devService.writeLog('getLoginUrl() failed ' + result.status);
				self.activeModal.dismiss();
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

	ngOnDestroy(): void {
		this.webView.close();
	}
}
