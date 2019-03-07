import { Component, OnInit, HostListener, AfterViewInit, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../services/user/user.service';
import { Subscription, timer } from 'rxjs';

// TODO: Create facebook new account within UWP WebView control will increase memory rapidly and crash app fianlly,
// Test if same issue happen in WINJS webview control.
// Verified the same issue happen in MS-webview control. Need to fix.

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
		private userService: UserService
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
				const loginUrl = result.logonURL;
				if (loginUrl.indexOf('sso.lenovo.com') === -1) {
					self.activeModal.dismiss();
					console.log('user already logged in');
					return;
				} else {
					// TODO: call JS bridge to get current system local and set to url
				}
				webView.src = loginUrl;
			}
		});

		webView.addEventListener('MSWebViewNavigationCompleted', (EventArgs) => {
			const webViewEvent = EventArgs as WebViewEvent;
			if (webViewEvent.isSuccess) {
				if (EventArgs.uri.startsWith('https://passport.lenovo.com/wauthen5/userLogout?')) {
					// Prevent the webview from opening URIs in the default browser.
					// EventArgs.preventDefault();
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
									console.log('login success');
								}
							});
						} catch (error) {
							console.log(error);
						}
					})
						.catch(console.error);
				}
			} else {
				// Handle error
				self.activeModal.dismiss();
				console.log('login not success');
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
