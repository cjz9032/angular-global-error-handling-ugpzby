import mitt, { Emitter } from "mitt";
import {
  cloneDeep,
  last,
  intersection,
  reduce,
  find,
  findLast,
  isEqual,
} from "lodash";
import { namespaceEmitter } from "./namespace-emitter";
import { v4 as uuid } from "uuid";

export enum FeatureNodeTypeEnum {
  start,
  middle,
  end,
  single,
}

export enum FeatureNodeStatusEnum {
  success,
  fail,
}

export enum FeatureStatusEnum {
  success,
  fail,
  pending,
  left,
}

export interface FeatureNode {
  featureName: string;
  nodeName: string;
  nodeType: FeatureNodeTypeEnum;
  nodeDescription?: string;
  nodeStatus?: FeatureNodeStatusEnum;
}

const ALL_EVT_TYPE = "all";
// longLog
export class LongLog {
  createtime: number = +new Date();
  id: string = uuid();

  constructor(
    public nodeInfo: FeatureNode & {
      spendTime: number;
      error?: Error;
      result?: any;
      args?: any[];
      expectResult?: (args: any[], result: any) => FeatureNodeStatusEnum;
      defineEnvInfo?: (args: any[], result: any) => unknown;
      envInfo?: unknown;
    }
  ) {
    this.nodeInfo.args = this.nodeInfo.args ?? [];
    if (this.nodeInfo.defineEnvInfo) {
      this.nodeInfo.envInfo = this.nodeInfo.defineEnvInfo(
        this.nodeInfo.args,
        this.nodeInfo.result
      );
    }

    this.nodeInfo.nodeStatus =
      this.nodeInfo.nodeStatus ??
      (this.nodeInfo.error
        ? FeatureNodeStatusEnum.fail
        : this.nodeInfo.expectResult
        ? this.nodeInfo.expectResult(this.nodeInfo.args, this.nodeInfo.result)
        : FeatureNodeStatusEnum.success);
  }
}

export class Feature {
  id: string = uuid();

  constructor(
    public featureName: string,
    public featureStatus: FeatureStatusEnum,
    public nodeLogs: LongLog[]
  ) {}

  get spendTimeWithoutWaiting() {
    if (this.nodeLogs.length === 0) {
      return 0;
    }
    return reduce(
      this.nodeLogs,
      (prev, cur) => prev + cur.nodeInfo.spendTime,
      0
    );
  }

  get spendTime() {
    if (this.nodeLogs.length === 0) {
      return 0;
    }
    const lastNode = last(this.nodeLogs)!;
    const firstNode = this.nodeLogs[0];
    return (
      firstNode.nodeInfo.spendTime +
      (this.nodeLogs.length > 1
        ? lastNode.createtime - firstNode.createtime
        : 0)
    );
  }

  get error() {
    return last(this.nodeLogs)?.nodeInfo.error;
  }

  get envInfo() {
    return this.nodeLogs[0]?.nodeInfo.envInfo;
  }

  public addNodeLog(nodeLog: LongLog) {
    // check the envInfo
    if (this.nodeLogs.length && this.nodeLogs[0].nodeInfo.envInfo) {
      const isEnvInfoChanged = !isEqual(
        this.nodeLogs[0].nodeInfo.envInfo,
        nodeLog.nodeInfo.envInfo
      );
      if (isEnvInfoChanged && !nodeLog.nodeInfo.error) {
        // the node status should to be fail
        nodeLog.nodeInfo.error = new Error(
          "EnvInfo changed: " + nodeLog.nodeInfo.envInfo
        );
        nodeLog.nodeInfo.nodeStatus = FeatureNodeStatusEnum.fail;
      }
    }
    this.nodeLogs.push(nodeLog);
    this.featureStatus =
      nodeLog.nodeInfo.nodeStatus === FeatureNodeStatusEnum.success
        ? nodeLog.nodeInfo.nodeType === FeatureNodeTypeEnum.middle
          ? FeatureStatusEnum.pending
          : FeatureStatusEnum.success
        : FeatureStatusEnum.fail;
  }

  public left() {
    this.featureStatus = FeatureStatusEnum.left;
  }

  // prevent cyclic error when call JSON.stringify
  toJSON() {
    return {
      ...this,
      nodeLogs: this.nodeLogs.map((t) => ({
        ...t,
        nodeInfo: {
          ...t.nodeInfo,
          error: {
            message: t.nodeInfo.error?.message,
            stack: t.nodeInfo.error?.stack,
          },
        },
      })),
      envInfo: this.envInfo,
      error: {
        message: this.error?.message,
        stack: this.error?.stack,
      },
    };
  }
}

export interface FeatureEventData {
  error?: Error;
  data: {
    feature: Feature;
    node: LongLog | null;
    container: LongLogContainer;
  };
}

export class LongLogContainer {
  private logs: LongLog[] = [];
  private parsedFeats: Feature[] = [];
  constructor(private namespace: string, private longLogLimit = 1_000) {}

  private parseLog(longLogs: LongLog[]) {
    const toProcessLogs = cloneDeep(longLogs);
    while (toProcessLogs.length) {
      const curLog = toProcessLogs.shift()!;

      const addNewFeat = (nextLog: LongLog) => {
        if (
          [FeatureNodeTypeEnum.start, FeatureNodeTypeEnum.single].includes(
            nextLog.nodeInfo.nodeType
          )
        ) {
          this.parsedFeats.push(
            new Feature(
              nextLog.nodeInfo.featureName,
              nextLog.nodeInfo.nodeStatus === FeatureNodeStatusEnum.success
                ? nextLog.nodeInfo.nodeType === FeatureNodeTypeEnum.single
                  ? FeatureStatusEnum.success
                  : FeatureStatusEnum.pending
                : FeatureStatusEnum.fail,
              [nextLog]
            )
          );
          const result = last(this.parsedFeats)!;
          this.emit({
            feature: result,
            node: nextLog,
          });
          return result;
        }
        // not valid
        // console.warn("not valid node", nextLog);
        return false;
      };

      const markFeatureLeft = (feature: Feature) => {
        feature.left();
        this.emit({
          feature: feature,
          node: null,
        });
        return true;
      };

      const continueLastFeat = (feature: Feature, nextLog: LongLog) => {
        feature.addNodeLog(curLog);
        this.emit({
          feature: feature,
          node: nextLog,
        });
        return true;
      };

      const lastFeatNeedProcess = findLast(this.parsedFeats, function (n) {
        return n.featureName === curLog.nodeInfo.featureName;
      });
      if (lastFeatNeedProcess?.featureStatus === FeatureStatusEnum.pending) {
        if (curLog.nodeInfo.nodeType === FeatureNodeTypeEnum.start) {
          // it's saying should new a feature
          markFeatureLeft(lastFeatNeedProcess);
          addNewFeat(curLog);
        } else {
          continueLastFeat(lastFeatNeedProcess, curLog);
        }
      } else {
        addNewFeat(curLog);
      }
    }
  }

  get longLogs() {
    return this.logs;
  }

  get features() {
    return this.parsedFeats;
  }

  public addLogs(longLogs: LongLog[]) {
    this.logs = this.logs.concat(longLogs);
    this.parseLog(longLogs);
    if (this.logs.length > this.longLogLimit) {
      this.logs = this.logs.slice(this.logs.length - this.longLogLimit);
    }
  }

  emit(data: { feature: Feature; node: LongLog | null }) {
    const combineEvt: FeatureEventData = {
      data: {
        ...data,
        container: this,
      },
      error: data.feature.error,
    };
    return namespaceEmitter.emit(this.namespace, ALL_EVT_TYPE, combineEvt);
  }

  toJSON() {
    return {
      _longLog: undefined,
      _parsedFeats: undefined,
      features: this.features,
      longLogs: this.longLogs.map((t) => ({
        ...t,
        nodeInfo: {
          ...t.nodeInfo,
          error: {
            message: t.nodeInfo.error?.message,
            stack: t.nodeInfo.error?.stack,
          },
        },
      })),
    };
  }
}

export const lineFeatureEvent = {
  on: (handler: (event: FeatureEventData) => void, namespace = "root") => {
    return namespaceEmitter.on(ALL_EVT_TYPE, handler, namespace);
  },
  off: (handler: (event?: any) => void, namespace = "root") => {
    return namespaceEmitter.on(ALL_EVT_TYPE, handler, namespace);
  },
};
