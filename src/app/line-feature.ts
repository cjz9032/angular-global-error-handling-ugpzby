import {
  Injectable,
  Injector,
  isDevMode,
  NgModule,
  NgZone,
} from "@angular/core";

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
class LongLog {
  // error: Error = getStacktrace();
  // timestamp: Date = new Date();
}

class LongLogContainer {
  private longLogLimit = 1_000;
  private _longLog: LongLog[] = [];
  timestamp: Date = new Date();

  private onAddLog() {
    // parse
    // must parse the info  last one with 
  }

  public addLog(longLog: LongLog) {
    this._longLog.push(longLog);
    if (this._longLog.length > this.longLogLimit) {
      this._longLog = this._longLog.slice(-this.longLogLimit);
    }
    this.onAddLog();
  }
}

const longLogContainer = new LongLogContainer();

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
  // Current Zone is the parent, whatever what the parent it is
  let _innerZone: Zone;
  let firstCallRes: any;
  let isAsync: boolean;
  let isFinished = false;

  // From ZoneAwarePromise
  const UNRESOLVED: null = null;
  const RESOLVED = true;
  const REJECTED = false;
  const REJECTED_NO_CATCH = 0;
  const symbolPromiseState = (window as any).__Zone_symbol_prefix + "state";

  let startTime = performance.now();
  let spendTime: number;
  const onFinishCall = (hasTaskState?: HasTaskState) => {
    if (isFinished) return;
    isFinished = true;
    const endTime = performance.now();
    spendTime = endTime - startTime;
    console.log(spendTime, hasTaskState);
    // if( hasTaskState?.microTask  || hasTaskState?.eventTask || hasTaskState?.microTask ){
    //   // there is something running in background
    // }
    // todo destroy?
  };

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
      let res: unknown;
      res = parentZoneDelegate.invoke(
        targetZone,
        delegate,
        applyThis,
        applyArgs,
        source
      );
      if (source === "outLineZoneRoot") {
        firstCallRes = res;
        isAsync =
          firstCallRes instanceof Promise &&
          // @ts-ignore
          firstCallRes[symbolPromiseState] === UNRESOLVED;
        if (!isAsync) {
          onFinishCall();
        }
      }

      return res;
    },
    onHasTask: function (delegate, curr, target, hasTaskState) {
      if (isAsync && firstCallRes[symbolPromiseState] === RESOLVED) {
        onFinishCall(hasTaskState);
      }
      return delegate.hasTask(target, hasTaskState);
    },
    onHandleError(
      parentZoneDelegate: ZoneDelegate,
      currentZone: Zone,
      targetZone: Zone,
      error: any
    ) {
      const res = parentZoneDelegate.handleError(targetZone, error);
      // get new error
      console.error(error);
      return res;
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
