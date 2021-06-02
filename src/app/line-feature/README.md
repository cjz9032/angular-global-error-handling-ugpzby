

# Health System
This simple library provides a way to annotate your functions and call metrics for them.
Plus, we can make a user-case from observed individual functions metrics
<br>
<br>
# Table of Contents

- [Health System](#health-system)
- [Table of Contents](#table-of-contents)
- [Requirements](#requirements)
  - [Setup](#setup)
    - [Dependency](#dependency)
- [Usage](#usage)
  - [Examples](#examples)
    - [Simple](#simple)
      - [Preparing serveral functions for metrics collection.](#preparing-serveral-functions-for-metrics-collection)
    - [Dynimac Feature & Node](#dynimac-feature--node)
      - [Code](#code)
    - [Expectation Value of the Node](#expectation-value-of-the-node)
      - [`expectResult` let you validate the function with return value](#expectresult-let-you-validate-the-function-with-return-value)
      - [Environment Information](#environment-information)
      - [Namespacing](#namespacing)
      - [Notify](#notify)

<br>
<br>

# Requirements

* Zone.js - 0.11+

## Setup
To use this library the following need to be added to your polyfills(If you are using Angular CLI)


### Dependency
Put this into the `polyfills` file of your project:

```typescript
// ...
import 'zone.js';
import 'zone.js/dist/long-stack-trace-zone'; // enable it to track a long async stack
import './libs/line-feature/error-rewrite'; // NOTE: NOT THE ORIGIN ZONE-ERROR
// ...
```

If you want to using in `production` too, then replace the `ngZone` Module following as well:
```typescript
platformBrowserDynamic()
	.bootstrapModule(AppModule, {
		ngZone: new NgZone({
			enableLongStackTrace: true, // "false" in production by default
		}),
	})
	.catch((err) => {});
```
<br>
<br>

# Usage

## Examples

<br>

### Simple

#### Preparing serveral functions for metrics collection.

Then just annotate the method with `@lineFeature`,
and it should indicate the feature info, node info.

```typescript
    // Definition in xx.component[module].ts or xx.service.ts, wherever they located.

    import { lineFeature } from "./libs/line-feature/";
    import { FeatureNodeTypeEnum } from "./libs/line-feature/log-container";

    @lineFeature({
        featureName: "caseFoo",
        node: {
            nodeName: "caseFooStart",
            nodeType: FeatureNodeTypeEnum.start, // It's saying the node to start a feature
        },
    })
    startCaseFoo() {}

    @lineFeature({
        featureName: "caseFoo",
        node: {
            nodeName: "caseFooMiddle",
            nodeType: FeatureNodeTypeEnum.middle, // middle node
        },
    })
    middleCaseFoo() {}

    @lineFeature({
        featureName: "caseFoo",
        node: {
            nodeName: "caseFooEnd",
            nodeType: FeatureNodeTypeEnum.end, // It's time to finish this "caseFoo" feature
        },
    })
    endCaseFoo() {}


    // Excute them by user or others
    startCaseFoo() -> middleCaseFoo -> endCaseFoo()
```

<br>

### Dynimac Feature & Node
In the diagram below, now we have a start node with two branchs
```
   [case1-start, case2-start]
             / \
            /   \
           /     \
          /       \
   case1-middle  case2-middle
		|             |
		|			  |
		|			  |
    case1-end     case2-end
```
#### Code
It's very similiar to [Simple](#simple) Case. There are only subtle differences: just announce them using `customFeatureNode`.

```typescript

    @lineFeature({
        customFeatureNode: (args: any[]) => ({
            featureName: 'case1-start' + args[0],
            node: {
                nodeName: "startNode" + args[0],
                nodeType: FeatureNodeTypeEnum.start,
            },
        }),
    })
    startDynamically(caseNum) {}

    ...
    // The rest parts are same as `Simple` above
    ...

    // Passing function params
    startDynamically(1) -> ... -> endCase1()  // case1
    startDynamically(2) -> ... -> endCase2()  // case2
```
<br>

### Expectation Value of the Node

#### `expectResult` let you validate the function with return value

```typescript

    @lineFeature({
      featureName: "feat1",
      node: {
        nodeName: "startF1",
        nodeType: FeatureNodeTypeEnum.start,
      },
      expectResult: (arg, res) => {
        return res === "no"
          ? FeatureNodeStatusEnum.fail
          : FeatureNodeStatusEnum.success;
      },
    })
    start() {
      return "no";
    }

    start()
    // Listener
    lineFeatureEvent.on((evt) => {
        if (evt.data.node?.nodeInfo.nodeName === "feat1") {
            // display `true`, bacause of the expectResult
            console.log(evt.data.node?.nodeInfo.nodeStatus === FeatureNodeStatusEnum.fail) 
        }
    });
```


#### Environment Information
`EnvInfo` should keep and do not change 
```typescript

    class anyClss {
        @lineFeature({
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

    const anyIns = new anyClss();
    anyIns.fn1("123");
    anyIns.fn2();

    lineFeatureEvent.on((evt) => {
        // EnvInfo Changed: "123" !== "456"
        if (evt.data.node?.nodeInfo.nodeName === "nodeName2") {
            expect(evt.data.node?.nodeInfo.nodeStatus).toEqual(
                FeatureNodeStatusEnum.fail
            );
            expect(evt.data.feature.featureStatus).toEqual(FeatureStatusEnum.fail);
        }
    });
```
#### Namespacing
By default, features and listeners are registered under the root namespace,
if you want it to be more self-contained, you can mark it as namespaced.
```typescript

    // Namespaced featureNode
    @lineFeature({
      namespaced: 'namespaced-1',
      featureName: "feat1",
      node: {
        nodeName: "startF1",
        nodeType: FeatureNodeTypeEnum.start,
      }
    })
    start() {}

    start()
    // Namespaced listener
    lineFeatureEvent.on((evt) => {
        // would only receive `namespaced-1` events
        console.log(evt.data.container) // => { namespace: 'namespaced-1' }
    }, "namespaced-1");
```

#### Notify 
```typescript

    class anyClss {
        @lineFeature({
            featureName: "any",
            node: {
                nodeName: "nodeName1",
                nodeType: FeatureNodeTypeEnum.start,
            },
        })
        fn1(str: string, notify?: (res: any) => void) {
            notify && notify("notify");
            await sleep(1_000)
            return str;
        }
    }

    fn1("str");

    lineFeatureEvent.on((evt) => {
        // => true
        console.log(evt.data.node?.nodeInfo.result === 'notify')
    });
```