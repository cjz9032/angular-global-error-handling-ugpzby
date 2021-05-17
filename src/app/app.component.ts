import { Component, NgZone } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { lineFeature, FeatureNodeTypeEnum } from "./line-feature";

// import "zone.js/dist/zone";
// const script = document.createElement("script");
// script.src = "./scripts/fullstory.js";
// document.head.appendChild(script);

// function __awaiter(
//   thisArg: unknown,
//   _arguments: unknown,
//   P: Promise,
//   generator: Generator
// ) {
//   function adopt(value) {
//     return value instanceof P
//       ? value
//       : new P(function (resolve) {
//           resolve(value);
//         });
//   }
//   return new (P || (P = Promise))(function (resolve, reject) {
//     function fulfilled(value) {
//       try {
//         step(generator.next(value));
//       } catch (e) {
//         reject(e);
//       }
//     }
//     function rejected(value) {
//       try {
//         step(generator["throw"](value));
//       } catch (e) {
//         reject(e);
//       }
//     }
//     function step(result) {
//       result.done
//         ? resolve(result.value)
//         : adopt(result.value).then(fulfilled, rejected);
//     }
//     step((generator = generator.apply(thisArg, _arguments || [])).next());
//   });
// }
/**
 * @title Basic progress-spinner
 */
@Component({
  selector: "app",
  templateUrl: "app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  public someCode: string = "nothing";

  constructor(private http: HttpClient, private ngZone: NgZone) {
    console.log(this);
  }

  @lineFeature({
    featureName: "use-case-1",
    node: {
      nodeName: "localAnnotation",
      nodeType: FeatureNodeTypeEnum.MIDDLE,
      // nodeDescription: " start-1 ",
    },
  })
  localAnnotation() {
    debugger;
  }

  localErrorInZone() {
    // @ts-ignore
    const ngZoneInner = this.ngZone._inner as Zone;
    let timingZone = ngZoneInner.fork({
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
        // debugger;
        const a = parentZoneDelegate.invoke(
          targetZone,
          callback,
          applyThis,
          applyArgs,
          source
        );
        // debugger;
        const timingCb = () => {
          var end = performance.now();
          console.log(
            "Zone:",
            targetZone.name,
            "Intercepting zone:",
            currentZone.name,
            "Duration:",
            end - start
          );
        };
        a
          ? a.then((res: unknown) => {
              timingCb();
              return res;
            })
          : timingCb();
        // timingCb();
        return a;
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
        const a = parentZoneDelegate.invoke(
          targetZone,
          callback,
          applyThis,
          applyArgs,
          source
        );

        const timingCb = () => {
          console.log(
            "Zone:",
            targetZone.name,
            "Intercepting zone:",
            currentZone.name,
            "leave"
          );
        };

        // a
        //   ? a.then((res: unknown) => {
        //       timingCb();
        //       return res;
        //     })
        //   : timingCb();
        timingCb();

        return a;
      },
    });
    let appZone = logZone.fork({
      name: "appZone",
      onInvoke: function (
        parentZoneDelegate,
        currentZone,
        targetZone,
        callback,
        applyThis,
        applyArgs,
        source
      ) {
        return parentZoneDelegate.invoke(
          targetZone,
          callback,
          applyThis,
          applyArgs,
          source
        );
      },
    });

    // async
    appZone.run(async () => {
      this.someCode = "123";
      // console.log(Zone.current.name); // will output 'angular'
      // debugger;

      const abc: string = await new Promise((r) => {
        // this.someCode = "456";
        setTimeout(() => {
          setTimeout(() => {
            r("foo");
          }, 600);
        }, 300);
      });

      // this.someCode = abc;

      // console.log(Zone.current.name); // will output 'root'
      // debugger;

      // const aaa: string = await new Promise((r) => {
      //   r("aaa");
      // });
      // this.someCode = aaa;

      // console.log("Zone:", Zone.current.name, "Hello World!");
    });

    // then
    // then是会调用, 但其实是不同的fn, 符合文档和需求
    // appZone.run(() => {
    //   this.someCode = "123";
    //   new Promise(function (resolve) {
    //     resolve("123");
    //   })
    //   .then((last: string) => {
    //     this.someCode = last;
    //     return "456";
    //   });

    //   // console.log("Zone:", Zone.current.name, "Hello World!");
    // });

    // gen
    // let _this = this;

    // appZone.run(() => {
    //   const myRunFnFac = function* () {
    //     _this.someCode = "123";
    //     console.log(Zone.current.name); // will output 'angular'
    //     debugger;

    //     const then = new Promise((r) => {
    //       r("foo");
    //       _this.someCode = "456";
    //     });
    //     const abc: string = yield then

    //     console.log(abc);

    //     _this.someCode = abc;
    //     debugger;

    //     // const last2: string = yield new Promise((r) => {
    //     //   setTimeout(() =>{
    //     //     r("bbb");
    //     //   }, 1_000)
    //     // });
    //     // debugger;

    //     // _this.someCode = last2;
    //     // _this.someCode = "000";

    //     // console.log(Zone.current.name); // will output 'root'
    //     // debugger;

    //     // console.log("Zone:", Zone.current.name, "Hello World!");
    //   };

    //   const myRunFn = myRunFnFac();
    //   const tmp = myRunFn.next();
    //   console.log(tmp);
    //   debugger;

    //   // @ts-ignore
    //   tmp.value.then((r)=>{
    //     debugger;
    //     myRunFn.next('666');
    //   })

    //   // setTimeout(() => {
    //   //   myRunFn.next();
    //   // }, 4000);
    //   return myRunFn;
    // });

    // setTimeout(()=>{
    //   myRunFn.next(123)
    // }, 1000)
    // console.log(Zone.current);

    // this.ngZone.onError.subscribe((err) => {
    //   console.log("zone");
    //   console.log(err);
    //   debugger;
    // });
  }

  async localError() {
    // throw Error("The app component has thrown an error!");
    // this.someCode = "123";
    // await new Promise((resolve, reject) => {
    //   setTimeout(() => {
    //     resolve(666);
    //   }, 1000);
    // });
    // await new Promise((resolve, reject) => {
    //   setTimeout(() => {
    //     resolve(666);
    //   }, 1000);
    // });
    // this.someCode = "456";
  }

  failingRequest() {
    // this.ngZone.runGuarded(
    //   (a, b, c) => {
    //     debugger;
    //     this.http.get("https://httpstat.us/404?sleep=2000").toPromise();
    //     // .catch((error: HttpErrorResponse) => {});
    //   },
    //   this.ngZone,
    //   ["a", "bb", "ccc"]
    // );
    // this.ngZone.onError.subscribe((err) => {
    //   console.log("zone");
    //   console.log(err);
    //   debugger;
    // });
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

// let logs: string[] = [];
// let zoneA = Zone.current.fork({
//   name: "zoneA",
//   onHandleError: function (
//     parentZoneDelegate: ZoneDelegate,
//     currentZone: Zone,
//     targetZone: Zone,
//     error: any
//   ) {
//     logs.push("zoneA onHandleError");
//     console.log(error.message);
//     debugger
//     return false;
//   },
//   onInvoke: function (
//     delegate,
//     currentZone,
//     targetZone,
//     callback,
//     applyThis,
//     applyArgs
//   ) {
//     debugger
//     logs.push("zoneA onInvoke");
//     return delegate.invoke(targetZone, callback, applyThis, applyArgs);
//   },
// });
// let zoneB = Zone.current.fork({
//   name: "zoneB",
//   onInvoke: function (
//     delegate,
//     currentZone,
//     targetZone,
//     callback,
//     applyThis,
//     applyArgs
//   ) {
//     logs.push("zoneB onInvoke");
//     return delegate.invoke(targetZone, callback, applyThis, applyArgs);
//   },
// });
// let zoneAChild = zoneA.fork({
//   name: "zoneAChild",
//   onInvoke: function (
//     delegate,
//     currentZone,
//     targetZone,
//     callback,
//     applyThis,
//     applyArgs
//   ) {
//     logs.push("zoneAChild onInvoke");
//     console.log(targetZone);

//     debugger
//     return callback.apply(applyThis, applyArgs);

//     //@ts-ignore
//     // return delegate.invoke(targetZone, callback, applyThis, applyArgs);
//   },
//   onHandleError: function (
//     parentZoneDelegate: ZoneDelegate,
//     currentZone: Zone,
//     targetZone: Zone,
//     error: any
//   ) {
//     logs.push("zoneAChild onHandleError");
//     console.log(error.message);
//     debugger
//     return error;
//   },
// });

// // zoneA.runGuarded(() => {
// //   zoneB.run(() => {
// //     zoneAChild.runGuarded(function test() {
// //       logs.push("begin run" + Zone.current.name);
// //       console.log("logs", logs);

// //       const error = new Error('my test err');
// //       // console.error("trace", error.stack);
// //       throw error;
// //     });
// //   });
// // });

// zoneAChild.runGuarded(function test() {
//   logs.push("begin run" + Zone.current.name);
//   console.log("logs", logs);

//   const error = new Error('my test err');
//   // console.error("trace", error.stack);
//   throw error;
// });

/**  Copyright 2020 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */
