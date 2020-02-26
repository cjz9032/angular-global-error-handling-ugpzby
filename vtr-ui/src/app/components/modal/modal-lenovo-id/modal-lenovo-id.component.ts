import { Component, OnInit, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../services/user/user.service';
import { SupportService } from '../../../services/support/support.service';
import { DevService } from '../../../services/dev/dev.service';
import { VantageShellService } from '../../../services/vantage-shell/vantage-shell.service';
import { CommonService } from 'src/app/services/common/common.service';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { Subscription } from 'rxjs/internal/Subscription';
import { ssoErroType } from 'src/app/enums/lenovo-id-key.enum';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import AES from 'crypto-js/aes';

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
	private eventBind: any;
	private startBind: any;
	private completeBInd: any;
	private notificationSubscription: Subscription;
	readonly KEYCODE_RETURN = 13;

	constructor(
		public activeModal: NgbActiveModal,
		private userService: UserService,
		private supportService: SupportService,
		private devService: DevService,
		private vantageShellService: VantageShellService,
		private commonService: CommonService,
		private modalService: NgbModal
	) {
		this.cacheCleared = false;
		this.isBroswerVisible = false;
		this.isOnline = this.commonService.isOnline;
		this.notificationSubscription = this.commonService.notification.subscribe((notification: AppNotification) => {
			this.onNotification(notification);
		});
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

	async ngOnInit() {
		if (!this.webView) {
			this.devService.writeLog('ModalLenovoIdComponent constructor: webView object is undefined, critical error exit!');
			this.activeModal.dismiss();
			return;
		}

		const webDom = `
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

		await this.webView.create(webDom);

		await this.webView.show();
		this.eventBind = this.onEvent.bind(this);
		this.startBind = this.onNavigationStart.bind(this);
		this.completeBInd = this.onNavigationCompleted.bind(this);
		this.webView.addEventListener('eventtriggered', this.eventBind);
		this.webView.addEventListener('navigationstarting', this.startBind);
		this.webView.addEventListener('navigationcompleted', this.completeBInd);

		if (!this.cacheCleared) {
			// Hide browser while clearing cache
			await this.webView.changeVisibility('webviewPlaceHolder', false);
			this.isBroswerVisible = false;

			// This is the link to clear cache for SSO production environment
			await this.webView.navigate('https://passport.lenovo.com/wauthen5/userLogout?lenovoid.action=uilogout&lenovoid.display=null');
			this.cacheCleared = true;
		}
	}

	onEvent(e) {
		if (!e) {
			return;
		}
		const eventData = JSON.parse(e);
		if (eventData) {
			if ((eventData.event === 'click' && eventData.id === 'btnClose') ||
				(eventData.event === 'keypress' && eventData.id === 'btnClose' && eventData.keyCode === this.KEYCODE_RETURN)) {
				this.userService.sendSigninMetrics('failure(rc=UserCancelled)', this.starterStatus, this.everSignIn, this.appFeature);
				this.activeModal.dismiss();
			}
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
	async onNavigationStart(e) {
		if (!e) {
			return;
		}
		const url = e;

		if (url.indexOf('facebook.com/r.php') !== -1 ||
			url.indexOf('facebook.com/reg/') !== -1) {
			// Open new window to launch default browser to create facebook account
			if (window) {
				window.open(url);
			}
			// BUGBUG: shell does not provide similar function
			// Prevent navigations to create facebook account
			// EventArgs.preventDefault();
			return;
		}

		if (url.indexOf('passport.lenovo.com/wauthen5/userLogin') !== -1 ||
			url.indexOf('sso.lenovo.com') !== -1 ||
			url.indexOf('facebook.com') !== -1 ||
			url.indexOf('accounts.google.com') !== -1 ||
			url.indexOf('login.live.com') !== -1 ||
			url.indexOf('login.yahoo.co.jp') !== -1) {
			this.setFocus('txtClose');
			this.isBroswerVisible = false;
			await this.webView.changeVisibility('spinnerCtrl', true);
			await this.webView.changeVisibility('webviewPlaceHolder', false);
		}
	}

	async onNavigationCompleted(e) {
		const self = this;
		if (!e) {
			return;
		}
		const eventData = JSON.parse(e);
		if (eventData.isSuccess) {
			if (eventData.url.startsWith('https://passport.lenovo.com/wauthen5/userLogout?')) {
				return;
			}
			self.isBroswerVisible = true;
			setTimeout(() => {
				self.setFocus('webviewPlaceHolder');
			}, 0);
			await self.webView.changeVisibility('spinnerCtrl', false);
			await self.webView.changeVisibility('webviewPlaceHolder', true);
			const htmlContent = eventData.content;
			try {
				// Parse html content to get user info
				const parser = new DOMParser();
				const doc = parser.parseFromString(htmlContent, 'text/html');
				const el = doc.documentElement;
				const title = doc.getElementsByTagName('title')[0].childNodes[0].nodeValue;
				if (title.startsWith('Login success')) {
					const username = (el.querySelector('#username') as HTMLInputElement).value;
					const useruad = (el.querySelector('#useruad') as HTMLInputElement).value;
					const userid = (el.querySelector('#userid') as HTMLInputElement).value;
					const userguid = (el.querySelector('#userguid') as HTMLInputElement).value;
					const firstname = (el.querySelector('#firstname') as HTMLInputElement).value;
					const lastname = (el.querySelector('#lastname') as HTMLInputElement).value;
					if (firstname && userguid) {
						const encryptedFirstName = AES.encrypt(firstname, userguid).toString();
						this.commonService.setLocalStorageValue(LocalStorageKey.LidUserFirstName, encryptedFirstName);
					}
					// Default to enable SSO after login success
					self.userService.enableSSO(useruad, username, userid, userguid).then(result => {
						if (result.success && result.status === 0) {
							self.userService.setName(firstname, lastname);
							self.userService.setAuth(true);
							// Close logon dialog
							self.activeModal.dismiss();
							self.devService.writeLog('onNavigationCompleted: Login success!');
							// The metrics need to be sent after enabling sso, some data like user guid would be available after that.
							self.userService.sendSigninMetrics('success', self.starterStatus, self.everSignIn, self.appFeature);
						}
					});
				}
			} catch (error) {
				self.devService.writeLog('onNavigationCompleted: ' + error);
			}
		} else {
			// Handle error
			self.userService.popupErrorMessage(ssoErroType.SSO_ErrorType_UnknownCrashed);
			self.devService.writeLog('onNavigationCompleted: navigation completed unsuccessfully!');
			self.userService.sendSigninMetrics('failure', self.starterStatus, self.everSignIn, self.appFeature);
			self.activeModal.dismiss();
		}
	}

	//
	// The input parameter 'locale' come from field 'locale' in machine info xml,
	// it is system locale setting, this fucntion is to convert the locale to LID supported 16 languages.
	// here is map for each language:
	// 	zh_CN: 中文(简体)
	// 	zh_HANT: 中文(繁体)
	// 	da_DK: Dansk
	// 	de_DE: Deutsch
	// 	en_US: English
	// 	fr_FR: Francais
	// 	it_IT: Italiano
	// 	ja_JP: 日本語
	// 	ko_kR: Korean
	// 	no_NO: Norsk
	//  nl_NL: Nederlands
	//  pt_BR: Portugues(Brasi1)
	//  fi_FI: Suomi
	//  es_ES: Espanol
	//  sv_SE: Svenska
	//  ru_RU: Russian
	//
	getLidSupportedLanguageFromLocale(locale) {
		let lang = 'en_US';
		switch (locale) {
			case 'zh-hans':
				lang = 'zh_CN';
				break;
			case 'zh-hant':
				lang = 'zh_HANT';
				break;
			case 'da':
				lang = 'da_DK';
				break;
			case 'de':
				lang = 'de_DE';
				break;
			case 'en':
				lang = 'en_US';
				break;
			case 'fr':
				lang = 'fr_FR';
				break;
			case 'it':
				lang = 'it_IT';
				break;
			case 'ja':
				lang = 'ja_JP';
				break;
			case 'ko':
				lang = 'ko_KR';
				break;
			case 'nb':
				lang = 'no_NO';
				break;
			case 'nl':
				lang = 'nl_NL';
				break;
			case 'pt-br':
				lang = 'pt_BR';
				break;
			case 'fi':
				lang = 'fi_FI';
				break;
			case 'es':
				lang = 'es_ES';
				break;
			case 'sv':
				lang = 'sv_SE';
				break;
			case 'ru':
				lang = 'ru_RU';
				break;
			default:
				lang = 'en_US';
				break;
		}
		return lang;
	}

	isLidSupportedLanguage(lang) {
		const supportedLangs = ['zh_CN', 'zh_HANT', 'da_DK', 'de_DE', 'en_US', 'fr_FR', 'it_IT', 'ja_JP', 'ko_KR', 'no_NO', 'nl_NL', 'pt_BR', 'fi_FI', 'es_ES', 'sv_SE', 'ru_RU'];
		return supportedLangs.includes(lang, 0);
	}

	ngAfterViewInit() {
		const self = this;
		// Get logon url and navigate to it
		self.userService.getLoginUrl().then((result) => {
			if (result.success && result.status === ssoErroType.SSO_ErrorType_NoErr) {
				let loginUrl = result.logonURL;
				if (loginUrl.indexOf('sso.lenovo.com') === -1) {
					self.devService.writeLog('User has already logged in');
					self.activeModal.dismiss();
					return;
				} else {
					// Change UI language to current system local or user selection saved in cookie
					self.supportService.getMachineInfo().then(async (machineInfo) => {
						const lang = self.userService.getLidLanguageSelectionFromCookies('https://passport.lenovo.com');
						if (lang !== '') {
							if (self.isLidSupportedLanguage(lang)) {
								loginUrl += '&lang=' + lang;
							} else {
								loginUrl += '&lang=en_US';
							}
						} else {
							loginUrl += '&lang=' + self.getLidSupportedLanguageFromLocale(machineInfo.locale);
						}
						await self.webView.navigate(loginUrl);
						self.devService.writeLog('Loading login page ', loginUrl);
					}, async error => {
						await self.webView.navigate(loginUrl);
						self.devService.writeLog('getMachineInfo() failed ' + error + ', loading default login page ' + loginUrl);
					});
				}
			} else {
				self.userService.popupErrorMessage(result.status);
				self.devService.writeLog('getLoginUrl() failed ' + result.status);
				self.activeModal.dismiss();
			}
		}).catch((error) => {
			if (error && error.errorcode === 513) {
				self.userService.popupErrorMessage(ssoErroType.SSO_ErrorType_AccountPluginDoesnotExist);
			} else {
				self.userService.popupErrorMessage(ssoErroType.SSO_ErrorType_UnknownCrashed);
			}
			self.activeModal.dismiss();
		});

	}

	private onNotification(notification: AppNotification) {
		if (notification) {
			switch (notification.type) {
				case NetworkStatus.Online:
				case NetworkStatus.Offline:
					this.devService.writeLog('onNotification() NetworkStatus: ' + notification.type);
					const currentIsOnline = notification.payload.isOnline;
					if (!currentIsOnline && this.isOnline !== currentIsOnline) {
						this.userService.popupErrorMessage(ssoErroType.SSO_ErrorType_DisConnect);
						this.activeModal.dismiss();
					}
					this.isOnline = currentIsOnline;
					break;
				default:
					break;
			}
		}
	}

	async ngOnDestroy(): Promise<void> {
		// Before close, stop on-going navigation.
		await this.webView.navigate('about:blank');

		if (this.webView) {
			this.webView.removeEventListener('eventtriggered', this.eventBind);
			this.webView.removeEventListener('navigationstarting', this.startBind);
			this.webView.removeEventListener('navigationcompleted', this.completeBInd);
			await this.webView.close();
			// Should not set webview to null, otherwise other references to webview will possibly raise unhandled null reference exception (FR: 5%)
			// underlayer wrapper of webview in Vantage shell still has valid webview after close().
		}
		if (this.notificationSubscription) {
			this.notificationSubscription.unsubscribe();
		}
	}

	private setFocus(id: string) {
		if (typeof this.webView.setFocus === 'function') {
			this.webView.setFocus(id);
		}
	}

	@HostListener('document:keydown', ['$event'])
	onKeyDown(event: KeyboardEvent) {
		if (event.key.toUpperCase() === 'TAB') {
			// Tab key pressed
			if (document.activeElement.tagName.toUpperCase() === 'BODY') {
				// Focus leave webview, set focus to close button
				this.setFocus('txtClose');
				event.preventDefault();
				event.stopPropagation();
			} else if (document.activeElement.tagName.toUpperCase() === 'NGB-MODAL-WINDOW') {
				// This is first tab key press or press during loading
				if (this.isBroswerVisible) {
					this.setFocus('webviewPlaceHolder');
				} else {
					this.setFocus('txtClose');
				}
				event.preventDefault();
				event.stopPropagation();
			}
		}
	}

	@HostListener('window: focus')
	onFocus(): void {
		const modal = document.querySelector('.lenovo-id-modal-size') as HTMLElement;
		modal.focus();
	}
}
