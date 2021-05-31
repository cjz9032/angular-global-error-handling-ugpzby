import { cloneDeep, times } from "lodash";
import mitt from "mitt";

import {
  LongLogContainer,
  LongLog,
  FeatureNodeTypeEnum,
  FeatureNode,
  FeatureNodeStatusEnum,
  FeatureStatusEnum,
  Feature,
  FeatureEventData,
} from "./log-container";

it("should be a rotation log with limiting numbers items", () => {
  const anyNode = {
    featureName: "a",
    nodeName: "b",
    nodeType: FeatureNodeTypeEnum.end,
    nodeDescription: "",
    nodeStatus: FeatureNodeStatusEnum.success,
    spendTime: 0,
  };

  const logCot = new LongLogContainer("root", 10);
  const firstItem: LongLog = new LongLog(anyNode);
  logCot.addLogs([firstItem]);
  times(10 - 1).forEach(() => logCot.addLogs([new LongLog(anyNode)]));

  expect(logCot.longLogs[0].id).toEqual(firstItem.id);
  // input one more to rotate the logs
  logCot.addLogs([new LongLog(anyNode)]);
  expect(logCot.longLogs[0].id).not.toEqual(firstItem.id);
});

it("should parse logs to generator new FeatureLine ", () => {
  const invalidNode = {
    featureName: "a",
    nodeName: "b",
    nodeType: FeatureNodeTypeEnum.end,
    nodeDescription: "",
    nodeStatus: FeatureNodeStatusEnum.fail,
    spendTime: 0,
  };

  const logCot = new LongLogContainer("root");
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

it("should feature to be successful from a sinlge node's success", () => {
  const node = {
    featureName: "a",
    nodeName: "b",
    nodeType: FeatureNodeTypeEnum.single,
    nodeStatus: FeatureNodeStatusEnum.success,
    spendTime: 0,
  };

  const logCot = new LongLogContainer("root");
  logCot.addLogs([new LongLog(node)]);

  // there is nothing to do
  expect(logCot.features.length).toEqual(1);
  expect(logCot.features[0].featureStatus).toEqual(FeatureStatusEnum.success);
});

it("should avoid restarting from the same node ", () => {
  const sameStartNode = {
    featureName: "a",
    nodeName: "b",
    nodeType: FeatureNodeTypeEnum.start,
    nodeDescription: "",
    nodeStatus: FeatureNodeStatusEnum.success,
    spendTime: 0,
  };

  const logCot = new LongLogContainer("root");
  logCot.addLogs([new LongLog(sameStartNode)]);
  logCot.addLogs([new LongLog(sameStartNode)]);
  // there is nothing to do
  expect(logCot.features.length).toEqual(2);
  expect(logCot.features[0].featureStatus).toEqual(FeatureStatusEnum.left);
  expect(logCot.features[1].featureStatus).toEqual(FeatureStatusEnum.pending);
});

it("should start a new feature and last feature to be left when the nodeType is start", () => {
  const logCot = new LongLogContainer("root");
  logCot.addLogs([
    new LongLog({
      featureName: "feat-1",
      nodeName: "feat-1__node-1",
      nodeType: FeatureNodeTypeEnum.start,
      nodeStatus: FeatureNodeStatusEnum.success,
      spendTime: 0,
    }),
  ]);
  logCot.addLogs([
    new LongLog({
      featureName: "feat-1",
      nodeName: "feat-1__node-1",
      nodeType: FeatureNodeTypeEnum.start,
      nodeStatus: FeatureNodeStatusEnum.fail,
      spendTime: 0,
    }),
  ]);
  expect(logCot.features[0].featureStatus).toEqual(FeatureStatusEnum.left);
  expect(logCot.features[1].featureStatus).toEqual(FeatureStatusEnum.fail);
});

it("should all the logs are success", () => {
  const logCot = new LongLogContainer("root");
  logCot.addLogs([
    new LongLog({
      featureName: "feat-1",
      nodeName: "feat-1__node-1",
      nodeType: FeatureNodeTypeEnum.start,
      nodeStatus: FeatureNodeStatusEnum.success,
      spendTime: 0,
    }),
  ]);
  logCot.addLogs([
    new LongLog({
      featureName: "feat-1",
      nodeName: "feat-1__node-2",
      nodeType: FeatureNodeTypeEnum.middle,
      nodeStatus: FeatureNodeStatusEnum.success,
      spendTime: 0,
    }),
  ]);
  expect(logCot.features[0].featureStatus).toEqual(FeatureStatusEnum.pending);
  logCot.addLogs([
    new LongLog({
      featureName: "feat-1",
      nodeName: "feat-1__node-3",
      nodeType: FeatureNodeTypeEnum.end,
      nodeStatus: FeatureNodeStatusEnum.success,
      spendTime: 0,
    }),
  ]);
  expect(logCot.features[0].featureStatus).toEqual(FeatureStatusEnum.success);

  expect(logCot.features.length).toEqual(1);
});

it("should the nodes has somesth wrong", () => {
  const logCot = new LongLogContainer("root");
  logCot.addLogs([
    new LongLog({
      featureName: "feat-1",
      nodeName: "feat-1__node-1",
      nodeType: FeatureNodeTypeEnum.start,
      nodeStatus: FeatureNodeStatusEnum.success,
      spendTime: 0,
    }),
  ]);
  logCot.addLogs([
    new LongLog({
      featureName: "feat-1",
      nodeName: "feat-1__node-2",
      nodeType: FeatureNodeTypeEnum.middle,
      nodeStatus: FeatureNodeStatusEnum.fail,
      spendTime: 0,
    }),
  ]);
  expect(logCot.features[0].featureStatus).toEqual(FeatureStatusEnum.fail);
  logCot.addLogs([
    new LongLog({
      featureName: "feat-1",
      nodeName: "feat-1__node-3",
      nodeType: FeatureNodeTypeEnum.end,
      nodeStatus: FeatureNodeStatusEnum.success,
      spendTime: 0,
    }),
  ]);
  expect(logCot.features[0].featureStatus).toEqual(FeatureStatusEnum.fail);

  expect(logCot.features.length).toEqual(1);
});

it("should provide existing serveral pending branch", () => {
  const logCot = new LongLogContainer("root");
  logCot.addLogs([
    new LongLog({
      featureName: "feat-1",
      nodeName: "root-node",
      nodeType: FeatureNodeTypeEnum.start,
      nodeStatus: FeatureNodeStatusEnum.success,
      spendTime: 0,
    }),
  ]);
  // root->n2 [√]
  logCot.addLogs([
    new LongLog({
      featureName: "feat-2",
      nodeName: "root-node",
      nodeType: FeatureNodeTypeEnum.start,
      nodeStatus: FeatureNodeStatusEnum.success,
      spendTime: 0,
    }),
  ]);
  expect(logCot.features.length).toEqual(2);
  expect(logCot.features[0].featureName).toEqual("feat-1");
  expect(logCot.features[1].featureName).toEqual("feat-2");
  expect(logCot.features[0].featureStatus).toEqual(FeatureStatusEnum.pending);
  expect(logCot.features[1].featureStatus).toEqual(FeatureStatusEnum.pending);
});
