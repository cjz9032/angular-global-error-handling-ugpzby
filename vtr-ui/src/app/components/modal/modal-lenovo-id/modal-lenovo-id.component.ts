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

  //Capture the html content in webView
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
      //for result
      console.log(result);
    }).catch(function (error) {
      //error
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
    //for typescript we need to declare the data types for ms-webView and variables exist in the functions and events
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
    //TODO: call JS bridget to get logon url and navigate to it
    //var logonUrl = getLoginUrl();
    var logonUrl = 'https://passport.lenovo.com/wauthen5/userLogout?lenovoid.action=uilogout&lenovoid.display=null';
    if (logonUrl.indexOf("sso.lenovo.com") === -1) {
      return;
    } else {
      //TODO: set current lang to url
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
          //TODO: parse html content to get username, useruad, userid, userguid, firstname and lastname
          // and call JS bridget to enable sso, save firstname and lastname locally
          // EnableSSO(useruad, username, userid, userguid)
        }
      } else {
        //handle error
      }
    });
  }

  @HostListener('window:offline', ['$event']) onOffline() {
    this.isOnline = false;
    //TODO: show error message when network get disconnected
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
