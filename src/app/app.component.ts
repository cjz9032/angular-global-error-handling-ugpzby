import { Component, NgZone } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { lineFeature } from "./line-feature/";
import {
  FeatureNodeStatusEnum,
  FeatureNodeTypeEnum,
  lineFeatureEvent,
} from "./line-feature/log-container";

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
    // rej(123);
    // rej(new Error('123'));
    // r("1");
    r("1");
  });
  p = p.then((t) => {
    if (num !== 1) {
      throw new Error("123");
    }
    return num + "";
  });

  return p;
};

lineFeatureEvent.on((evt) => {
  console.log(evt.data.feature);

  debugger;
}, "namespace666");

@Component({
  selector: "app",
  templateUrl: "app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  public someCode: string = "nothing";

  constructor(private http: HttpClient, private ngZone: NgZone) {}

  @lineFeature({
    namespace: "namespace666",
    customFeatureNode: (args: any[]) => {
      return {
        featureName: "123",
        node: {
          nodeName: "startF1",
          nodeType: FeatureNodeTypeEnum.start,
        },
      };
    },
    expectResult: (arg, res) => {
      return res === 666
        ? FeatureNodeStatusEnum.fail
        : FeatureNodeStatusEnum.success;
    },
  })
  public async startF1() {
    // @
    this.someCode = "123";
    return new Promise((r) => {
      r(3);
    });
  }

  @lineFeature({
    featureName: "use-case-1",
    node: {
      nodeName: "middleF1",
      nodeType: FeatureNodeTypeEnum.middle,
    },
    customFeatureNode: (args: any[]) => {
      console.log(args);

      return {
        featureName: "123",
        node: {
          nodeName: "startF1",
          nodeType: FeatureNodeTypeEnum.start,
        },
      };
    },
  })
  public async middleF1() {
    this.someCode = "123";
  }

  @lineFeature({
    featureName: "use-case-1",
    node: {
      nodeName: "endF1",
      nodeType: FeatureNodeTypeEnum.end,
    },
  })
  public async endF1() {
    await new Promise((r) => setTimeout(() => r(1), 1000));
    this.someCode = "123";
  }

  @lineFeature({
    featureName: "use-case-2",
    node: {
      nodeName: "startF2",
      nodeType: FeatureNodeTypeEnum.start,
    },
  })
  public async startF2() {
    this.someCode = "123";
    return 666;
  }

  @lineFeature({
    featureName: "use-case-2",
    node: {
      nodeName: "middleF2",
      nodeType: FeatureNodeTypeEnum.middle,
    },
  })
  public async middleF2() {
    // @ts-ignore
    this.assad.ads = 213;
    this.someCode = "123";
  }

  @lineFeature({
    featureName: "use-case-2",
    node: {
      nodeName: "endF2",
      nodeType: FeatureNodeTypeEnum.end,
    },
  })
  public async endF2() {
    await new Promise((r) => setTimeout(() => r(1), 1000));
    this.someCode = "123";
  }

  // public async endF2() {
  //   this.someCode = "123";
  //   // await 123;

  //   // const abc: string = await DoFirst(1);
  //   // this.someCode = abc;
  //   // // debugger;
  //   // try {
  //   //   const abc2: string = await DoFirst(2);
  //   //   this.someCode = abc2;
  //   // } catch (e) {
  //   // }
  //   // // in bg?
  //   // new Promise((res) => {
  //   //   setTimeout(() => {
  //   //     res("bg123");
  //   //   }, 3000);
  //   // });

  //   // const abc3: string = await DoFirst(3);
  //   // this.someCode = abc3;

  //   // const res: string = await new Promise((r, rej) => {
  //   //   // r("123");
  //   //   rej(new Error("err"));
  //   //   // rej("err");
  //   // });
  //   // this.someCode = res;

  //   // debugger;
  //   return 666;
  // }

  localErrorInZone() {
    // @ts-ignore
  }

  async localError() {}

  failingRequest() {}

  successfulRequest() {
    this.http.get("https://httpstat.us/200?sleep=2000").toPromise();
  }
}

// lineFeatureEvent.on()

// node | feature

/**  Copyright 2020 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */
