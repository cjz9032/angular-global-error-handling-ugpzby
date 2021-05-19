
import "./polyfills";

import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { AppModule } from "./app/app.module";
import { enableProdMode, NgZone } from "@angular/core";
// enableProdMode();
platformBrowserDynamic()
  .bootstrapModule(AppModule, {
    ngZone:  new NgZone({
      enableLongStackTrace: true,
    }),
  })
  .catch((err) => {
    console.error(err);
  });

/**  Copyright 2020 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */
