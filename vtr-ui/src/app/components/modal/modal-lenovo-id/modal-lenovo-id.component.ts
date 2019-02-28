import { Component, OnInit, HostListener } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
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
  constructor(public activeModal: NgbActiveModal) {
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

    var webView = document.querySelector("#lid-webview") as MsWebView;
    // TODO: call JS bridge to get logon url and navigate to it
    //var logonUrl = getLoginUrl();
    //var logonUrl = 'https://sso.lenovo.com/ssoserver/authorizeclient/v1/login?aid=e4af23f9161ef931df61ef4a1af95fa16e91640af2bdd3dabee0f74309e5123b&did=6435aa64a36a7877afd654952a78cbabafa24bb3a0dd42f35d11484f514b80ab0&sid=5d155e36125acf071a5c1d8bd49032219fbb72832d271716d76f5fcdea17d80d&sign=6ee531118054a38be312e60ba2548b9af87e9ea429c7e1b8696a0cd3701901d0';
    var logonUrl = 'https://passport.lenovo.com/wauthen5/userLogout?lenovoid.action=uilogout&lenovoid.display=null';
    if (logonUrl.indexOf("sso.lenovo.com") === -1) {
      // TODO: Set success return code and close this logon dialog
      return;
    } else {
      // TODO: call JS bridge to get current system local and set to url
    }
    webView.src = logonUrl;
    var _this = this;
    webView.addEventListener("MSWebViewNavigationCompleted", function (EventArgs) {
      var webViewEvent = EventArgs as WebViewEvent;
      if (webViewEvent.isSuccess) {
        if (EventArgs.uri.startsWith("https://passport.lenovo.com/wauthen5/userLogout?")) {
          // Prevent the webview from opening URIs in the default browser.
          EventArgs.preventDefault();
          return;
        };
        if (EventArgs.srcElement.documentTitle.startsWith("Login success")) {
          var htmlContent = _this.captureWebViewContent(webView);
          // Parse html content to get username, useruad, userid, userguid, firstname and lastname
          var el = document.createElement('dummy_html');
          el.innerHTML = String(htmlContent);
          var username = el.getElementsByTagName('username');
          var useruad = el.getElementsByTagName('useruad');
          var userid = el.getElementsByTagName('userid');
          var userguid = el.getElementsByTagName('userguid');
          var firstname = el.getElementsByTagName('firstname');
          var lastname = el.getElementsByTagName('lastname');
          // TODO: call JS bridge to enable sso
          // EnableSSO(useruad, username, userid, userguid)
          // TODO: pass username, firstname and lastname to global scope (eg. via common service), 
          // UI will show them in common header

        }
      } else {
        // Handle error
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
