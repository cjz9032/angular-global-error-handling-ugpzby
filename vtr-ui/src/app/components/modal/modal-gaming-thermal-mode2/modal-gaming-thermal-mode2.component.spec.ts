import { TestBed, ComponentFixture, async, fakeAsync, tick } from '@angular/core/testing';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateStore } from '@ngx-translate/core';

import { HttpClientModule } from '@angular/common/http';
import { TranslationModule } from 'src/app/modules/translation.module';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

import { SvgInlinePipe } from 'src/app/pipe/svg-inline/svg-inline.pipe';
import { ModalGamingThermalMode2Component } from './modal-gaming-thermal-mode2.component';

import { GamingAllCapabilitiesService } from 'src/app/services/gaming/gaming-capabilities/gaming-all-capabilities.service';
import { GamingThermalModeService } from 'src/app/services/gaming/gaming-thermal-mode/gaming-thermal-mode.service';
import { GamingOCService } from 'src/app/services/gaming/gaming-OC/gaming-oc.service';
import { CommonService } from 'src/app/services/common/common.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { of } from 'rxjs';

@Component({ selector: 'vtr-modal-gaming-prompt', template: '' })
export class ModalGamingPromptStubComponent {
    componentInstance = {
        title: undefined,
        description: undefined,
        description2: undefined,
        description3: undefined,
        comfirmButton: undefined,
        cancelButton: undefined,
        emitService: of(1)
    }
 }

describe('ModalGamingThermalMode2Component', () => {
    let component: ModalGamingThermalMode2Component;
    let fixture: ComponentFixture<ModalGamingThermalMode2Component>;
    let shellService: any;

    let thermalModeSettingStatus = 2;
    let performanceOCSetting = false;
    let autoSwitchStatus = false;
    let thermalModeSettingStatusCache = 2;
    let autoSwitchStatusCache = false;
    let cpuOCStatusCache = 1;
    let gpuOCStatusCache = 1;
    let setReturnValue = false;

    let commonServiceMock = {
        getLocalStorageValue(key: any) {
            switch (key) {
                case '[LocalStorageKey] CurrentThermalModeStatus':
                    return thermalModeSettingStatusCache;
                case '[LocalStorageKey] CpuOCStatus':
                    return cpuOCStatusCache;
                case '[LocalStorageKey] GpuOCStatus':
                    return gpuOCStatusCache;
                case '[LocalStorageKey] AutoSwitchStatus':
                    return autoSwitchStatusCache;
                case '[LocalStorageKey] CpuOCStatus':
                    return cpuOCStatusCache;
                case '[LocalStorageKey] GpuOCStatus':
                    return gpuOCStatusCache;
            }
        },
        setLocalStorageValue(key: any, value: any) {
            switch (key) {
                case '[LocalStorageKey] CurrentThermalModeStatus':
                    thermalModeSettingStatusCache = value;
                    break;
                case '[LocalStorageKey] CpuOCStatus':
                    cpuOCStatusCache = value;
                    break;
                case '[LocalStorageKey] GpuOCStatus':
                    gpuOCStatusCache = value;
                    break;
                case '[LocalStorageKey] AutoSwitchStatus':
                    autoSwitchStatusCache = value;
                    break;
                case '[LocalStorageKey] CpuOCStatus':
                    cpuOCStatusCache = value;
                    break;
                case '[LocalStorageKey] GpuOCStatus':
                    gpuOCStatusCache = value;
                    break;
            }
        }
    };
    let GamingAllCapabilitiesServiceMock = {
        isShellAvailable: true,
        getCapabilityFromCache(key: any) {
            switch (key) {
                case '[LocalStorageKey] DesktopType':
                    return true;
                case '[LocalStorageKey] SmartFanFeature':
                    return true;
                case '[LocalStorageKey] SupporttedThermalMode':
                    return [1, 2, 3];
                case '[LocalStorageKey] CpuOCFeature':
                    return true;
                case '[LocalStorageKey] GpuOCFeature':
                    return true;
                case '[LocalStorageKey] XtuService':
                    return true;
                case '[LocalStorageKey] NvDriver':
                    return true;
                case '[LocalStorageKey] AdvanceCPUOCFeature':
                    return true;
                case '[LocalStorageKey] AdvanceGPUOCFeature':
                    return true;
            }
        }
    };
    let gamingThermalModeServiceMock = {
        isShellAvailable: true,
        getThermalModeSettingStatus() {
            return new Promise(resolve => {
                resolve(thermalModeSettingStatus)
            })
        },
        setThermalModeSettingStatus(value: number) {
            if (setReturnValue) {
                thermalModeSettingStatus = value;
            }
            return new Promise(resolve => {
                resolve(setReturnValue);
            })
        },
        getAutoSwitchStatus() {
            return new Promise(resolve => {
                resolve(autoSwitchStatus);
            })
        },
        setAutoSwitchStatus(value: boolean) {
            if (setReturnValue) {
                autoSwitchStatus = value;
            }
            return new Promise(resolve => {
                resolve(setReturnValue);
            })
        },
        regThermalModeChangeEvent() {
            return new Promise(resolve => {
                resolve(setReturnValue);
            })
        }
    }
    let gamingOCServiceMock = {
        isShellAvailable: true,
        getPerformanceOCSetting() {
            return new Promise(resolve => {
                resolve(performanceOCSetting);
            })
        },
        setPerformanceOCSetting(value: boolean) {
            if (setReturnValue) {
                performanceOCSetting = value;
            }
            return new Promise(resolve => {
                resolve(setReturnValue);
            })
        }
    }
    describe('thermalMode', () => {
        beforeEach(async(() => {
            let shellServiveSpy = jasmine.createSpyObj('VantageService', ['registerEvent', 'unRegisterEvent', 'getLogger']);
            TestBed.configureTestingModule({
                declarations: [
                    ModalGamingThermalMode2Component,
                    ModalGamingPromptStubComponent,
                    SvgInlinePipe
                ],
                imports: [
                    TranslationModule,
                    HttpClientModule,
                ],
                providers: [
                    NgbModal,
                    NgbActiveModal,
                    TranslateStore,
                    { provide: VantageShellService, useValue: shellServiveSpy },
                    { provide: CommonService, useValue: commonServiceMock },
                    { provide: GamingAllCapabilitiesService, useValue: GamingAllCapabilitiesServiceMock },
                    { provide: GamingThermalModeService, useValue: gamingThermalModeServiceMock },
                    { provide: GamingOCService, useValue: gamingOCServiceMock }
                ],
                schemas: [
                    NO_ERRORS_SCHEMA
                ]
            });
            shellService = TestBed.inject(VantageShellService);
            fixture = TestBed.createComponent(ModalGamingThermalMode2Component);
            component = fixture.componentInstance;
            fixture.detectChanges();
        }));
        it('should create', () => {
            expect(component).toBeDefined();
        });
        it('getThermalModeSettingStatus', fakeAsync(() => {
            thermalModeSettingStatus = 1;
            component.getThermalModeSettingStatus();
            tick();
            expect(component.thermalModeSettingStatus).toBe(1, 'component.thermalModeSettingStatus shoulde be 1');
            expect(thermalModeSettingStatusCache).toBe(1, 'thermalModeSettingStatusCache shoulde be 1');
            thermalModeSettingStatus = 2;
            component.getThermalModeSettingStatus();
            tick();
            expect(component.thermalModeSettingStatus).toBe(2, 'component.thermalModeSettingStatus shoulde be 2');
            expect(thermalModeSettingStatusCache).toBe(2, 'thermalModeSettingStatusCache shoulde be 2');
            thermalModeSettingStatus = 3;
            component.getThermalModeSettingStatus();
            tick();
            expect(component.thermalModeSettingStatus).toBe(3, 'component.thermalModeSettingStatus shoulde be 3');
            expect(thermalModeSettingStatusCache).toBe(3, 'thermalModeSettingStatusCache shoulde be 3');
        }));
        it('setThermalModeSettingStatus', fakeAsync(() => {
            setReturnValue = true;
            for (let i = 1; i < 4; i++) {
                component.thermalModeSettingStatus = i;
                thermalModeSettingStatus = i;
                thermalModeSettingStatusCache = i;
                for (let j = 1; j < 4; j++) {
                    component.setThermalModeSettingStatus(j);
                    expect(component.thermalModeSettingStatus).toBe(j, `setReturnValue is ${setReturnValue}, component.thermalModeSettingStatusCache should be ${j}`)
                    expect(thermalModeSettingStatusCache).toBe(j, `setReturnValue is ${setReturnValue}, thermalModeSettingStatusCache should be ${j}`);
                    expect(thermalModeSettingStatus).toBe(j, `setReturnValue is ${setReturnValue}, thermalModeSettingStatus should be ${j}`);
                }
            }
            setReturnValue = false;
            for (let i = 1; i < 4; i++) {
                component.thermalModeSettingStatus = i;
                thermalModeSettingStatus = i;
                thermalModeSettingStatusCache = i;
                for (let j = 1; j < 4; j++) {
                    component.setThermalModeSettingStatus(j);
                    tick();
                    expect(component.thermalModeSettingStatus).toBe(i, `setReturnValue is ${setReturnValue}, component.thermalModeSettingStatus should keep ${i}`);
                    expect(thermalModeSettingStatusCache).toBe(i, `setReturnValue is ${setReturnValue}, thermalModeSettingStatusCache should keep ${i}`);
                    expect(thermalModeSettingStatus).toBe(i, `setReturnValue is ${setReturnValue}, thermalModeSettingStatus should keep ${i}`);
                }
            }
        }));
        it('getAutoSwitchStatus', fakeAsync(() => {
            autoSwitchStatus = false;
            component.getAutoSwitchStatus();
            tick();
            expect(component.autoSwitchStatus).toBe(false, 'component.autoSwitchStatus shoulde be false');
            expect(autoSwitchStatusCache).toBe(false, 'autoSwitchStatusCache shoulde be false');
            autoSwitchStatus = true;
            component.getAutoSwitchStatus();
            tick();
            expect(component.autoSwitchStatus).toBe(true, 'component.autoSwitchStatus shoulde be true');
            expect(autoSwitchStatusCache).toBe(true, 'autoSwitchStatusCache shoulde be true');
        }));
        it('setAutoSwitchStatus', fakeAsync(() => {
            setReturnValue = true;
            component.setAutoSwitchStatus(false);
            tick();
            expect(component.autoSwitchStatus).toBe(false, `setReturnValue is ${setReturnValue}, component.autoSwitchStatus should be false`);
            expect(autoSwitchStatusCache).toBe(false, `setReturnValue is ${setReturnValue}, autoSwitchStatusCache should be false`);
            expect(autoSwitchStatus).toBe(false, `setReturnValue is ${setReturnValue}, autoSwitchStatus should be false`);
            component.setAutoSwitchStatus(true);
            tick();
            expect(component.autoSwitchStatus).toBe(true, `setReturnValue is ${setReturnValue}, component.autoSwitchStatus should be true`);
            expect(autoSwitchStatusCache).toBe(true, `setReturnValue is ${setReturnValue}, autoSwitchStatusCache should be true`);
            expect(autoSwitchStatus).toBe(true, `setReturnValue is ${setReturnValue}, autoSwitchStatus should be true`);
            setReturnValue = false;
            component.autoSwitchStatus = true;
            autoSwitchStatusCache = true;
            autoSwitchStatus = true;
            component.setAutoSwitchStatus(false);
            tick();
            expect(component.autoSwitchStatus).toBe(true, `setReturnValue is ${setReturnValue}, component.autoSwitchStatus should keep true`);
            expect(autoSwitchStatusCache).toBe(true, `setReturnValue is ${setReturnValue}, autoSwitchStatusCache should keep true`);
            expect(autoSwitchStatus).toBe(true, `setReturnValue is ${setReturnValue}, autoSwitchStatus should keep true`);
            component.autoSwitchStatus = false;
            autoSwitchStatusCache = false;
            autoSwitchStatus = false;
            component.setAutoSwitchStatus(true);
            tick();
            expect(component.autoSwitchStatus).toBe(false, `setReturnValue is ${setReturnValue}, component.autoSwitchStatus should keep false`);
            expect(autoSwitchStatusCache).toBe(false, `setReturnValue is ${setReturnValue}, autoSwitchStatusCache should keep false`);
            expect(autoSwitchStatus).toBe(false, `setReturnValue is ${setReturnValue}, autoSwitchStatus should keep false`);
        }));
        it('registerThermalModeChangeEvent', () => {
            component.gamingCapabilities.smartFanFeature = false;
            component.registerThermalModeChangeEvent();
            expect(shellService.registerEvent).toHaveBeenCalledTimes(1);
            component.gamingCapabilities.smartFanFeature = true;
            component.registerThermalModeChangeEvent();
            expect(shellService.registerEvent).toHaveBeenCalledTimes(2);
        });
        it('onRegThermalModeChangeEvent', () => {
            for (let i = 1; i < 4; i++) {
                component.thermalModeSettingStatus = i;
                thermalModeSettingStatusCache = i;
                component.onRegThermalModeChangeEvent(undefined);
                expect(component.thermalModeSettingStatus).toBe(i, `callback is undefined, component.thermalModeSettingStatusCache should be ${i}`)
                expect(thermalModeSettingStatusCache).toBe(i, `callback is undefined, thermalModeSettingStatusCache should be ${i}`);
                for (let j = 1; j < 4; j++) {
                    thermalModeSettingStatus = j;
                    component.onRegThermalModeChangeEvent(j);
                    expect(component.thermalModeSettingStatus).toBe(thermalModeSettingStatus, `callback is not undefined, component.thermalModeSettingStatusCache should be ${j}`)
                    expect(thermalModeSettingStatusCache).toBe(thermalModeSettingStatus, `callback is not undefined, thermalModeSettingStatusCache should be ${j}`);
                }
            }
        });
        it('unRegisterThermalModeChangeEvent', () => {
            expect(shellService.unRegisterEvent).toHaveBeenCalledTimes(0);
            component.unRegisterThermalModeChangeEvent();
            expect(shellService.unRegisterEvent).toHaveBeenCalledTimes(1);
        });
        it('ngOnDestory', () => {
            spyOn(component, 'unRegisterThermalModeChangeEvent').and.callThrough();
            expect(component.unRegisterThermalModeChangeEvent).toHaveBeenCalledTimes(0);
            component.ngOnDestory();
            expect(component.unRegisterThermalModeChangeEvent).toHaveBeenCalledTimes(1);
        })
    })
    describe('performanceOC', () => {
        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [
                    ModalGamingThermalMode2Component,
                    ModalGamingPromptStubComponent,
                    SvgInlinePipe
                ],
                imports: [
                    TranslationModule,
                    HttpClientModule,
                ],
                providers: [
                    NgbModal,
                    NgbActiveModal,
                    TranslateStore,
                    { provide: CommonService, useValue: commonServiceMock },
                    { provide: GamingAllCapabilitiesService, useValue: GamingAllCapabilitiesServiceMock },
                    { provide: GamingThermalModeService, useValue: gamingThermalModeServiceMock },
                    { provide: GamingOCService, useValue: gamingOCServiceMock }
                ],
                schemas: [
                    NO_ERRORS_SCHEMA
                ]
            });
            fixture = TestBed.createComponent(ModalGamingThermalMode2Component);
            component = fixture.componentInstance;
            fixture.detectChanges();
        }));
        it('should create', () => {
            expect(component).toBeDefined();
        });
        it('getPerformanceOC(cpu&gpu)', fakeAsync(() => {
            component.gamingCapabilities.cpuOCFeature = true;
            component.gamingCapabilities.gpuOCFeature = true;
            expect(component.OCsupportted).toBe(3, 'OCsupported should be 3');
            performanceOCSetting = false;
            component.getPerformanceOCSetting();
            tick();
            expect(component.OCSettings).toBe(false, 'component.OCSettings should be false');
            expect(cpuOCStatusCache).toBe(3, 'cpuOCStatusCache should be 3(false)');
            expect(gpuOCStatusCache).toBe(3, 'gpuOCStatusCache should be 3(false)');

            performanceOCSetting = true;
            component.getPerformanceOCSetting();
            tick();
            expect(component.OCSettings).toBe(true, 'component.OCSettings should be true');
            expect(cpuOCStatusCache).toBe(1, 'cpuOCStatusCache should be 1(true)');
            expect(gpuOCStatusCache).toBe(1, 'gpuOCStatusCache should be 1(true)');
        }));
        it('setPerformanceOC(cpu&gpu)', fakeAsync(() => {
            component.gamingCapabilities.cpuOCFeature = true;
            component.gamingCapabilities.gpuOCFeature = true;
            expect(component.OCsupportted).toBe(3, 'OCsupported should be 3');
            setReturnValue = true;
            // set false to true
            component.OCSettings = false;
            cpuOCStatusCache = 3;
            gpuOCStatusCache = 3;
            performanceOCSetting = false;
            component.setPerformanceOCSetting(true);
            tick();
            expect(component.OCSettings).toBe(true, `setReturnValue is ${setReturnValue}, component.OCSettings should be true`);
            expect(cpuOCStatusCache).toBe(1, `setReturnValue is ${setReturnValue},cpuOCStatusCache should be 1(true)`);
            expect(gpuOCStatusCache).toBe(1, `setReturnValue is ${setReturnValue},gpuOCStatusCache should be 1(true)`);
            // set true to false
            component.OCSettings = true;
            cpuOCStatusCache = 1;
            gpuOCStatusCache = 1;
            performanceOCSetting = true;
            component.setPerformanceOCSetting(false);
            tick();
            expect(component.OCSettings).toBe(false, `setReturnValue is ${setReturnValue}, component.OCSettings should be false`);
            expect(cpuOCStatusCache).toBe(3, `setReturnValue is ${setReturnValue},cpuOCStatusCache should be 3(false)`);
            expect(gpuOCStatusCache).toBe(3, `setReturnValue is ${setReturnValue},gpuOCStatusCache should be 3(false)`);

            setReturnValue = false;
            // set true return false
            component.OCSettings = false;
            cpuOCStatusCache = 3;
            gpuOCStatusCache = 3;
            performanceOCSetting = false;
            component.setPerformanceOCSetting(true);
            tick();
            expect(component.OCSettings).toBe(false, `setReturnValue is ${setReturnValue}, component.OCSettings keep false`);
            expect(cpuOCStatusCache).toBe(3, `setReturnValue is ${setReturnValue},cpuOCStatusCache should keep 3(false)`);
            expect(gpuOCStatusCache).toBe(3, `setReturnValue is ${setReturnValue},gpuOCStatusCache should keep 3(false)`);
            // set false return false
            component.OCSettings = true;
            cpuOCStatusCache = 1;
            gpuOCStatusCache = 1;
            performanceOCSetting = true;
            component.setPerformanceOCSetting(false);
            tick();
            expect(component.OCSettings).toBe(true, `setReturnValue is ${setReturnValue}, component.OCSettings keep true`);
            expect(cpuOCStatusCache).toBe(1, `setReturnValue is ${setReturnValue},cpuOCStatusCache should keep 1(true)`);
            expect(gpuOCStatusCache).toBe(1, `setReturnValue is ${setReturnValue},gpuOCStatusCache should keep 1(true)`);
        }));
        it('ngOnInit cpu only', () => {
            component.gamingCapabilities.cpuOCFeature = true;
            component.gamingCapabilities.gpuOCFeature = false;
            cpuOCStatusCache = 3;
            gpuOCStatusCache = 3;
            component.OCSettings = true;
            component.ngOnInit();
            expect(component.OCSettings).toBe(false, 'cpuOCStatusCache is 3, componentOSSettings should be init to false');
            cpuOCStatusCache = 1;
            component.OCSettings = false;
            component.ngOnInit();
            expect(component.OCSettings).toBe(true, 'cpuOCStatusCache is 1, componentOSSettings should be init to true');
        })
        it('getPerformanceOC(cpu only)', fakeAsync(() => {
            component.gamingCapabilities.cpuOCFeature = true;
            component.gamingCapabilities.gpuOCFeature = false;
            component.renderOCSupported();
            expect(component.OCsupportted).toBe(2, 'OCsupported should be 2');
            performanceOCSetting = false;
            gpuOCStatusCache = 3;
            component.getPerformanceOCSetting();
            tick();
            expect(component.OCSettings).toBe(false, 'component.OCSettings should be false');
            expect(cpuOCStatusCache).toBe(3, 'cpuOCStatusCache should be 3(false)');
            expect(gpuOCStatusCache).toBe(3, 'gpuOCStatusCache should keep 3(false)');

            performanceOCSetting = true;
            component.getPerformanceOCSetting();
            tick();
            expect(component.OCSettings).toBe(true, 'component.OCSettings should be true');
            expect(cpuOCStatusCache).toBe(1, 'cpuOCStatusCache should be 1(true)');
            expect(gpuOCStatusCache).toBe(3, 'gpuOCStatusCache should keep 3(false)');
        }));
        it('setPerformanceOC(cpu only)', fakeAsync(() => {
            component.gamingCapabilities.cpuOCFeature = true;
            component.gamingCapabilities.gpuOCFeature = false;
            component.renderOCSupported();
            expect(component.OCsupportted).toBe(2, 'OCsupported should be 2');
            setReturnValue = true;
            // set false to true
            component.OCSettings = false;
            cpuOCStatusCache = 3;
            gpuOCStatusCache = 3;
            performanceOCSetting = false;
            component.setPerformanceOCSetting(true);
            tick();
            expect(component.OCSettings).toBe(true, `setReturnValue is ${setReturnValue}, component.OCSettings should be true`);
            expect(cpuOCStatusCache).toBe(1, `setReturnValue is ${setReturnValue},cpuOCStatusCache should be 1(true)`);
            expect(gpuOCStatusCache).toBe(3, `setReturnValue is ${setReturnValue},gpuOCStatusCache should keep 3(false)`);
            // set true to false
            component.OCSettings = true;
            cpuOCStatusCache = 1;
            gpuOCStatusCache = 3;
            performanceOCSetting = true;
            component.setPerformanceOCSetting(false);
            tick();
            expect(component.OCSettings).toBe(false, `setReturnValue is ${setReturnValue}, component.OCSettings should be false`);
            expect(cpuOCStatusCache).toBe(3, `setReturnValue is ${setReturnValue},cpuOCStatusCache should be 3(false)`);
            expect(gpuOCStatusCache).toBe(3, `setReturnValue is ${setReturnValue},gpuOCStatusCache should keep 3(false)`);

            setReturnValue = false;
            // set true return false
            component.OCSettings = false;
            cpuOCStatusCache = 3;
            gpuOCStatusCache = 3;
            performanceOCSetting = false;
            component.setPerformanceOCSetting(true);
            tick();
            expect(component.OCSettings).toBe(false, `setReturnValue is ${setReturnValue}, component.OCSettings keep false`);
            expect(cpuOCStatusCache).toBe(3, `setReturnValue is ${setReturnValue},cpuOCStatusCache should keep 3(false)`);
            expect(gpuOCStatusCache).toBe(3, `setReturnValue is ${setReturnValue},gpuOCStatusCache should keep 3(false)`);
            // set false return false
            component.OCSettings = true;
            cpuOCStatusCache = 1;
            gpuOCStatusCache = 3;
            performanceOCSetting = true;
            component.setPerformanceOCSetting(false);
            tick();
            expect(component.OCSettings).toBe(true, `setReturnValue is ${setReturnValue}, component.OCSettings keep true`);
            expect(cpuOCStatusCache).toBe(1, `setReturnValue is ${setReturnValue},cpuOCStatusCache should keep 1(true)`);
            expect(gpuOCStatusCache).toBe(3, `setReturnValue is ${setReturnValue},gpuOCStatusCache should keep 3(false)`);
        }));
        it('ngOnInit gpu only', () => {
            component.gamingCapabilities.cpuOCFeature = false;
            component.gamingCapabilities.gpuOCFeature = true;
            cpuOCStatusCache = 3;
            gpuOCStatusCache = 3;
            component.OCSettings = true;
            component.ngOnInit();
            expect(component.OCSettings).toBe(false, 'gpuOCStatusCache is 3, componentOSSettings should be init to false');
            gpuOCStatusCache = 1;
            component.OCSettings = false;
            component.ngOnInit();
            expect(component.OCSettings).toBe(true, 'gpuOCStatusCache is 1, componentOSSettings should be init to true');
        })
        it('getPerformanceOC(gpu only)', fakeAsync(() => {
            component.gamingCapabilities.cpuOCFeature = false;
            component.gamingCapabilities.gpuOCFeature = true;
            component.renderOCSupported();
            expect(component.OCsupportted).toBe(1, 'OCsupported should be 1');
            performanceOCSetting = false;
            cpuOCStatusCache = 3;
            component.getPerformanceOCSetting();
            tick();
            expect(component.OCSettings).toBe(false, 'component.OCSettings should be false');
            expect(cpuOCStatusCache).toBe(3, 'cpuOCStatusCache should be 3(false)');
            expect(gpuOCStatusCache).toBe(3, 'gpuOCStatusCache should keep 3(false)');

            performanceOCSetting = true;
            component.getPerformanceOCSetting();
            tick();
            expect(component.OCSettings).toBe(true, 'component.OCSettings should be true');
            expect(cpuOCStatusCache).toBe(3, 'cpuOCStatusCache should be 3(false)');
            expect(gpuOCStatusCache).toBe(1, 'gpuOCStatusCache should keep 1(true)');
        }));
        it('setPerformanceOC(gpu only)', fakeAsync(() => {
            component.gamingCapabilities.cpuOCFeature = false;
            component.gamingCapabilities.gpuOCFeature = true;
            component.renderOCSupported();
            expect(component.OCsupportted).toBe(1, 'OCsupported should be 1');
            setReturnValue = true;
            // set false to true
            component.OCSettings = false;
            cpuOCStatusCache = 3;
            gpuOCStatusCache = 3;
            performanceOCSetting = false;
            component.setPerformanceOCSetting(true);
            tick();
            expect(component.OCSettings).toBe(true, `setReturnValue is ${setReturnValue}, component.OCSettings should be true`);
            expect(cpuOCStatusCache).toBe(3, `setReturnValue is ${setReturnValue},cpuOCStatusCache should keep 3(false)`);
            expect(gpuOCStatusCache).toBe(1, `setReturnValue is ${setReturnValue},gpuOCStatusCache should be 1(true)`);
            // set true to false
            component.OCSettings = true;
            cpuOCStatusCache = 3;
            gpuOCStatusCache = 1;
            performanceOCSetting = true;
            component.setPerformanceOCSetting(false);
            tick();
            expect(component.OCSettings).toBe(false, `setReturnValue is ${setReturnValue}, component.OCSettings should be false`);
            expect(cpuOCStatusCache).toBe(3, `setReturnValue is ${setReturnValue},cpuOCStatusCache should keep 3(false)`);
            expect(gpuOCStatusCache).toBe(3, `setReturnValue is ${setReturnValue},gpuOCStatusCache should be 3(false)`);

            setReturnValue = false;
            // set true return false
            component.OCSettings = false;
            cpuOCStatusCache = 3;
            gpuOCStatusCache = 3;
            performanceOCSetting = false;
            component.setPerformanceOCSetting(true);
            tick();
            expect(component.OCSettings).toBe(false, `setReturnValue is ${setReturnValue}, component.OCSettings keep false`);
            expect(cpuOCStatusCache).toBe(3, `setReturnValue is ${setReturnValue},cpuOCStatusCache should keep 3(false)`);
            expect(gpuOCStatusCache).toBe(3, `setReturnValue is ${setReturnValue},gpuOCStatusCache should keep 3(false)`);
            // set false return false
            component.OCSettings = true;
            cpuOCStatusCache = 3;
            gpuOCStatusCache = 1;
            performanceOCSetting = true;
            component.setPerformanceOCSetting(false);
            tick();
            expect(component.OCSettings).toBe(true, `setReturnValue is ${setReturnValue}, component.OCSettings keep true`);
            expect(cpuOCStatusCache).toBe(3, `setReturnValue is ${setReturnValue},cpuOCStatusCache should keep 3(false)`);
            expect(gpuOCStatusCache).toBe(1, `setReturnValue is ${setReturnValue},gpuOCStatusCache should keep 1(true)`);
        }));
        it('not OC supported', () => {
            component.gamingCapabilities.cpuOCFeature = false;
            component.gamingCapabilities.gpuOCFeature = false;
            component.OCSettings = false;
            component.ngOnInit();
            expect(component.OCsupportted).toBe(0, 'component OCsupported should keep 0');
            expect(component.OCSettings).toBe(false, 'component OSSettings should keep false');
        });
        it('driver lack', () => {
            component.gamingCapabilities.xtuService = true;
            component.gamingCapabilities.nvDriver = true;
            component.driverStatus = 0;
            component.renderOCSupported();
            expect(component.driverStatus).toBe(3, `xtuService is ${component.gamingCapabilities.xtuService}, nvDriver is ${component.gamingCapabilities.nvDriver}，component.driverStatus should be 3`);
            component.gamingCapabilities.xtuService = true;
            component.gamingCapabilities.nvDriver = false;
            component.driverStatus = 0;
            component.renderOCSupported();
            expect(component.driverStatus).toBe(2, `xtuService is ${component.gamingCapabilities.xtuService}, nvDriver is ${component.gamingCapabilities.nvDriver}，component.driverStatus should be 2`);
            component.gamingCapabilities.xtuService = false;
            component.gamingCapabilities.nvDriver = true;
            component.driverStatus = 0;
            component.renderOCSupported();
            expect(component.driverStatus).toBe(1, `xtuService is ${component.gamingCapabilities.xtuService}, nvDriver is ${component.gamingCapabilities.nvDriver}，component.driverStatus should be 1`);
            component.gamingCapabilities.xtuService = false;
            component.gamingCapabilities.nvDriver = false;
            component.driverStatus = 0;
            component.renderOCSupported();
            expect(component.driverStatus).toBe(0, `xtuService is ${component.gamingCapabilities.xtuService}, nvDriver is ${component.gamingCapabilities.nvDriver}，component.driverStatus keep 0`);
        })
    })
    describe('catch error', () => {
        let thermalModeService: any;
        let gamingOCService: any;
        beforeEach(async(() => {
            let gamingThermalModeServiceSpy = jasmine.createSpyObj('GamingThermalModeService', ['getThermalModeSettingStatus', 'setThermalModeSettingStatus', 'getAutoSwitchStatus', 'setAutoSwitchStatus', 'regThermalModeChangeEvent']);
            let gamingOCServiceSpy = jasmine.createSpyObj('GamingOCService', ['getPerformanceOCSetting', 'setPerformanceOCSetting']);
            TestBed.configureTestingModule({
                declarations: [
                    ModalGamingThermalMode2Component,
                    ModalGamingPromptStubComponent,
                    SvgInlinePipe
                ],
                imports: [
                    TranslationModule,
                    HttpClientModule,
                ],
                providers: [
                    NgbModal,
                    NgbActiveModal,
                    TranslateStore,
                    { provide: CommonService, useValue: commonServiceMock },
                    { provide: GamingAllCapabilitiesService, useValue: GamingAllCapabilitiesServiceMock },
                    { provide: GamingThermalModeService, useValue: gamingThermalModeServiceSpy },
                    { provide: GamingOCService, useValue: gamingOCServiceSpy }
                ],
                schemas: [
                    NO_ERRORS_SCHEMA
                ]
            });
            thermalModeService = TestBed.inject(GamingThermalModeService);
            gamingOCService = TestBed.inject(GamingOCService);
            fixture = TestBed.createComponent(ModalGamingThermalMode2Component);
            component = fixture.componentInstance;
        }));
        it('should create', async(() => {
            thermalModeService.getThermalModeSettingStatus.and.returnValue(Promise.resolve(2));
            thermalModeService.getAutoSwitchStatus.and.returnValue(Promise.resolve(false));
            gamingOCService.getPerformanceOCSetting.and.returnValue(Promise.resolve(false));
            fixture.detectChanges();
            expect(component).toBeDefined();
        }));
        it('getThermalModeSettingStatus catch error', () => {
            try {
                thermalModeService.getThermalModeSettingStatus.and.throwError('getThermalModeSettingStatus error');
                thermalModeService.getAutoSwitchStatus.and.returnValue(Promise.resolve(false));
                gamingOCService.getPerformanceOCSetting.and.returnValue(Promise.resolve(false));
                fixture.detectChanges();
                component.getThermalModeSettingStatus();
            } catch(err) {
                expect(err).toMatch('getThermalModeSettingStatus error');
            }
        });
        it('setThermalModeSettingStatus catch error', () => {
            try {
                thermalModeService.getThermalModeSettingStatus.and.returnValue(Promise.resolve(2));
                thermalModeService.getAutoSwitchStatus.and.returnValue(Promise.resolve(false));
                gamingOCService.getPerformanceOCSetting.and.returnValue(Promise.resolve(false));
                thermalModeService.setThermalModeSettingStatus.and.throwError('setThermalModeSettingStatus error');
                fixture.detectChanges();
                component.setThermalModeSettingStatus(1);
            } catch(err) {
                expect(err).toMatch('setThermalModeSettingStatus error');
            }
            try {
                thermalModeService.getThermalModeSettingStatus.and.returnValue(Promise.resolve(2));
                thermalModeService.getAutoSwitchStatus.and.returnValue(Promise.resolve(false));
                thermalModeService.setThermalModeSettingStatus.and.throwError('setThermalModeSettingStatus error');
                fixture.detectChanges();
                component.setThermalModeSettingStatus(2);
            } catch(err) {
                expect(err).toMatch('setThermalModeSettingStatus error');
            }
            try {
                thermalModeService.getThermalModeSettingStatus.and.returnValue(Promise.resolve(2));
                thermalModeService.getAutoSwitchStatus.and.returnValue(Promise.resolve(false));
                thermalModeService.setThermalModeSettingStatus.and.throwError('setThermalModeSettingStatus error');
                fixture.detectChanges();
                component.setThermalModeSettingStatus(3);
            } catch(err) {
                expect(err).toMatch('setThermalModeSettingStatus error');
            }
        });
        it('getAutoSwitchStatus catch error', () => {
            try {
                thermalModeService.getThermalModeSettingStatus.and.returnValue(Promise.resolve(2));
                thermalModeService.getAutoSwitchStatus.and.throwError('getAutoSwitchStatus error');
                gamingOCService.getPerformanceOCSetting.and.returnValue(Promise.resolve(false));
                fixture.detectChanges();
                component.getAutoSwitchStatus();
            } catch(err) {
                expect(err).toMatch('getAutoSwitchStatus error');
            }
        });
        it('setAutoSwitchStatus catch error', () => {
            try {
                thermalModeService.getThermalModeSettingStatus.and.returnValue(Promise.resolve(2));
                thermalModeService.getAutoSwitchStatus.and.returnValue(Promise.resolve(false));
                gamingOCService.getPerformanceOCSetting.and.returnValue(Promise.resolve(false));
                thermalModeService.setAutoSwitchStatus.and.throwError('setAutoSwitchStatus error');
                fixture.detectChanges();
                component.setAutoSwitchStatus(true);
            } catch(err) {
                expect(err).toMatch('setAutoSwitchStatus error');
            }
            try {
                thermalModeService.getThermalModeSettingStatus.and.returnValue(Promise.resolve(2));
                thermalModeService.getAutoSwitchStatus.and.returnValue(Promise.resolve(false));
                thermalModeService.setAutoSwitchStatus.and.throwError('setAutoSwitchStatus error');
                fixture.detectChanges();
                component.setAutoSwitchStatus(false);
            } catch(err) {
                expect(err).toMatch('setAutoSwitchStatus error');
            }
        });
        it('registerThermalModeChangeEvent catch error', () => {
            try {
                thermalModeService.getThermalModeSettingStatus.and.returnValue(Promise.resolve(2));
                thermalModeService.getAutoSwitchStatus.and.returnValue(Promise.resolve(false));
                gamingOCService.getPerformanceOCSetting.and.returnValue(Promise.resolve(false));
                thermalModeService.regThermalModeChangeEvent.and.throwError('regThermalModeChangeEvent error');
                fixture.detectChanges();
                component.registerThermalModeChangeEvent();
            } catch(err) {
                expect(err).toMatch('regThermalModeChangeEvent error');
            }
        });
        it('getPerformanceOCSetting catch error', () => {
            try {
                thermalModeService.getThermalModeSettingStatus.and.returnValue(Promise.resolve(2));
                thermalModeService.getAutoSwitchStatus.and.returnValue(Promise.resolve(false));
                gamingOCService.getPerformanceOCSetting.and.throwError('getPerformanceOCSetting error');
                fixture.detectChanges();
                component.getPerformanceOCSetting();
            } catch(err) {
                expect(err).toMatch('getPerformanceOCSetting error');
            }
        });
        it('setPerformanceOCSetting catch error (cpu&gpu)', () => {
            try {
                thermalModeService.getThermalModeSettingStatus.and.returnValue(Promise.resolve(2));
                thermalModeService.getAutoSwitchStatus.and.returnValue(Promise.resolve(false));
                gamingOCService.getPerformanceOCSetting.and.returnValue(Promise.resolve(false));
                gamingOCService.setPerformanceOCSetting.and.throwError('setPerformanceOCSetting error');
                component.OCSettings = false;
                cpuOCStatusCache = 3;
                gpuOCStatusCache = 3;
                fixture.detectChanges();
                component.setPerformanceOCSetting(true);
            } catch(err) {
                expect(err).toMatch('setPerformanceOCSetting error');
                expect(component.OCSettings).toBe(false, 'component.OCSettings should keep false');
                expect(cpuOCStatusCache).toBe(3, 'cpuOCStatusCache should keep 3(false)');
                expect(gpuOCStatusCache).toBe(3, 'gpuOCStatusCache should keep 3(false)');
            }
            try {
                thermalModeService.getThermalModeSettingStatus.and.returnValue(Promise.resolve(2));
                thermalModeService.getAutoSwitchStatus.and.returnValue(Promise.resolve(false));
                gamingOCService.getPerformanceOCSetting.and.returnValue(Promise.resolve(false));
                gamingOCService.setPerformanceOCSetting.and.throwError('setPerformanceOCSetting error');
                component.OCSettings = true;
                cpuOCStatusCache = 1;
                gpuOCStatusCache = 1;
                fixture.detectChanges();
                component.setPerformanceOCSetting(false);
            } catch(err) {
                expect(err).toMatch('setPerformanceOCSetting error');
                expect(component.OCSettings).toBe(true, 'component.OCSettings should keep true');
                expect(cpuOCStatusCache).toBe(1, 'cpuOCStatusCache should keep 1(true)');
                expect(gpuOCStatusCache).toBe(1, 'gpuOCStatusCache should keep 1(true)');
            }
        });
        it('setPerformanceOCSetting catch error (cpu)', () => {
            try {
                component.gamingCapabilities.cpuOCFeature = true;
                component.gamingCapabilities.gpuOCFeature = false
                thermalModeService.getThermalModeSettingStatus.and.returnValue(Promise.resolve(2));
                thermalModeService.getAutoSwitchStatus.and.returnValue(Promise.resolve(false));
                gamingOCService.getPerformanceOCSetting.and.returnValue(Promise.resolve(false));
                gamingOCService.setPerformanceOCSetting.and.throwError('setPerformanceOCSetting error');
                component.OCSettings = false;
                cpuOCStatusCache = 3;
                gpuOCStatusCache = 3;
                fixture.detectChanges();
                component.setPerformanceOCSetting(true);
            } catch(err) {
                expect(err).toMatch('setPerformanceOCSetting error');
                expect(component.OCSettings).toBe(false, 'component.OCSettings should keep false');
                expect(cpuOCStatusCache).toBe(3, 'cpuOCStatusCache should keep 3(false)');
                expect(gpuOCStatusCache).toBe(3, 'gpuOCStatusCache should keep 3(false)');
            }
            try {
                thermalModeService.getThermalModeSettingStatus.and.returnValue(Promise.resolve(2));
                thermalModeService.getAutoSwitchStatus.and.returnValue(Promise.resolve(false));
                gamingOCService.getPerformanceOCSetting.and.returnValue(Promise.resolve(false));
                gamingOCService.setPerformanceOCSetting.and.throwError('setPerformanceOCSetting error');
                component.OCSettings = true;
                cpuOCStatusCache = 1;
                gpuOCStatusCache = 3;
                fixture.detectChanges();
                component.setPerformanceOCSetting(false);
            } catch(err) {
                expect(err).toMatch('setPerformanceOCSetting error');
                expect(component.OCSettings).toBe(true, 'component.OCSettings should keep true');
                expect(cpuOCStatusCache).toBe(1, 'cpuOCStatusCache should keep 1(true)');
                expect(gpuOCStatusCache).toBe(3, 'gpuOCStatusCache should keep 3(false)');
            }
        });
        it('setPerformanceOCSetting catch error (gpu)', () => {
            try {
                component.gamingCapabilities.cpuOCFeature = false;
                component.gamingCapabilities.gpuOCFeature = true
                thermalModeService.getThermalModeSettingStatus.and.returnValue(Promise.resolve(2));
                thermalModeService.getAutoSwitchStatus.and.returnValue(Promise.resolve(false));
                gamingOCService.getPerformanceOCSetting.and.returnValue(Promise.resolve(false));
                gamingOCService.setPerformanceOCSetting.and.throwError('setPerformanceOCSetting error');
                component.OCSettings = false;
                cpuOCStatusCache = 3;
                gpuOCStatusCache = 3;
                fixture.detectChanges();
                component.setPerformanceOCSetting(true);
            } catch(err) {
                expect(err).toMatch('setPerformanceOCSetting error');
                expect(component.OCSettings).toBe(false, 'component.OCSettings should keep false');
                expect(cpuOCStatusCache).toBe(3, 'cpuOCStatusCache should keep 3(false)');
                expect(gpuOCStatusCache).toBe(3, 'gpuOCStatusCache should keep 3(false)');
            }
            try {
                thermalModeService.getThermalModeSettingStatus.and.returnValue(Promise.resolve(2));
                thermalModeService.getAutoSwitchStatus.and.returnValue(Promise.resolve(false));
                gamingOCService.getPerformanceOCSetting.and.returnValue(Promise.resolve(false));
                gamingOCService.setPerformanceOCSetting.and.throwError('setPerformanceOCSetting error');
                component.OCSettings = true;
                cpuOCStatusCache = 3;
                gpuOCStatusCache = 1;
                fixture.detectChanges();
                component.setPerformanceOCSetting(false);
            } catch(err) {
                expect(err).toMatch('setPerformanceOCSetting error');
                expect(component.OCSettings).toBe(true, 'component.OCSettings should keep true');
                expect(cpuOCStatusCache).toBe(3, 'cpuOCStatusCache should keep 3(false)');
                expect(gpuOCStatusCache).toBe(1, 'gpuOCStatusCache should keep 1(true)');
            }
        });
    })
    describe('about modal', () => {
        let activeModalService: any;
        let modalService: any;
        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [
                    ModalGamingThermalMode2Component,
                    ModalGamingPromptStubComponent,
                    SvgInlinePipe
                ],
                imports: [
                    TranslationModule,
                    HttpClientModule,
                ],
                providers: [
                    NgbModal,
                    NgbActiveModal,
                    TranslateStore,
                    { provide: CommonService, useValue: commonServiceMock },
                    { provide: GamingAllCapabilitiesService, useValue: GamingAllCapabilitiesServiceMock },
                    { provide: GamingThermalModeService, useValue: gamingThermalModeServiceMock },
                    { provide: GamingOCService, useValue: gamingOCServiceMock }
                ],
                schemas: [
                    NO_ERRORS_SCHEMA
                ]
            });
            activeModalService = TestBed.inject(NgbActiveModal);
            modalService = TestBed.inject(NgbModal);
            fixture = TestBed.createComponent(ModalGamingThermalMode2Component);
            component = fixture.componentInstance;
            fixture.detectChanges();
        }));
        it('should create', () => {
            expect(component).toBeDefined();
        });
        it('closeThermalMode2Modal', () => {
            spyOn(activeModalService, 'close').and.callThrough();
            expect(activeModalService.close).toHaveBeenCalledTimes(0);
            component.closeThermalMode2Modal();
            expect(activeModalService.close).toHaveBeenCalledTimes(1);
        })
        it('openWaringModal & openAdvanceOCModal', () => {
            let modalRef = new ModalGamingPromptStubComponent();
            spyOn(modalService, 'open').and.returnValue(modalRef);
            expect(modalService.open).toHaveBeenCalledTimes(0);
            component.openWaringModal();
            expect(modalService.open).toHaveBeenCalledTimes(2);
            modalRef.componentInstance.emitService = of(0)
            component.openWaringModal();
            expect(modalService.open).toHaveBeenCalledTimes(3);
        })
    })
});
