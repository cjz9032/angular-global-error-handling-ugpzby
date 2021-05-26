

# Function Metrics
This simple library provides a way to annotate your functions and call metrics for them.
Plus, we can make a user-case from observed individual functions metrics
<br>
<br>
# Table of Contents

- [Function Metrics](#function-metrics)
- [Table of Contents](#table-of-contents)
- [Requirements](#requirements)
  - [Setup](#setup)
    - [Dependency](#dependency)
- [Usage](#usage)
  - [Examples](#examples)
    - [Simple](#simple)
      - [Preparing serveral functions for metrics collection.](#preparing-serveral-functions-for-metrics-collection)
      - [Adding listeners to fetch metrics](#adding-listeners-to-fetch-metrics)
    - [Tree Case](#tree-case)
      - [Code](#code)

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

#### Adding listeners to fetch metrics


```typescript
    import { featureLogContainer } from "./libs/line-feature";

    // Subscript a event
    featureLogContainer.on(FeatureEventType.change, (event) => {
        const { feature, type } = event.data;

        console.log(type) // add or upadate a feature
        
        if (feature.featureStatus === FeatureStatusEnum.fail) {
            // error occurs due to not handle error
            console.log(feature.error) // display error stack track which includes async parts of
        }

        if (feature.featureStatus === FeatureStatusEnum.success) {
            // To see "spendTime" or more details about nodes
            console.log(feature.spendTime, feature.nodeLogs)
        }
        // ...other status, e.g left, pending
    });

    // Remove event handler
    featureLogContainer.off(type, handler)
```

<br>

### Tree Case
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
It's very similiar to [Simple](#simple) Case. There are only subtle differences: just announce the start node's featureName as list type.

```typescript

    import { lineFeature } from "./libs/line-feature/";
    import { FeatureNodeTypeEnum } from "./libs/line-feature/log-container";

    @lineFeature({
        featureName: ["case-1","case-2"], // The only difference
        node: {
            nodeName: "case1or2Start",
            nodeType: FeatureNodeTypeEnum.start,
        },
    })
    startCase1or2() {}

    ...
    // The Rest methods are same as simple case's above
    ...

    // Excute them by user or others
    startCase1or2() -> middleCase1() -> endCase1()  // case1
    startCase1or2() -> middleCase2() -> endCase2()  // case2
```

