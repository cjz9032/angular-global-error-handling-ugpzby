import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
 

@Component({
  selector: 'vtr-modal-lenovo-id',
  templateUrl: './modal-lenovo-id.component.html',
  styleUrls: ['./modal-lenovo-id.component.scss']
})
export class ModalLenovoIdComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) {
 
  }

  ngOnInit() {
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
      //...more interface you need
    }

    var webView = document.querySelector("#lid-webview") as MsWebView;
    webView.src = 'https://passport.lenovo.com/wauthen5/userLogout?lenovoid.action=uilogout&lenovoid.display=null';
    var _this = this;
    webView.addEventListener("MSWebViewNavigationCompleted", function (EventArgs) {
      var webViewEvent = EventArgs as WebViewEvent;
      if (webViewEvent.isSuccess) {
		  alert("s");
        //_this.captureWebViewContent(webView);
      } else {
		//handle error
		this.activeModal.dismiss();
		console.log("not success");
		
      }
    });
  }

}
