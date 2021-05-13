import { Component, NgZone } from "@angular/core";
// import { zone } from 'zone.js';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";

const script = document.createElement("script");
script.src = "./scripts/fullstory.js";
document.head.appendChild(script);

/**
 * @title Basic progress-spinner
 */
@Component({
  selector: "app",
  templateUrl: "app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  constructor(private http: HttpClient, private ngZone: NgZone) {}

  localErrorInZone() {

    this.ngZone.run(() => {
      // throw Error("The app component has thrown an error with zone!");
      new Promise((r,f)=>f('fff'))

      this.ngZone.run(() => {
        throw Error("The app component has thrown an error with zone!");
      });
    });

  
  }

  localError() {
    throw Error("The app component has thrown an error!");
  }

  failingRequest() {
      this.http
        .get("https://httpstat.us/404?sleep=2000")
        .toPromise()
        .catch((error: HttpErrorResponse) => {

        })
   
  }

  successfulRequest() {
    this.http.get("https://httpstat.us/200?sleep=2000").toPromise();
  }
}

// setTimeout(() => {
//   // @ts-ignore
//   this.aaa = 1;
// }, 1000);

// window.onerror = function (errorMsg, url, lineNumber, c, d) {
//   alert(errorMsg + " " + lineNumber);
// };

// var qq = new Promise((t, f) => {
//   f();
//   // @ts-ignore
//   this.aaa = 1;
// });
// qq.then(() => {});

// setTimeout(() => {
//   var qq = new Promise((t, f) => {
//     f();
//     // @ts-ignore
//     this.aaa = 1;
//   });
//   qq.then(() => {});
// }, 3000);

/**  Copyright 2020 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */
