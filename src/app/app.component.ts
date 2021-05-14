import { Component, NgZone } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import "zone.js";
// import "zone.js/dist/zone";
// const script = document.createElement("script");
// script.src = "./scripts/fullstory.js";
// document.head.appendChild(script);

/**
 * @title Basic progress-spinner
 */
@Component({
  selector: "app",
  templateUrl: "app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
	public someCode: string = '';


  constructor(private http: HttpClient, private ngZone: NgZone) {}

  localErrorInZone() {
    let timingZone = Zone.current.fork({
      name: "timingZone",
      onInvoke: function (
        parentZoneDelegate,
        currentZone,
        targetZone,
        callback,
        applyThis,
        applyArgs,
        source
      ) {
        var start = performance.now();
        parentZoneDelegate.invoke(
          targetZone,
          callback,
          applyThis,
          applyArgs,
          source
        );
        var end = performance.now();
        console.log(
          "Zone:",
          targetZone.name,
          "Intercepting zone:",
          currentZone.name,
          "Duration:",
          end - start
        );
      },
    });
    let logZone = timingZone.fork({
      name: "logZone",
      onInvoke: function (
        parentZoneDelegate,
        currentZone,
        targetZone,
        callback,
        applyThis,
        applyArgs,
        source
      ) {
        console.log(
          "Zone:",
          targetZone.name,
          "Intercepting zone:",
          currentZone.name,
          "enter"
        );
        parentZoneDelegate.invoke(
          targetZone,
          callback,
          applyThis,
          applyArgs,
          source
        );
        console.log(
          "Zone:",
          targetZone.name,
          "Intercepting zone:",
          currentZone.name,
          "leave"
        );
      },
    });
    let appZone = logZone.fork({ name: "appZone" });

    appZone.run(function myApp() {
      console.log("Zone:", Zone.current.name, "Hello World!");
    });
    return;

    console.log(Zone.current);

    this.ngZone.onError.subscribe((err) => {
      console.log("zone");
      console.log(err);
      debugger;
    });

    const newZone = Zone.current.fork({
      name: "feat-a",
      onInvoke: function (
        parentZoneDelegate,
        currentZone,
        targetZone,
        callback,
        applyThis,
        applyArgs,
        source
      ) {
        console.log(
          "Zone:",
          targetZone.name,
          "Intercepting zone:",
          currentZone.name,
          "enter"
        );
        debugger;
        parentZoneDelegate.invoke(
          targetZone.parent!,
          callback,
          applyThis,
          applyArgs,
          source
        );
        console.log(
          "Zone:",
          targetZone.name,
          "Intercepting zone:",
          currentZone.name,
          "leave"
        );
      },
      onHandleError(
        parentZoneDelegate: ZoneDelegate,
        currentZone: Zone,
        targetZone: Zone,
        error: any
      ) {
        debugger;
        return false;
      },
    });

    debugger;

    newZone.runGuarded(() => {
      //@ts-ignore
      // this.aa.xx = 1;
      console.log(Zone.current);

      debugger;
    });

    // zone.run(() => {
    //   debugger
    // });

    // this.ngZone.run(() => {
    //   // throw Error("The app component has thrown an error with zone!");
    //   new Promise((r,f)=>f('fff'))

    //   this.ngZone.run(() => {
    //     throw Error("The app component has thrown an error with zone!");
    //   });
    // });
  }

  localError() {
    throw Error("The app component has thrown an error!");
  }

  failingRequest() {
    this.ngZone.runGuarded(
      (a, b, c) => {
        debugger;
        this.http.get("https://httpstat.us/404?sleep=2000").toPromise();
        // .catch((error: HttpErrorResponse) => {});
      },
      this.ngZone,
      ["a", "bb", "ccc"]
    );

    this.ngZone.onError.subscribe((err) => {
      console.log("zone");
      console.log(err);
      debugger;
    });
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
