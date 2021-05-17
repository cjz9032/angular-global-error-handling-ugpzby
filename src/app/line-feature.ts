import { Injectable, Injector, NgModule, NgZone } from "@angular/core";

// todo access ngZone? https://stackoverflow.com/questions/47619350/access-angular-ngzone-instance-from-window-object
// const injector = Injector.create({
//   providers: [{ provide: NgZone, useClass: NgZone }],
// });
// const aa = injector.get(NgZone);

export enum FeatureNodeTypeEnum {
  START,
  MIDDLE,
  END,
}

// maybe called cache? process it later~
const featureMap: {
  [s: string]: {
    // dynimac
    nodeList: [];
  };
} = {};

// longLog
let longLog = [];

let lineZone: Zone;

let lastNodeInfo: {
  node: FeatureNode;
  featureName: string;
} | null = null;

interface FeatureNode {
  nodeName: string;
  nodeType: FeatureNodeTypeEnum;
  nodeDescription?: string;
}

export function lineFeature(decoArgs: {
  featureName: string;
  node: FeatureNode;
}) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      // todo avoid ng-zone's checkDirty for this part?
      const componentInstance: any = this;
      const { node: curNode, featureName } = decoArgs;
      debugger;
      const initFeatureZoneSuccess = initGlobalZone(componentInstance.ngZone);
      const initFeatureSuccess = xxFeatureNode(
        featureName,
        curNode,
        originalMethod
      );
      let result;
      if (initFeatureZoneSuccess && initFeatureSuccess) {
        // run in zone
        lineZone.run(() => {
          result = originalMethod.apply(this, args);
        });
      } else {
        result = originalMethod.apply(this, args);
      }

      return result;
    };
  };
}

function initGlobalZone(ngZone: NgZone) {
  if (!ngZone) {
    console.warn("[Line-Feature] " + `ngZone has not been injected`);
    return false;
  }
  if (!lineZone) {
    // @ts-ignore
    const ngZoneInner = ngZone._inner as Zone;
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
        const a = parentZoneDelegate.invoke(
          targetZone,
          callback,
          applyThis,
          applyArgs,
          source
        );
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

    lineZone = timingZone;
  }
  return lineZone;
}

function xxFeatureNode(
  featureName: string,
  curNode: FeatureNode,
  originalMethod: () => void
): boolean {
  // if (!featureMap[featureName]) {
  //   // init if the feature is empty
  //   featureMap[featureName] = {
  //     nodeList: [],
  //   };
  // }

  // its not valid, if the current node is not confinue with last node
  if (
    curNode.nodeType !== FeatureNodeTypeEnum.START &&
    featureName !== lastNodeInfo?.featureName
  ) {
    // todo judge whether it is in production by project's utils -- if(prod)
    console.warn("[Line-Feature] " + `not a valid node: `, curNode);
    return false;
  }

  // success
  lastNodeInfo = {
    featureName,
    node: curNode,
  };

  return true;
}
