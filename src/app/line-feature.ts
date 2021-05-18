import { Injectable, Injector, isDevMode, NgModule, NgZone } from "@angular/core";

import { get } from "./st";
// import cloneDeep from "lodash/cloneDeep";

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
      const { node: curNode, featureName } = decoArgs;
      const outLineZone = initOutLineZone();
      const initFeatureSuccess = xxFeatureNode(
        featureName,
        curNode,
        originalMethod
      );

      let result: Promise<unknown> | undefined;
      if (outLineZone && initFeatureSuccess) {
        // todo catch someSth? and rethrow it

        // result = originalMethod.apply(this, args);

        outLineZone.runGuarded(
          function () {
            // @ts-ignore
            result = originalMethod.apply(this, arguments);
            return result;
          },
          this, // no use
          args, // no use
          "outLineZoneRoot"
        );
      } else {
        result = originalMethod.apply(this, args);
      }
      return result;
    };
  };
}

function initOutLineZone(): Zone | null {
  // Current Zone its parent, whatever what the parent it is
  let _innerZone: Zone;
  const aa = isDevMode()
  debugger
  _innerZone = Zone.current.fork({
    name: "myOuterNg",
    // onHasTask bg?
    onInvoke(
      parentZoneDelegate: ZoneDelegate,
      currentZone: Zone,
      targetZone: Zone,
      delegate: Function,
      applyThis: any,
      applyArgs?: any[],
      source?: string
    ) {
      console.log("ttttttttt");
      console.log(delegate, applyArgs, source);
      // todo filter the 1st call by self
      debugger;
      let res;

      res = parentZoneDelegate.invoke(
        targetZone,
        delegate,
        applyThis,
        applyArgs,
        source
      );

      // try {
      //   Zone.root
      //   .fork({
      //     name: "xxx",
      //   })
      //   .run(() => {
      //     res = parentZoneDelegate.invoke(
      //       targetZone,
      //       delegate,
      //       applyThis,
      //       applyArgs,
      //       source
      //     );
      //   });

      // } catch (e) {
      //   console.log('myee', e);
      //   debugger
      // }

      // Zone.root
      //   .fork({
      //     name: "xxx",
      //   })
      //   .run(() => {
      //     // res?.then((t: unknown) => {
      //     //   debugger;
      //     // });
      //     // .catch((err: unknown) => {
      //     //   debugger;
      //     //   // throw err;
      //     //   // return err;
      //     // }));
      //   });

      return res;
    },
    onScheduleTask: function (delegate, curr, target, task) {
      console.log("ssssss", task);
      console.log(
        "new task is scheduled:",
        task.type,
        task.source,
        curr,
        delegate
      );
      debugger;
      return delegate.scheduleTask(target, task);
    },
    // onInvokeTask(
    //   parentZoneDelegate: ZoneDelegate,
    //   currentZone: Zone,
    //   targetZone: Zone,
    //   task: Task,
    //   applyThis: any,
    //   applyArgs?: any[]
    // ) {
    //   // console.log("xxxxx");
    //   // console.log(task, applyArgs);
    //   // debugger;
    //   return parentZoneDelegate.invokeTask(
    //     targetZone,
    //     task,
    //     applyThis,
    //     applyArgs
    //   );
    // },
    onHandleError(
      parentZoneDelegate: ZoneDelegate,
      currentZone: Zone,
      targetZone: Zone,
      error: any
    ) {
      // trace this trace
      // console.error(error);
      // console.trace();
      // console.log(new Error().stack);

      console.error(new Error());

      console.log("eeeeeee");

      debugger;

      return true;
    },
  });
  return _innerZone;
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
