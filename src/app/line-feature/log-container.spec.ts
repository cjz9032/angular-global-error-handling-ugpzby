import { cloneDeep, times } from "lodash";
import {
  LongLogContainer,
  LongLog,
  FeatureNodeTypeEnum,
  FeatureNode,
  FeatureNodeStatusEnum,
  FeatureStatusEnum,
} from "./log-container";

it("should same node restart", () => {
  const sameStartNode: FeatureNode = {
    featureName: "a",
    nodeName: "b",
    nodeType: FeatureNodeTypeEnum.start,
    nodeDescription: "",
    nodeStatus: FeatureNodeStatusEnum.success,
  };
  const logCot = new LongLogContainer();
  logCot.addLogs([new LongLog(sameStartNode)]);
  logCot.addLogs([new LongLog(sameStartNode)]);
  // there is nothing to do
  expect(logCot.features.length).toEqual(1);
  expect(logCot.features[0].featureStatus).toEqual(FeatureStatusEnum.pending);
});

it("should be a rotation log with limiting numbers items", () => {
  const anyNode: FeatureNode = {
    featureName: "a",
    nodeName: "b",
    nodeType: FeatureNodeTypeEnum.end,
    nodeDescription: "",
    nodeStatus: FeatureNodeStatusEnum.success,
  };
  const logCot = new LongLogContainer(10);
  const firstItem: LongLog = new LongLog(anyNode);
  logCot.addLogs([firstItem]);
  times(10 - 1).forEach(() => logCot.addLogs([new LongLog(anyNode)]));

  expect(logCot.longLogs[0].id).toEqual(firstItem.id);
  // input one more to rotate the logs
  logCot.addLogs([new LongLog(anyNode)]);
  expect(logCot.longLogs[0].id).not.toEqual(firstItem.id);
});

it("should parse logs to generator new FeatureLine ", () => {
  const invalidNode: FeatureNode = {
    featureName: "a",
    nodeName: "b",
    nodeType: FeatureNodeTypeEnum.end,
    nodeDescription: "",
    nodeStatus: FeatureNodeStatusEnum.fail,
  };
  const logCot = new LongLogContainer();
  logCot.addLogs([new LongLog(invalidNode)]);
  // there is nothing to do
  expect(logCot.features.length).toEqual(0);

  logCot.addLogs([
    new LongLog({
      ...invalidNode,
      nodeType: FeatureNodeTypeEnum.start,
    }),
  ]);
  // there is nothing to do
  expect(logCot.features.length).toEqual(1);
});

it("should parse logs to generator new FeatureLine when there`s no feature", () => {
  const invalidNode: FeatureNode = {
    featureName: "a",
    nodeName: "b",
    nodeType: FeatureNodeTypeEnum.end,
    nodeDescription: "",
    nodeStatus: FeatureNodeStatusEnum.fail,
  };
  const logCot = new LongLogContainer();
  logCot.addLogs([new LongLog(invalidNode)]);
  // there is nothing to do
  expect(logCot.features.length).toEqual(0);

  logCot.addLogs([
    new LongLog({
      ...invalidNode,
      nodeType: FeatureNodeTypeEnum.start,
    }),
  ]);
  expect(logCot.features.length).toEqual(1);
  expect(logCot.features[0].featureStatus).toEqual(FeatureStatusEnum.fail);
});

it("should same node restart", () => {
  const sameStartNode: FeatureNode = {
    featureName: "a",
    nodeName: "b",
    nodeType: FeatureNodeTypeEnum.start,
    nodeDescription: "",
    nodeStatus: FeatureNodeStatusEnum.success,
  };
  const logCot = new LongLogContainer();
  logCot.addLogs([new LongLog(sameStartNode)]);
  logCot.addLogs([new LongLog(sameStartNode)]);
  // there is nothing to do
  expect(logCot.features.length).toEqual(1);
  expect(logCot.features[0].featureStatus).toEqual(FeatureStatusEnum.pending);
});

it("should not the same as current feat", () => {
  const logCot = new LongLogContainer();
  logCot.addLogs([
    new LongLog({
      featureName: "feat-1",
      nodeName: "feat-1__node-1",
      nodeType: FeatureNodeTypeEnum.start,
      nodeStatus: FeatureNodeStatusEnum.success,
    }),
  ]);
  logCot.addLogs([
    new LongLog({
      featureName: "feat-2",
      nodeName: "feat-2__node-1",
      nodeType: FeatureNodeTypeEnum.start,
      nodeStatus: FeatureNodeStatusEnum.success,
    }),
  ]);
  expect(logCot.features[0].featureStatus).toEqual(FeatureStatusEnum.left);
  expect(logCot.features[1].featureStatus).toEqual(FeatureStatusEnum.pending);
});

it("should the same as current feat and all the logs are success", () => {
  const logCot = new LongLogContainer();
  logCot.addLogs([
    new LongLog({
      featureName: "feat-1",
      nodeName: "feat-1__node-1",
      nodeType: FeatureNodeTypeEnum.start,
      nodeStatus: FeatureNodeStatusEnum.success,
    }),
  ]);
  logCot.addLogs([
    new LongLog({
      featureName: "feat-1",
      nodeName: "feat-1__node-2",
      nodeType: FeatureNodeTypeEnum.middle,
      nodeStatus: FeatureNodeStatusEnum.success,
    }),
  ]);
  expect(logCot.features[0].featureStatus).toEqual(FeatureStatusEnum.pending);
  logCot.addLogs([
    new LongLog({
      featureName: "feat-1",
      nodeName: "feat-1__node-3",
      nodeType: FeatureNodeTypeEnum.end,
      nodeStatus: FeatureNodeStatusEnum.success,
    }),
  ]);
  expect(logCot.features[0].featureStatus).toEqual(FeatureStatusEnum.success);

  expect(logCot.features.length).toEqual(1);
});

it("should the same as current feat but the nodes has somesth wrong", () => {
  const logCot = new LongLogContainer();
  logCot.addLogs([
    new LongLog({
      featureName: "feat-1",
      nodeName: "feat-1__node-1",
      nodeType: FeatureNodeTypeEnum.start,
      nodeStatus: FeatureNodeStatusEnum.success,
    }),
  ]);
  logCot.addLogs([
    new LongLog({
      featureName: "feat-1",
      nodeName: "feat-1__node-2",
      nodeType: FeatureNodeTypeEnum.middle,
      nodeStatus: FeatureNodeStatusEnum.fail,
    }),
  ]);
  expect(logCot.features[0].featureStatus).toEqual(FeatureStatusEnum.fail);
  logCot.addLogs([
    new LongLog({
      featureName: "feat-1",
      nodeName: "feat-1__node-3",
      nodeType: FeatureNodeTypeEnum.end,
      nodeStatus: FeatureNodeStatusEnum.success,
    }),
  ]);
  expect(logCot.features[0].featureStatus).toEqual(FeatureStatusEnum.fail);

  expect(logCot.features.length).toEqual(1);
});
