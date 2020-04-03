import { TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { GamingOCService } from './gaming-oc.service';
import { VantageShellService } from '../../vantage-shell/vantage-shell.service';
import { LoggerService } from '../../logger/logger.service';

describe('GamingOCService', () => {
    let shellService: VantageShellService;
    let gamingOCService: GamingOCService;
    describe('isShellAvailable is false', () => {
        beforeEach(() => {
            let spy = jasmine.createSpyObj('VantageService', ['getGamingThermalMode', 'getLogger']);
            spy.getGamingThermalMode.and.returnValue(undefined);
            TestBed.configureTestingModule({
                imports: [
                    HttpClientModule
                ],
                providers: [
                    GamingOCService,
                    LoggerService,
                    { provide: VantageShellService, useValue: spy }
                ]
            });
            gamingOCService = TestBed.inject(GamingOCService);
            shellService = TestBed.get(VantageShellService);

        })
        it('inject gamingOCService & shellService', () => {
            expect(gamingOCService).toBeTruthy('can not inject gamingOCService');
            expect(shellService).toBeTruthy('can not inject shellService');
        })
        it('shellService.getThermalModeService() should return undefined', () => {
            expect(shellService.getGamingThermalMode()).toBeUndefined();
        })
        it('isShellAvailable is false', () => {
            expect(gamingOCService.isShellAvailable).toBe(false);
        })
        it('get performanceOCSetting should return undefined', () => {
            expect(gamingOCService.getPerformanceOCSetting()).toBeUndefined();
        })
        it('set performanceOCSetting should return undefined', () => {
            expect(gamingOCService.setPerformanceOCSetting(true)).toBeUndefined();
            expect(gamingOCService.setPerformanceOCSetting(false)).toBeUndefined();
        })
    })
    describe('isShellAvailable is true', () => {
        let performanceOCSetting = false;
        let setReturnValue = false;
        beforeEach(() => {
            let spy = jasmine.createSpyObj('VantageService', ['getGamingThermalMode', 'getLogger']);
            let stubValue = {
                getPerformanceOCSetting() {
                    return new Promise( resolve => {
                        resolve(performanceOCSetting);
                    })
                },
                setPerformanceOCSetting(value: boolean) {
                    return new Promise( resolve => {
                        if(setReturnValue) {
                            performanceOCSetting = value;
                        }
                        resolve(setReturnValue);
                    })
                }
            };
            spy.getGamingThermalMode.and.returnValue(stubValue);
            TestBed.configureTestingModule({
                imports: [
                    HttpClientModule
                ],
                providers: [
                    GamingOCService,
                    LoggerService,
                    { provide: VantageShellService, useValue: spy }
                ]
            });
            gamingOCService = TestBed.inject(GamingOCService);
            shellService = TestBed.get(VantageShellService);

        })
        it('inject gamingOCService & shellService', () => {
            expect(gamingOCService).toBeTruthy('can not inject gamingOCService');
            expect(shellService).toBeTruthy('can not inject shellService');
        })
        it('isShellAvailable is true', () => {
            expect(gamingOCService.isShellAvailable).toBe(true);
        })
        it('get performanceOCSetting should return boolean value', async(() => {
            performanceOCSetting = true;
            gamingOCService.getPerformanceOCSetting().then( res => {
                expect(res).toBe(true, 'getPerformanceOCSetting should return true');
            });
            performanceOCSetting = false;
            gamingOCService.getPerformanceOCSetting().then( res => {
                expect(res).toBe(false, 'getPerformanceOCSetting should return false');
            });
        }))
        it('set performanceOCSetting should return boolean value', fakeAsync(() => {
            setReturnValue = true;
            performanceOCSetting = false;
            gamingOCService.setPerformanceOCSetting(true).then( res => {
                expect(res).toBe(true, 'setReturnValue should be true');
                expect(performanceOCSetting).toBe(true, `setReturnValue is ${setReturnValue}, set performanceOCSetting to be true FAIL`);
            });
            tick();
            performanceOCSetting = true;
            gamingOCService.setPerformanceOCSetting(false).then( res => {
                expect(res).toBe(true, 'setReturnValue should be true');
                expect(performanceOCSetting).toBe(false, `setReturnValue is ${setReturnValue}, set performanceOCSetting to be false FAIL`);
            });
            tick();
            setReturnValue = false;
            performanceOCSetting = false;
            gamingOCService.setPerformanceOCSetting(true).then( res => {
                expect(res).toBe(false, 'setReturnValue should be false');
                expect(performanceOCSetting).toBe(false, `setReturnValue is ${setReturnValue}, performanceOCSetting should keep false`);
            });
            tick();
            performanceOCSetting = true;
            gamingOCService.setPerformanceOCSetting(false).then( res => {
                expect(res).toBe(false, 'setReturnValue should be false');
                expect(performanceOCSetting).toBe(true, `setReturnValue is ${setReturnValue}, performanceOCSetting should keep true`);
            });
        }))
    })
    describe('catch error', () => {
        beforeEach(() => {
            let spy = jasmine.createSpyObj('VantageService', ['getGamingThermalMode', 'getLogger']);
            let stubValue = {
                getPerformanceOCSetting() {
                    throw new Error('getPerformanceOCSetting error')
                },
                setPerformanceOCSetting(value: boolean) {
                    throw new Error('setPerformanceOCSetting error')
                }
            };
            spy.getGamingThermalMode.and.returnValue(stubValue);
            TestBed.configureTestingModule({
                imports: [
                    HttpClientModule
                ],
                providers: [
                    GamingOCService,
                    LoggerService,
                    { provide: VantageShellService, useValue: spy }
                ]
            });
            gamingOCService = TestBed.inject(GamingOCService);
            shellService = TestBed.get(VantageShellService);

        })
        it('inject gamingOCService & shellService', () => {
            expect(gamingOCService).toBeTruthy('can not inject gamingOCService');
            expect(shellService).toBeTruthy('can not inject shellService');
        })
        it('isShellAvailable is true', () => {
            expect(gamingOCService.isShellAvailable).toBe(true);
        })
        it('get performanceOCSetting should return err', async(() => {
            try {
                gamingOCService.getPerformanceOCSetting();
            } catch (err) {
                expect(err).toMatch('getPerformanceOCSetting error');
            }
        }))
        it('set performanceOCSetting should return err', fakeAsync(() => {
            try {
                gamingOCService.setPerformanceOCSetting(true);
            } catch (err) {
                expect(err).toMatch('setPerformanceOCSetting error');
            }
            try {
                gamingOCService.setPerformanceOCSetting(false);
            } catch (err) {
                expect(err).toMatch('setPerformanceOCSetting error');
            }
        }))
    })
});
