import _, { cloneDeep, last } from "lodash";

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
  createtime: Date = new Date();
  id: string = genId().toString();

  constructor(
    public nodeInfo: FeatureNode & { spendTime: number; error?: Error }
  ) {}
}

export class Feature {
  // createtime: Date = new Date();
  id: string = genId().toString();

  constructor(
    public featureName: string,
    public featureStatus: FeatureStatusEnum,
    public nodeLogs: LongLog[]
  ) {}

  get spendTimeWithoutWaiting() {
    if (this.nodeLogs.length === 0) return 0;
    return _.reduce(
      this.nodeLogs,
      (prev, cur) => {
        return prev + cur.nodeInfo.spendTime;
      },
      0
    );
  }

  get spendTime() {
    if (this.nodeLogs.length === 0) return 0;
    const lastNode = last(this.nodeLogs)!;
    const firstNode = this.nodeLogs[0];
    return (
      firstNode.nodeInfo.spendTime +
      (this.nodeLogs.length > 1
        ? lastNode.createtime.getTime() - firstNode.createtime.getTime()
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

export class LongLogContainer {
  private _longLogs: LongLog[] = [];
  private _parsedFeats: Feature[] = [];
  constructor(private longLogLimit = 1_000) {}

  private parseLog(longLogs: LongLog[]) {
    const toProcessLogs = cloneDeep(longLogs);
    while (toProcessLogs.length) {
      const lastFeat = last(this._parsedFeats);
      const curLog = toProcessLogs.shift()!;
      const { featureName: curFeatName } = curLog.nodeInfo;

      const addNextFeat = (nextLog: LongLog) => {
        if (nextLog.nodeInfo.nodeType === FeatureNodeTypeEnum.start) {
          this._parsedFeats.push(
            new Feature(
              nextLog.nodeInfo.featureName,
              nextLog.nodeInfo.nodeStatus === FeatureNodeStatusEnum.success
                ? FeatureStatusEnum.pending
                : FeatureStatusEnum.fail,
              [nextLog]
            )
            //   {
            //   featureName: nextLog.nodeInfo.featureName,
            //   nodeLogs: [nextLog],
            //   featureStatus:
            //     nextLog.nodeInfo.nodeStatus === FeatureNodeStatusEnum.success
            //       ? FeatureStatusEnum.pending
            //       : FeatureStatusEnum.fail,
            // }
          );
          return last(this._parsedFeats)!;
        }
        return false;
      };

      const resolveLastFeat = (lastFeat: Feature) => {
        if (lastFeat.featureStatus !== FeatureStatusEnum.pending) return false;
        lastFeat.featureStatus = FeatureStatusEnum.left;
        return true;
      };

      const continueLastFeat = (lastFeat: Feature, nextLog: LongLog) => {
        // not valid
        if (lastFeat.featureStatus !== FeatureStatusEnum.pending) {
          addNextFeat(curLog);
          return false;
        }
        if (nextLog.nodeInfo.nodeType === FeatureNodeTypeEnum.start)
          return false;

        lastFeat.nodeLogs.push(curLog);
        lastFeat.featureStatus =
          nextLog.nodeInfo.nodeStatus === FeatureNodeStatusEnum.success
            ? nextLog.nodeInfo.nodeType === FeatureNodeTypeEnum.middle
              ? FeatureStatusEnum.pending
              : FeatureStatusEnum.success
            : FeatureStatusEnum.fail;
        return true;
      };

      if (lastFeat) {
        if (lastFeat.featureName === curFeatName) {
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
    return this._longLogs;
  }

  get features() {
    return this._parsedFeats;
  }

  public addLogs(longLogs: LongLog[]) {
    this._longLogs = this._longLogs.concat(longLogs);
    this.parseLog(longLogs);
    if (this._longLogs.length > this.longLogLimit) {
      this._longLogs = this._longLogs.slice(
        this._longLogs.length - this.longLogLimit
      );
    }
  }

  toJSON() {
    return {
      _longLog: undefined,
      _parsedFeats: undefined,
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
