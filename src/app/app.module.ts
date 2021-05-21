import { HttpClientModule } from "@angular/common/http";
import { NgModule, SchemaMetadata } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatNativeDateModule } from "@angular/material/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialModule } from "./material.module";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";

import { AppComponent } from "./app.component";
import { CoreModule } from "./core/core.module";
import { SharedModule } from "./shared/shared.module";
import { ClockComponent } from "src/app/components/clock/clock.component";

// var doErrSth = function () {
//   console.log("doErrSth");
//   throw new Error("doErrSth");
// };

// var outer = async function () {
//   const res = await new Promise((r) => {
//     r("nothing");
//   });
//   console.log(res);
//   // would throw error
//   doErrSth();
//   return 0;
// };
// var main = async () => {
//   outer();
//   // try {
//   // } catch (e) {
//   //   console.error(e);
//   // }
// };
// main();

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    CoreModule,
    SharedModule,
  ],
  entryComponents: [AppComponent],
  declarations: [AppComponent, ClockComponent],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: "fill" },
    },
  ],
})
export class AppModule {
  constructor() {
    // //@ts-ignore
    // this.xxxa.xxx = 123
    // setTimeout(() => {
    //   //@ts-ignore
    //   this.xxxa.xxx = 123
    // })
  }
}
