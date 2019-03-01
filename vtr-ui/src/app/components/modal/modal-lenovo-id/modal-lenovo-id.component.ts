import { Component, OnInit, HostListener } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../services/user/user.service';
//import { VantageShellService } from '../../../services/vantage-shell/vantage-shell.service'
import { Subscription, timer } from "rxjs";

//TODO: Create facebook new account within UWP WebView control will increase memory rapidly and crash app fianlly,
// Test if same issue happen in WINJS webview control.

@Component({
  selector: 'vtr-modal-lenovo-id',
  templateUrl: './modal-lenovo-id.component.html',
  styleUrls: ['./modal-lenovo-id.component.scss']
})
export class ModalLenovoIdComponent implements OnInit {
  public isOnline: boolean;
  private cacheCleared: boolean;
  private detectConnectionStatusSub: Subscription;
  private detectConnectionStatusTimer = timer(5000, 5000);
  constructor(
    public activeModal: NgbActiveModal,
    private userService: UserService,
    //private vantageShellService: VantageShellService
  ) {
    this.isOnline = false;
    this.cacheCleared = false;
  }

  // Capture the html content in webView
  captureWebViewContent(msWebView) {
    var promise = new Promise(function (resolve, reject) {
      var op = msWebView.invokeScriptAsync("eval", "document.documentElement.outerHTML");
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
      src?: string
    }

    var webView = document.querySelector("#lid-webview") as MsWebView;
    if (!this.cacheCleared) {
      webView.src = 'https://passport.lenovo.com/wauthen5/userLogout?lenovoid.action=uilogout&lenovoid.display=null';
      this.cacheCleared = true;
    }
  }

  ngAfterViewInit() {
    // For typescript we need to declare the data types for ms-webView and variables exist in the functions and events
    interface WebViewEvent {
      isSuccess?: boolean
      hasContent?: boolean
    }

    interface MsWebView {
      src?: string
      navigate?: Function
      addEventListener?: Function
      invokeScriptAsync?: Function
    }

    var self = this;
    var webView = document.querySelector("#lid-webview") as MsWebView;
    // TODO: call JS bridge to get logon url and navigate to it
    //var loginUrl = self.vantageShellService.getLoginUrl();
    //var logonUrl = 'https://sso.lenovo.com/ssoserver/authorizeclient/v1/login?aid=e4af23f9161ef931df61ef4a1af95fa16e91640af2bdd3dabee0f74309e5123b&did=6435aa64a36a7877afd654952a78cbabafa24bb3a0dd42f35d11484f514b80ab0&sid=5c13238222d5c3a0a4ff930ea5de6c5a24875dbb63ef6d6837be1dc972a03591&sign=d7b7806c03fc5594f01c8ee77d73b494c1f99070f9e508013666b463e3a75a3b';
    var loginUrl = 'https://passport.lenovo.com/wauthen5/userLogout?lenovoid.action=uilogout&lenovoid.display=null';
    //Uncomment when use logon url from JS bridge
    //if (loginUrl.indexOf("sso.lenovo.com") === -1) {
      // TODO: Set success return code and close this logon dialog
    //  return;
    //} else {
      // TODO: call JS bridge to get current system local and set to url
    //}
    webView.src = loginUrl;
    webView.addEventListener("MSWebViewNavigationCompleted", function (EventArgs) {
      var webViewEvent = EventArgs as WebViewEvent;
      if (webViewEvent.isSuccess) {
        if (EventArgs.uri.startsWith("https://passport.lenovo.com/wauthen5/userLogout?")) {
          // Prevent the webview from opening URIs in the default browser.
          EventArgs.preventDefault();
          return;
        };
        if (EventArgs.srcElement.documentTitle.startsWith("Login success")) {
          self.captureWebViewContent(webView).then((htmlContent: any) => {
            try {
              // Parse html content to get user info
              var parser = new DOMParser();
              var el = parser.parseFromString(htmlContent, "text/html").documentElement;
              var username = (el.querySelector('#username') as HTMLInputElement).value;
              var useruad = (el.querySelector('#useruad') as HTMLInputElement).value;
              var userid = (el.querySelector('#userid') as HTMLInputElement).value;
              var userguid = (el.querySelector('#userguid') as HTMLInputElement).value;
              var firstname = (el.querySelector('#firstname') as HTMLInputElement).value;
              var lastname = (el.querySelector('#lastname') as HTMLInputElement).value;
              // TODO: call JS bridge to enable sso
              // Phoenix.EnableSSO(useruad, username, userid, userguid)
              self.userService.setName(firstname, lastname);
              self.userService.setToken(useruad);
              self.userService.setAuth();
              // Close logon dialog
              self.activeModal.dismiss();
              console.log("login success");
            } catch(error) {
              console.log(error);
            }
          })
          .catch(console.error);
        }
      } else {
        // Handle error
        this.activeModal.dismiss();
        console.log("login not success");
      }
    });
  }

  @HostListener('window:offline', ['$event']) onOffline() {
    this.isOnline = false;
    // TODO: show error message when network get disconnected
    //PopErrorMessage(SSOErrorType.SSO_ErrorType_DisConnect);
    //"Oops! Connection failed! Please check your Internet connection and try again."
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
