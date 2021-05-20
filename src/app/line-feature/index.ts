import { once } from "lodash";
import {
  FeatureNode,
  FeatureNodeStatusEnum,
  FeatureNodeTypeEnum,
  LongLog,
  LongLogContainer,
} from "./log-container";

type FeatureNodeInView = {
  nodeName: string;
  nodeType: FeatureNodeTypeEnum;
  nodeDescription?: string;
};

export function lineFeature(decoArgs: {
  featureName: string;
  node: FeatureNodeInView;
}) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const { node: curNode, featureName } = decoArgs;
      const outLineZone = initOutLineZone((zoneNodeInfo) => {
        logContainer.addLogs([
          new LongLog<ZoneNodeInfo>(
            {
              ...curNode,
              featureName,
              nodeStatus: !!zoneNodeInfo.error
                ? FeatureNodeStatusEnum.fail
                : FeatureNodeStatusEnum.success,
            },
            zoneNodeInfo
          ),
        ]);
      });

      let result: Promise<unknown> | undefined;
      if (outLineZone) {
        outLineZone.runGuarded(
          function () {
            // @ts-ignore
            result = originalMethod.apply(this, arguments);
            return result;
          },
          this,
          args,
          "outLineZoneRoot"
        );
      } else {
        result = originalMethod.apply(this, args);
      }
      return result;
    };
  };
}

const logContainer = new LongLogContainer<ZoneNodeInfo>();
(window as any).__myLogContainer = logContainer

interface ZoneNodeInfo {
  spendTime: number;
  error?: Error;
  hasTaskState?: HasTaskState;
}

function initOutLineZone(
  onFinish: (params: ZoneNodeInfo) => void
): Zone | null {
  // Current Zone is the parent, whatever what the parent it is
  let _innerZone: Zone;
  let firstCallRes: any;
  let isAsync: boolean;

  // From ZoneAwarePromise
  const UNRESOLVED: null = null;
  const RESOLVED = true;
  const REJECTED = false;
  const REJECTED_NO_CATCH = 0;
  const symbolPromiseState = (window as any).__Zone_symbol_prefix + "state";

  let startTime = performance.now();
  let spendTime: number;
  const onFinishCall = once(
    ({
      error,
      hasTaskState,
    }: {
      error?: Error;
      hasTaskState?: HasTaskState;
    }) => {
      const endTime = performance.now();
      spendTime = endTime - startTime;
      // if( hasTaskState?.microTask  || hasTaskState?.eventTask || hasTaskState?.microTask ){
      //   // there is some tasks running in background
      // }
      onFinish({
        spendTime,
        error,
        hasTaskState,
      });
      // todo destroy?
    }
  );

  _innerZone = Zone.current.fork({
    name: "myOuterNg",
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
          onFinishCall({});
        }
      }

      return res;
    },
    onHasTask: function (delegate, curr, target, hasTaskState) {
      if (isAsync && firstCallRes[symbolPromiseState] === RESOLVED) {
        onFinishCall({
          hasTaskState,
        });
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
      onFinishCall({
        error,
      });
      return res;
    },
  });
  return _innerZone;
}
