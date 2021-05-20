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
export class LongLog<T = any> {
  createtime: Date = new Date();
  id: string = genId().toString();

  constructor(
    public nodeInfo: FeatureNode & { spendTime: number },
    public props?: T
  ) {}
}

export class Feature<T = any> {
  createtime: Date = new Date();
  id: string = genId().toString();

  constructor(
    public featureName: string,
    public featureStatus: FeatureStatusEnum,
    public nodeLogs: LongLog<T>[]
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
    if (this.nodeLogs.length === 1) return this.nodeLogs[0].nodeInfo.spendTime;
    return (
      (lastNode.createtime.getTime() - firstNode.createtime.getTime()) / 1000
    );
  }
}

export class LongLogContainer<T = any> {
  private _longLogs: LongLog<T>[] = [];
  private _parsedFeats: Feature<T>[] = [];
  timestamp: Date = new Date();
  constructor(private longLogLimit = 1_000) {}

  private parseLog(longLogs: LongLog<T>[]) {
    const toProcessLogs = cloneDeep(longLogs);
    while (toProcessLogs.length) {
      const lastFeat = last(this._parsedFeats);
      const curLog = toProcessLogs.shift()!;
      const { featureName: curFeatName } = curLog.nodeInfo;

      const addNextFeat = (nextLog: LongLog<T>) => {
        if (nextLog.nodeInfo.nodeType === FeatureNodeTypeEnum.start) {
          this._parsedFeats.push(
            new Feature<T>(
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

      const resolveLastFeat = (lastFeat: Feature<T>) => {
        if (lastFeat.featureStatus !== FeatureStatusEnum.pending) return false;
        lastFeat.featureStatus = FeatureStatusEnum.left;
        return true;
      };

      const continueLastFeat = (lastFeat: Feature<T>, nextLog: LongLog<T>) => {
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

  public addLogs(longLogs: LongLog<T>[]) {
    this._longLogs = this._longLogs.concat(longLogs);
    this.parseLog(longLogs);
    if (this._longLogs.length > this.longLogLimit) {
      this._longLogs = this._longLogs.slice(
        this._longLogs.length - this.longLogLimit
      );
    }
  }
}
