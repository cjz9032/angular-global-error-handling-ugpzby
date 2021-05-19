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

const DoFirst = function (num: number): Promise<string> {
  let p: Promise<string> = new Promise(function (r, rej) {
    // setTimeout(() => {
    //   // throw new Error('in other dth')
    //   // rej(new Error("in other"));
    //   // if (num !== 1) {
    //   //   rej(new Error("666: " + num));
    //   // } else {
    //   // }
    // }, num * 0);
    r("1");
    // rej(123);
    // rej(new Error('123'));
    // r("1");
  });
  p = p.then((t) => {
    if (num !== 1) {
      throw new Error("123");
    }
    return num + "";
  });

  return p;
};

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
      nodeType: FeatureNodeTypeEnum.START,
    },
  })
  public async localAnnotation() {
    this.someCode = "123";
    // await 123;

    // const abc: string = await DoFirst(1);
    // this.someCode = abc;
    // // debugger;
    // try {
    //   const abc2: string = await DoFirst(2);
    //   this.someCode = abc2;
    // } catch (e) {
    // }
    // // in bg?
    // new Promise((res) => {
    //   setTimeout(() => {
    //     res("bg123");
    //   }, 3000);
    // });

    // const abc3: string = await DoFirst(3);
    // this.someCode = abc3;

    // const res: string = await new Promise((r, rej) => {
    //   // r("123");
    //   rej(new Error("err"));
    //   // rej("err");
    // });
    // this.someCode = res;

    // debugger;
    return 666;
  }

  localErrorInZone() {
    // @ts-ignore
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

  failingRequest() {}

  successfulRequest() {
    this.http.get("https://httpstat.us/200?sleep=2000").toPromise();
  }
}

/**  Copyright 2020 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */
