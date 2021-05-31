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
        featureName: "use-case-1",
        node: {
          nodeName: "startF1",
          nodeType: FeatureNodeTypeEnum.start,
        },
      };
    },
    expectResult: (arg, res) => {
      return res === 'test-notify'
        ? FeatureNodeStatusEnum.success
        : FeatureNodeStatusEnum.fail;
    },
  })
  public async startF1(
    str: string,
    nofifyResultManully?: (notifyResult: any) => void
  ) {
    // before return
    nofifyResultManully && nofifyResultManully('test-notify');
    this.someCode = "123";
    return new Promise((r) => {
      r(3);
    });
  }

  @lineFeature({
    namespace: "namespace666",
    featureName: "use-case-1",
    node: {
      nodeName: "middleF1",
      nodeType: FeatureNodeTypeEnum.middle,
    },
  })
  public async middleF1() {
    this.someCode = "123";
  }

  @lineFeature({
    namespace: "namespace666",
    featureName: "use-case-1",
    node: {
      nodeName: "endF1",
      nodeType: FeatureNodeTypeEnum.end,
    },
  })
  public async endF1() {
    await new Promise((r) => setTimeout(() => r(1), 1000));
    this.someCode = "123";
    return 'endf1res'
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
