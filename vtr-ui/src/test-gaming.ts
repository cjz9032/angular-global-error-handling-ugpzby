// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/dist/zone-testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

declare const require: any;

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

//#region Gaming Dashboard unit tests
const contextDashBoard1 = require.context('src/app/components/pages/page-device-gaming', true, /\.spec\.ts$/);
contextDashBoard1.keys().map(contextDashBoard1);
const contextDashBoard2 = require.context('src/app/components/widgets/widget-legion-edge', true, /\.spec\.ts$/);
contextDashBoard2.keys().map(contextDashBoard2);
const contextDashBoard3 = require.context('src/app/components/widgets/widget-device-update-settings', true, /\.spec\.ts$/);
contextDashBoard3.keys().map(contextDashBoard3);
const contextDashBoard4 = require.context('src/app/components/widgets/widget-quicksettings', true, /\.spec\.ts$/);
contextDashBoard4.keys().map(contextDashBoard4);
const contextDashBoard5 = require.context('src/app/components/widgets/widget-quicksettings-list', true, /\.spec\.ts$/);
contextDashBoard5.keys().map(contextDashBoard5);
const contextDashBoard6 = require.context('src/app/components/widgets/widget-system-monitor', true, /\.spec\.ts$/);
contextDashBoard6.keys().map(contextDashBoard6);
const contextDashBoard7 = require.context('src/app/components/widgets/widget-system-tools', true, /\.spec\.ts$/);
contextDashBoard7.keys().map(contextDashBoard7);
const contextDashBoard8 = require.context('src/app/components/widgets/widget-system-update', true, /\.spec\.ts$/);
contextDashBoard8.keys().map(contextDashBoard8);
const contextDashBoard9 = require.context('src/app/components/ui/ui-gaming-slider', true, /\.spec\.ts$/);
contextDashBoard9.keys().map(contextDashBoard9);
const contextDashBoard10 = require.context('src/app/components/ui/ui-gaming-driver-popup', true, /\.spec\.ts$/);
contextDashBoard10.keys().map(contextDashBoard10);
const contextDashBoard11 = require.context('src/app/components/modal/modal-gaming-legionedge', true, /\.spec\.ts$/);
contextDashBoard11.keys().map(contextDashBoard11);
const contextDashBoard12 = require.context('src/app/components/modal/modal-gaming-advanced-oc', true, /\.spec\.ts$/);
contextDashBoard12.keys().map(contextDashBoard12);
const contextDashBoard13 = require.context('src/app/components/modal/modal-gaming-thermal-mode2', true, /\.spec\.ts$/);
contextDashBoard13.keys().map(contextDashBoard13);
//#endregion

//#region Network Boost & Auto Close unit tests
const contextNA1 = require.context('src/app/components/pages/page-autoclose', true, /\.spec\.ts$/);
contextNA1.keys().map(contextNA1);
const contextNA2 = require.context('src/app/components/pages/page-networkboost', true, /\.spec\.ts$/);
contextNA2.keys().map(contextNA2);
const contextNA3 = require.context('src/app/components/widgets/widget-added-app-list', true, /\.spec\.ts$/);
contextNA3.keys().map(contextNA3);
//#endregion

//#region Lighting unit tests
const contextLighting1 = require.context('src/app/components/pages/page-lightingcustomize', true, /\.spec\.ts$/);
contextLighting1.keys().map(contextLighting1);
const contextLighting2 = require.context('src/app/components/widgets/widget-lighting', true, /\.spec\.ts$/);
contextLighting2.keys().map(contextLighting2);
const contextLighting3 = require.context('src/app/components/widgets/widget-lighting-desk', true, /\.spec\.ts$/);
contextLighting3.keys().map(contextLighting3);
const contextLighting4 = require.context('src/app/components/widgets/widget-lighting-notebook', true, /\.spec\.ts$/);
contextLighting4.keys().map(contextLighting4);
const contextLighting5 = require.context('src/app/components/ui/ui-color-picker', true, /\.spec\.ts$/);
contextLighting5.keys().map(contextLighting5);
const contextLighting6 = require.context('src/app/components/ui/ui-color-wheel', true, /\.spec\.ts$/);
contextLighting6.keys().map(contextLighting6);
const contextLighting7 = require.context('src/app/components/ui/ui-add-reduce-button', true, /\.spec\.ts$/);
contextLighting7.keys().map(contextLighting7);
const contextLighting8 = require.context('src/app/components/ui/ui-brightness-slider', true, /\.spec\.ts$/);
contextLighting8.keys().map(contextLighting8);
const contextLighting9 = require.context('src/app/components/ui/ui-lighting-effect', true, /\.spec\.ts$/);
contextLighting9.keys().map(contextLighting9);
const contextLighting10 = require.context('src/app/components/ui/ui-lighting-keyboard-lnbx50', true, /\.spec\.ts$/);
contextLighting10.keys().map(contextLighting10);
const contextLighting11 = require.context('src/app/components/ui/ui-lighting-profile', true, /\.spec\.ts$/);
contextLighting11.keys().map(contextLighting11);
const contextLighting12 = require.context('src/app/components/ui/ui-lighting-profile-toggle', true, /\.spec\.ts$/);
contextLighting12.keys().map(contextLighting12);
const contextLighting13 = require.context('src/app/components/ui/ui-lighting-single-color', true, /\.spec\.ts$/);
contextLighting13.keys().map(contextLighting13);
const contextLighting14 = require.context('src/app/components/ui/ui-toggle', true, /\.spec\.ts$/);
contextLighting14.keys().map(contextLighting14);
const contextLighting15 = require.context('src/app/components/modal/modal-gaming-lighting', true, /\.spec\.ts$/);
contextLighting15.keys().map(contextLighting15);
//#endregion

//#region MacroKey unit tests
const contextMacroKey1 = require.context('src/app/components/pages/page-macrokey', true, /\.spec\.ts$/);
contextMacroKey1.keys().map(contextMacroKey1);
const contextMacroKey2 = require.context('src/app/components/widgets/widget-macrokey-settings', true, /\.spec\.ts$/);
contextMacroKey2.keys().map(contextMacroKey2);
const contextMacroKey5 = require.context('src/app/components/ui/ui-macrokey-details', true, /\.spec\.ts$/);
contextMacroKey5.keys().map(contextMacroKey5);
const contextMacroKey6 = require.context('src/app/components/ui/ui-macrokey-recorded-list', true, /\.spec\.ts$/);
contextMacroKey6.keys().map(contextMacroKey6);
const contextMacroKey8 = require.context('src/app/components/ui/ui-number-button', true, /\.spec\.ts$/);
contextMacroKey8.keys().map(contextMacroKey8);
//#endregion

//#region Modal unit tests
const contextModal1 = require.context('src/app/components/modal/modal-gaming-prompt', true, /\.spec\.ts$/);
contextModal1.keys().map(contextModal1);
const contextModal2 = require.context('src/app/components/modal/modal-gaming-running-app-list', true, /\.spec\.ts$/);
contextModal2.keys().map(contextModal2);
//#endregion

//#region Service unit tests
const contextService1 = require.context('src/app/services/gaming/gaming-accessory', true, /\.spec\.ts$/);
contextService1.keys().map(contextService1);
const contextService2 = require.context('src/app/services/gaming/gaming-advanced-oc', true, /\.spec\.ts$/);
contextService2.keys().map(contextService2);
const contextService3 = require.context('src/app/services/gaming/gaming-autoclose', true, /\.spec\.ts$/);
contextService3.keys().map(contextService3);
const contextService4 = require.context('src/app/services/gaming/gaming-capabilities', true, /\.spec\.ts$/);
contextService4.keys().map(contextService4);
const contextService5 = require.context('src/app/services/gaming/gaming-hwinfo', true, /\.spec\.ts$/);
contextService5.keys().map(contextService5);
const contextService6 = require.context('src/app/services/gaming/gaming-hybrid-mode', true, /\.spec\.ts$/);
contextService6.keys().map(contextService6);
const contextService7 = require.context('src/app/services/gaming/gaming-keylock', true, /\.spec\.ts$/);
contextService7.keys().map(contextService7);
const contextService8 = require.context('src/app/services/gaming/gaming-networkboost', true, /\.spec\.ts$/);
contextService8.keys().map(contextService8);
const contextService9 = require.context('src/app/services/gaming/gaming-OC', true, /\.spec\.ts$/);
contextService9.keys().map(contextService9);
const contextService10 = require.context('src/app/services/gaming/gaming-over-drive', true, /\.spec\.ts$/);
contextService10.keys().map(contextService10);
const contextService11 = require.context('src/app/services/gaming/gaming-quick-setting-toolbar', true, /\.spec\.ts$/);
contextService11.keys().map(contextService11);
const contextService12 = require.context('src/app/services/gaming/gaming-system-update', true, /\.spec\.ts$/);
contextService12.keys().map(contextService12);
const contextService13 = require.context('src/app/services/gaming/gaming-thermal-mode', true, /\.spec\.ts$/);
contextService13.keys().map(contextService13);
const contextService14 = require.context('src/app/services/gaming/lighting', true, /\.spec\.ts$/);
contextService14.keys().map(contextService14);
const contextService15 = require.context('src/app/services/gaming/macrokey', true, /\.spec\.ts$/);
contextService15.keys().map(contextService15);
//#endregion
