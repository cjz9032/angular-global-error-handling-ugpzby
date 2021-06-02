import { cloneDeep, times } from "lodash";
import mitt from "mitt";
import "../../polyfills";

import {
  LongLogContainer,
  LongLog,
  FeatureNodeTypeEnum,
  FeatureNode,
  FeatureNodeStatusEnum,
  FeatureStatusEnum,
  Feature,
  FeatureEventData,
  lineFeatureEvent,
} from "./log-container";

import { lineFeature } from "./index";
jest.useFakeTimers();
it("should option customFeatureNode take effect if it be seted", () => {
  const customName = "custom-name";
  class anyClss {
    @lineFeature({
      customFeatureNode: (args: any[]) => ({
        featureName: args[0] + customName,
        node: {
          nodeName: "startF1",
          nodeType: FeatureNodeTypeEnum.start,
        },
      }),
    })
    fn(a: string, b: { b: number }) {}
  }

  lineFeatureEvent.on((evt) => {
    expect(evt.data.feature.featureName).toEqual("str" + customName);
  });
  const anyIns = new anyClss();
  anyIns.fn("str", {
    b: 123,
  });
  jest.runAllTimers();
});

it("should only receiving event in a namespace", () => {
  class anyClss {
    @lineFeature({
      namespace: "namespace1",
      featureName: "123",
      node: {
        nodeName: "startF1",
        nodeType: FeatureNodeTypeEnum.start,
      },
    })
    fn() {}
  }

  lineFeatureEvent.on((evt) => {
    expect(evt.data.feature.featureName).toEqual("123");
  }, "namespace1");
  const anyIns = new anyClss();
  anyIns.fn();
  jest.runAllTimers();
});

it("should option expectResult take effect if it be seted", () => {
  class anyClss {
    @lineFeature({
      namespace: "namespace2",
      featureName: "123",
      node: {
        nodeName: "startF1",
        nodeType: FeatureNodeTypeEnum.start,
      },
      expectResult: (arg, res) => {
        return res === "res"
          ? FeatureNodeStatusEnum.fail
          : FeatureNodeStatusEnum.success;
      },
    })
    fn() {
      return "res";
    }
  }

  lineFeatureEvent.on((evt) => {
    expect(evt.data.node?.nodeInfo.nodeStatus).toEqual(
      FeatureNodeStatusEnum.fail
    );
  }, "namespace2");
  const anyIns = new anyClss();
  anyIns.fn();
  jest.runAllTimers();
});

it("should call notify with returning a value that replace the real function returns before function executed", () => {
  class anyClss {
    @lineFeature({
      namespace: "namespace3",
      featureName: "123",
      node: {
        nodeName: "startF1",
        nodeType: FeatureNodeTypeEnum.start,
      },
      expectResult: (arg, res) => {
        return res === "notify-str"
          ? FeatureNodeStatusEnum.success
          : FeatureNodeStatusEnum.fail;
      },
    })
    fn(str: string, notify?: (res: any) => void) {
      notify && notify("notify-str");
      return "res";
    }
  }

  lineFeatureEvent.on((evt) => {
    expect(evt.data.node?.nodeInfo.nodeStatus).toEqual(
      FeatureNodeStatusEnum.success
    );
  }, "namespace3");
  const anyIns = new anyClss();
  anyIns.fn("anystr");
  jest.runAllTimers();
});

it("should turn success into failure once envInfo changed from the coming node", () => {
  class anyClss {
    @lineFeature({
      namespace: "namespace4",
      featureName: "any",
      node: {
        nodeName: "nodeName1",
        nodeType: FeatureNodeTypeEnum.start,
      },
      defineEnvInfo: (args) => {
        return args[0];
      },
    })
    fn1(str: string) {}

    @lineFeature({
      namespace: "namespace4",
      featureName: "any",
      node: {
        nodeName: "nodeName2",
        nodeType: FeatureNodeTypeEnum.end,
      },
      defineEnvInfo: (args) => {
        return "456";
      },
    })
    fn2() {}
  }

  lineFeatureEvent.on((evt) => {
    if (evt.data.node?.nodeInfo.nodeName === "nodeName1") {
      expect(evt.data.node?.nodeInfo.nodeStatus).toEqual(
        FeatureNodeStatusEnum.success
      );
      expect(evt.data.feature.featureStatus).not.toEqual(
        FeatureStatusEnum.fail
      );
    }
    if (evt.data.node?.nodeInfo.nodeName === "nodeName2") {
      expect(evt.data.node?.nodeInfo.nodeStatus).toEqual(
        FeatureNodeStatusEnum.fail
      );
      expect(evt.data.feature.featureStatus).toEqual(FeatureStatusEnum.fail);
    }
  }, "namespace4");
  const anyIns = new anyClss();
  anyIns.fn1("123");
  anyIns.fn2();
  jest.runAllTimers();
});
