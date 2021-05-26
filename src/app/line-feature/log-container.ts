import mitt from "mitt";
import { cloneDeep, last, intersection, reduce } from "lodash";

export enum FeatureNodeTypeEnum {
  start,
  middle,
  end,
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

export enum FeatureEventType {
  change = "Change",
}

export interface FeatureNode {
  featureName: string | string[];
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
    public nodeInfo: FeatureNode & { spendTime: number; error?: Error }
  ) {}
}

export class Feature {
  id: string = genId().toString();

  constructor(
    public featureName: string | string[],
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

export interface FeatureEventPayload {
  type: "add" | "update";
  data: {
    feature: Feature;
  };
}

export class LongLogContainer {
  private emitter = mitt();
  private logs: LongLog[] = [];
  private parsedFeats: Feature[] = [];
  constructor(private longLogLimit = 1_000) {}

  private parseLog(longLogs: LongLog[]) {
    const toProcessLogs = cloneDeep(longLogs);
    while (toProcessLogs.length) {
      const lastFeat = last(this.parsedFeats);
      const curLog = toProcessLogs.shift()!;

      const calcIntersectionFeatureName = (
        name1: string | string[],
        name2: string | string[]
      ) => {
        const name1Trans: string[] = Array.isArray(name1) ? name1 : [name1];
        const name2Trans: string[] = Array.isArray(name2) ? name2 : [name2];
        const res = intersection(name1Trans, name2Trans);
        if (res.length === 0) {
          return null;
        }
        return res.length < 2 ? res[0] : res;
      };

      const addNextFeat = (nextLog: LongLog) => {
        if (nextLog.nodeInfo.nodeType === FeatureNodeTypeEnum.start) {
          this.parsedFeats.push(
            new Feature(
              nextLog.nodeInfo.featureName,
              nextLog.nodeInfo.nodeStatus === FeatureNodeStatusEnum.success
                ? FeatureStatusEnum.pending
                : FeatureStatusEnum.fail,
              [nextLog]
            )
          );
          const result = last(this.parsedFeats);
          this.emitter.emit(FeatureEventType.change, {
            type: "add",
            data: {
              feature: result,
            },
          });
          return result;
        }
        return false;
      };

      const resolveLastFeat = (feature: Feature) => {
        if (feature.featureStatus !== FeatureStatusEnum.pending) {
          return false;
        }
        feature.featureStatus = FeatureStatusEnum.left;
        this.emitter.emit(FeatureEventType.change, {
          type: "update",
          data: {
            feature: feature,
          },
        });
        return true;
      };

      const continueLastFeat = (feature: Feature, nextLog: LongLog) => {
        if (feature.featureStatus !== FeatureStatusEnum.pending) {
          addNextFeat(curLog);
          return false;
        }
        // restart same feature?
        if (nextLog.nodeInfo.nodeType === FeatureNodeTypeEnum.start) {
          resolveLastFeat(feature);
          addNextFeat(nextLog);
          return true;
        }

        feature.nodeLogs.push(curLog);
        feature.featureName =
          calcIntersectionFeatureName(
            feature.featureName,
            curLog.nodeInfo.featureName
          ) || "";
        feature.featureStatus =
          nextLog.nodeInfo.nodeStatus === FeatureNodeStatusEnum.success
            ? nextLog.nodeInfo.nodeType === FeatureNodeTypeEnum.middle
              ? FeatureStatusEnum.pending
              : FeatureStatusEnum.success
            : FeatureStatusEnum.fail;

        this.emitter.emit(FeatureEventType.change, {
          type: "update",
          data: {
            feature: feature,
          },
        });
        return true;
      };

      if (lastFeat) {
        if (
          calcIntersectionFeatureName(
            lastFeat.featureName,
            curLog.nodeInfo.featureName
          ) !== null
        ) {
          continueLastFeat(lastFeat, curLog);
        } else {
          // resolve last, and continue it
          resolveLastFeat(lastFeat);
          addNextFeat(curLog);
        }
      } else {
        addNextFeat(curLog);
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

  on(type: FeatureEventType, handler: (payload: FeatureEventPayload) => void) {
    this.emitter.on(type, handler);
    return this;
  }
  off(type: FeatureEventType, handler: (event?: any) => void) {
    this.emitter.off(type, handler);
    return this;
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
