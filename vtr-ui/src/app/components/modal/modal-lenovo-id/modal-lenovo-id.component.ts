import { Component, OnInit, HostListener, AfterViewInit, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../services/user/user.service';
import { Subscription, timer } from 'rxjs';
import { SupportService } from '../../../services/support/support.service';
import { DevService } from '../../../services/dev/dev.service';

@Component({
	selector: 'vtr-modal-lenovo-id',
	templateUrl: './modal-lenovo-id.component.html',
	styleUrls: ['./modal-lenovo-id.component.scss']
})
export class ModalLenovoIdComponent implements OnInit, AfterViewInit, OnDestroy {
	public isOnline: boolean;
	private cacheCleared: boolean;
	private detectConnectionStatusSub: Subscription;
	private detectConnectionStatusTimer = timer(5000, 5000);
	constructor(
		public activeModal: NgbActiveModal,
		private userService: UserService,
		private supportService: SupportService,
		private devService: DevService
	) {
		this.isOnline = false;
		this.cacheCleared = false;
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
			console.log(result);
		}).catch(function (error) {
			// Error
		});
		return promise;
	}

	ngOnInit() {
		interface MsWebView {
			src?: string;
		}

		const webView = document.querySelector('#lid-webview') as MsWebView;
		if (!this.cacheCleared) {
			webView.src = 'https://passport.lenovo.com/wauthen5/userLogout?lenovoid.action=uilogout&lenovoid.display=null';
			this.cacheCleared = true;
		}
	}

	//
	// TODO: The input parameter 'locale' come from field 'locale' in macine info xml, 
	// it is system locale setting, this fucntion is to convert the locale to LID supported 13 languages.
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
		switch(locale) {
			case "en":
				lang = "en_US";	// change this for testing
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
			if (result.success && result.status === 0) {
				var loginUrl = result.logonURL;
				if (loginUrl.indexOf('sso.lenovo.com') === -1) {
					self.activeModal.dismiss();
					self.devService.writeLog('User has already logged in');
					return;
				} else {
					// Get current system local and set to url
					self.supportService.getMachineInfo().then((machineInfo) => {
						webView.src = loginUrl + "&lang=" + self.getLidSupportedLanguageFromLocale(machineInfo.locale);
						self.devService.writeLog('Loading login page, logon url is ', webView.src);
					}, error => {
						self.devService.writeLog('getMachineInfo() failed, error: ' + error + ', loading logon url with default language en_US');
						webView.src = loginUrl;
					});
				}
			}
		});

		webView.addEventListener('MSWebViewNavigationCompleted', (EventArgs) => {
			const webViewEvent = EventArgs as WebViewEvent;
			if (webViewEvent.isSuccess) {
				if (EventArgs.uri.startsWith('https://passport.lenovo.com/wauthen5/userLogout?')) {
					return;
				}
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
				self.activeModal.dismiss();
				self.devService.writeLog('MSWebViewNavigationCompleted: Login failed!');
			}
		});

		//
		// Create facebook new account within webview control will increase memory rapidly and crash app finally,
		//  this maybe issue with script running in facebook page.
		//  this is workaround borrow from Vantage 2.x to launch external browser and avoid the crash. 
		//  The side effect are:
		//  1, user have to back to the app and log in again after he/she created account in the brwoser; 
		//  2, if url was changed by facebook the workarround will not work anymore.
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
			}
		});
	}

	@HostListener('window:offline', ['$event']) onOffline() {
		this.isOnline = false;
		// TODO: show error message when network get disconnected
		// PopErrorMessage(SSOErrorType.SSO_ErrorType_DisConnect);
		// "Oops! Connection failed! Please check your Internet connection and try again."
		if (this.detectConnectionStatusSub) {
			this.detectConnectionStatusSub.unsubscribe();
		}
	}

	@HostListener('window:online', ['$event']) onOnline() {
		this.isOnline = true;
		this.detectConnectionStatusSub = this.detectConnectionStatusTimer.subscribe(() => {
			this.detectConnectionStatusSub.unsubscribe();
			window.location.reload();
		});
	}

	ngOnDestroy(): void {
		if (this.detectConnectionStatusSub) {
			this.detectConnectionStatusSub.unsubscribe();
		}
	}

}
