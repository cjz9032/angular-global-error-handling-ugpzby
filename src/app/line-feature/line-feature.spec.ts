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
it("should option customFeatureNode take effect if lineFeature be seted", () => {
  const customName = "custom-name";
  class anyClss {
    @lineFeature({
      customFeatureNode: (args: any[]) => {
        return {
          featureName: args[0].a + customName,
          node: {
            nodeName: "startF1",
            nodeType: FeatureNodeTypeEnum.start,
          },
        };
      },
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
