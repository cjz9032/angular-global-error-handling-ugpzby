import mitt, { Emitter } from "mitt";
import { cloneDeep, last, intersection, reduce, find, findLast } from "lodash";
import { namespaceEmitter } from "./namespace-emitter";

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
  nodeStatus: FeatureNodeStatusEnum;
}

let logId = 0;
const genId = () => logId++;

// longLog
export class LongLog {
  createtime: number = +new Date();
  id: string = genId().toString();

  constructor(
    public nodeInfo: FeatureNode & {
      spendTime: number;
      error?: Error;
    }
  ) {}
}

export class Feature {
  id: string = genId().toString();

  constructor(
    public featureName: string,
    public featureStatus: FeatureStatusEnum,
    public nodeLogs: LongLog[]
  ) {}

  // cause featureName would update by next node
  get originFeatureName() {
    if (this.nodeLogs.length === 0) {
      return "";
    }
    return this.nodeLogs[0].nodeInfo.featureName;
  }

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

  // prevent cyclic error when call JSON.stringify
  toJSON() {
    return {
      ...this,
      originFeatureName: this.originFeatureName,
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
  };
  container: LongLogContainer;
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
        // console.log('the node is not valid');
        return false;
      };

      const markFeatureLeft = (feature: Feature) => {
        feature.featureStatus = FeatureStatusEnum.left;
        this.emit({
          feature: feature,
          node: null,
        });
        return true;
      };

      const continueLastFeat = (feature: Feature, nextLog: LongLog) => {
        feature.nodeLogs.push(curLog);
        feature.featureName = curLog.nodeInfo.featureName;
        feature.featureStatus =
          nextLog.nodeInfo.nodeStatus === FeatureNodeStatusEnum.success
            ? nextLog.nodeInfo.nodeType === FeatureNodeTypeEnum.middle
              ? FeatureStatusEnum.pending
              : FeatureStatusEnum.success
            : FeatureStatusEnum.fail;

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
      data: data,
      container: this,
      error: data.feature.error,
    };
    return namespaceEmitter.emit(this.namespace, "all", combineEvt);
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
    return namespaceEmitter.on("all", handler, namespace);
  },
  off: (handler: (event?: any) => void, namespace = "root") => {
    return namespaceEmitter.on("all", handler, namespace);
  },
};
