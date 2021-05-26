import "./polyfills";

import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { AppModule } from "./app/app.module";
import { enableProdMode, NgZone } from "@angular/core";
import { featureLogContainer } from "./app/line-feature";
import {
  FeatureEventType,
  FeatureStatusEnum,
} from "./app/line-feature/log-container";
// enableProdMode();

//subscript  event about features change
featureLogContainer.on(FeatureEventType.change, (pay) => {
  const feature = pay.data.feature;
  if (feature.featureStatus === FeatureStatusEnum.fail) {
    // log feature.error to see more info
    debugger // error occurs
  }

  if (feature.featureStatus === FeatureStatusEnum.success) {
    // complete a feature
    debugger
    feature.nodeLogs[0].nodeInfo
  }
});

featureLogContainer.features

platformBrowserDynamic()
  .bootstrapModule(AppModule, {
    ngZone: new NgZone({
      enableLongStackTrace: true,
    }),
  })
  .catch((err) => {
    console.error(err);
  });

/**  Copyright 2020 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */
