import _, { isEmpty, once } from "lodash";
import mitt from "mitt";
import {
  FeatureNodeStatusEnum,
  FeatureNodeTypeEnum,
  LongLog,
  LongLogContainer,
  FeatureEventData,
} from "./log-container";
import { namespaceEmitter } from "./namespace-emitter";

type FeatureNodeInView = {
  nodeName: string;
  nodeType: FeatureNodeTypeEnum;
  nodeDescription?: string;
};
/**
 * Annotate Functions to get metrics
 *
 * @param decoArgs
 * @returns
 * Example: @lineFeature({
		featureName: 'use-case-1' or ['use-case-1', 'use-case-2']
		node: {
			nodeName: 'middleF1',
			nodeType: FeatureNodeTypeEnum.start,
		},
	})
 */

interface FeatureNodeBase {
  featureName?: string;
  node?: FeatureNodeInView;
}

interface FeatureNodeFn {
  customFeatureNode?: (args: any[]) => {
    featureName: string;
    node: FeatureNodeInView;
  };
}

interface FeatureNodeParams extends FeatureNodeBase, FeatureNodeFn {
  namespace?: string;
  expectResult?: (args: any[], result: any) => FeatureNodeStatusEnum;
}
// type Constrained<T> = "x" extends keyof T
//   ? T extends { x: string }
//     ? T
//     : never
//   : T;

const featureLogContainer: {
  [x: string]: LongLogContainer;
} = {};

(window as any) .__featureLogContainer = featureLogContainer;

export const lineFeature =
  (decoArgs: FeatureNodeParams) =>
  (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    let namespace = decoArgs.namespace ?? "root";
    featureLogContainer[namespace] =
      featureLogContainer[namespace] ?? new LongLogContainer(namespace);

    descriptor.value = function (...args: any[]) {
      let node = decoArgs.node;
      let featureName = decoArgs.featureName ?? "";
      if (decoArgs.customFeatureNode) {
        const tmp = decoArgs.customFeatureNode(args);
        featureName = tmp.featureName;
        node = tmp.node;
      }

      if (!node || !featureName) {
        console.warn("please check params whether set node or featureName");
        return originalMethod.apply(this, args);
      }
      const onNodeComplete = (zoneNodeInfo: ZoneNodeInfo) => {
        const { expectResult } = decoArgs;

        featureLogContainer[namespace].addLogs([
          new LongLog({
            nodeName: node!.nodeName,
            nodeType: node!.nodeType,
            nodeDescription: node!.nodeDescription,
            featureName,
            error: zoneNodeInfo.error,
            result: zoneNodeInfo.result,
            args: args,
            spendTime: zoneNodeInfo.spendTime,
            // nodeStatus from result or error
            nodeStatus: !!zoneNodeInfo.error
              ? FeatureNodeStatusEnum.fail
              : expectResult
              ? expectResult(args, zoneNodeInfo.result)
              : FeatureNodeStatusEnum.success,
          }),
        ]);
      };
      const { zone: outLineZone, notify } = initOutLineZone(onNodeComplete);

      let result: Promise<unknown> | undefined;
      if (outLineZone) {
        outLineZone.runGuarded(
          function () {
            // @ts-ignore
            result = originalMethod.apply(this, arguments);
            return result;
          },
          this,
          args.concat(notify),
          "outLineZoneRoot"
        );
      } else {
        result = originalMethod.apply(this, args);
      }
      return result;
    };
  };

interface ZoneNodeInfo {
  spendTime: number;
  error?: Error;
  hasTaskState?: HasTaskState;
  result: any;
}

const initOutLineZone = (
  onFinish: (params: ZoneNodeInfo) => void
): { zone: Zone | null; notify: (result: unknown) => void } => {
  // Current Zone is the parent, whatever what the parent it is
  let firstCallRes: any;
  let isAsync: boolean;

  // From ZoneAwarePromise
  const Zone_symbol_prefix = "__zone_symbol__";
  const UNRESOLVED = null;
  const RESOLVED = true;
  const REJECTED = false;
  const REJECTED_NO_CATCH = 0;
  const symbolPromiseState = Zone_symbol_prefix + "state";

  const startTime = performance.now();
  let spendTime: number;
  const onFinishCall = once(
    ({
      error,
      hasTaskState,
      result,
    }: {
      error?: Error;
      hasTaskState?: HasTaskState;
      result: any;
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
        result,
      });
    }
  );

  const notify = (notifyResult: unknown) => {
    onFinishCall({
      result: notifyResult,
    });
  };

  const innerZone = Zone.current.fork({
    name: "myOuterNg",
    onInvoke: (
      parentZoneDelegate: ZoneDelegate,
      currentZone: Zone,
      targetZone: Zone,
      delegate: () => void,
      applyThis: any,
      applyArgs?: any[],
      source?: string
    ) => {
      const res: unknown = parentZoneDelegate.invoke(
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
          setTimeout(async () => {
            onFinishCall({
              result: await firstCallRes,
            });
          });
        }
      }

      return res;
    },
    onHasTask: async (delegate, curr, target, hasTaskState) => {
      if (isAsync && firstCallRes[symbolPromiseState] === RESOLVED) {
        onFinishCall({
          hasTaskState,
          result: await firstCallRes,
        });
      }
      return delegate.hasTask(target, hasTaskState);
    },
    onHandleError: (
      parentZoneDelegate: ZoneDelegate,
      currentZone: Zone,
      targetZone: Zone,
      error: any
    ) => {
      const res = parentZoneDelegate.handleError(targetZone, error);
      // get new error
      onFinishCall({
        error,
        result: undefined,
      });
      return res;
    },
  });

  return {
    zone: innerZone,
    notify,
  };
};
