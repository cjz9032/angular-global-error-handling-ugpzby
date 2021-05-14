// import "./polyfills";

// import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
// import { AppModule } from "./app/app.module";

// platformBrowserDynamic()
//   .bootstrapModule(AppModule)
//   .catch((err) => {
//     debugger;
//     console.error(err);
//   });

let logs: string[] = [];
let zoneA = Zone.current.fork({
  name: "zoneA",
  onInvoke: function (
    delegate,
    currentZone,
    targetZone,
    callback,
    applyThis,
    applyArgs
  ) {
    logs.push("zoneA onInvoke");
    return delegate.invoke(targetZone, callback, applyThis, applyArgs);
  },
});
let zoneB = Zone.current.fork({
  name: "zoneB",
  onInvoke: function (
    delegate,
    currentZone,
    targetZone,
    callback,
    applyThis,
    applyArgs
  ) {
    logs.push("zoneB onInvoke");
    return delegate.invoke(targetZone, callback, applyThis, applyArgs);
  },
});
let zoneAChild = zoneA.fork({
  name: "zoneAChild",
  onInvoke: function (
    delegate,
    currentZone,
    targetZone,
    callback,
    applyThis,
    applyArgs
  ) {
    logs.push("zoneAChild onInvoke");
    return delegate.invoke(targetZone, callback, applyThis, applyArgs);
  },
});

zoneA.run(() => {
  zoneB.run(() => {
    zoneAChild.run(function test() {
      logs.push("begin run" + Zone.current.name);
      console.log("logs", logs);

      const error = new Error();
      console.error("trace", error.stack);
    });
  });
});

/**  Copyright 2020 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */
