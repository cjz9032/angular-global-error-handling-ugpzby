import { TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { GamingThermalModeService } from './gaming-thermal-mode.service';
import { HttpClientModule } from '@angular/common/http';
import { VantageShellService } from '../../vantage-shell/vantage-shell.service';
import { LoggerService } from '../../logger/logger.service';
import { throwError } from 'rxjs';
// use spy replace with mock-service
// import { VantageShellService } from '../../vantage-shell/vantage-shell-mock.service';

describe('GamingThermalModeService', () => {
    let shellService: VantageShellService;
    let gamingThermalModeService: GamingThermalModeService;
    describe('isShellAvailable is false', () => {
        beforeEach( () => {
            const spy = jasmine.createSpyObj('VantageService', ['getGamingThermalMode', 'getLogger']);
            spy.getGamingThermalMode.and.returnValue(undefined);
            TestBed.configureTestingModule({
                imports: [
                    HttpClientModule
                ],
                providers: [
                    GamingThermalModeService,
                    LoggerService,
                    { provide: VantageShellService, useValue: spy}
                ]
            });
            gamingThermalModeService = TestBed.inject(GamingThermalModeService);
            shellService = TestBed.inject(VantageShellService);
        })
        it('inject gamingThermalModeService & shellService', () => {
            expect(gamingThermalModeService).toBeTruthy('can not inject gamingThermalModeService');
            expect(shellService).toBeTruthy('can not inject spy')
        })
        it('shellService.getGamingThermalMode() should return undefined', () => {
            expect(shellService.getGamingThermalMode()).toBeUndefined();
        })
        it('isShellAvailable is false', () => {
            expect(gamingThermalModeService.isShellAvailable).toBe(false);
        })
        it('getThermalModeSettingStatus should return undefined', () => {
            expect(gamingThermalModeService.getThermalModeSettingStatus()).toBeUndefined();
        })
        it('setThermalModeSettingStatus should return undefined', () => {
            expect(gamingThermalModeService.setThermalModeSettingStatus(3)).toBeUndefined();
            expect(gamingThermalModeService.setThermalModeSettingStatus(2)).toBeUndefined();
            expect(gamingThermalModeService.setThermalModeSettingStatus(1)).toBeUndefined();
        })
        it('regThermalModeChangeEvent should return undefined', () => {
            expect(gamingThermalModeService.regThermalModeChangeEvent()).toBeUndefined();
        })
        // thermal mode 2
        it('getThermalModeRealStatus should return undefined', () => {
            expect(gamingThermalModeService.getThermalModeRealStatus()).toBeUndefined();
        })
        it('getAutoSwitchStatus should return undefined', () => {
            expect(gamingThermalModeService.getAutoSwitchStatus()).toBeUndefined();
        })
        it('setAutoSwitchStatus should return undefined', () => {
            expect(gamingThermalModeService.setAutoSwitchStatus(true)).toBeUndefined();
            expect(gamingThermalModeService.setAutoSwitchStatus(false)).toBeUndefined();
        })
        it('regThermalModeRealStatusChangeEvent should return undefined', () => {
            expect(gamingThermalModeService.regThermalModeRealStatusChangeEvent()).toBeUndefined();
        })
    })
    describe('isShellAvailable is true', () => {
        let thermalModeStatus = 2;
        let autoSwitchStatus = false;
        let setReturnValue = true;
        beforeEach(() => {
            let spy = jasmine.createSpyObj('VantageService', ['getGamingThermalMode', 'getLogger']);
            let stubValue =  {
                getThermalModeStatus() {
                    return new Promise( (resolve, reject) => {
                        if( thermalModeStatus !== 0) {
                            resolve(thermalModeStatus);
                        }
                        reject('getThermalModeStatus error');
                    });
                },
                setThermalModeStatus(value: any) {
                    return new Promise( (resolve, reject) => {
                        if(setReturnValue) {
                            thermalModeStatus = value;
                            resolve(setReturnValue);
                        } else {
                            resolve(setReturnValue);
                        }
                        reject('setThermalModeStatus error');
                    });
                },
                regThermalModeEvent() {
                    return new Promise( (resolve, reject) => {
                        resolve(setReturnValue);
                        reject('regThermalModeEvent error');
                    });
                },
                getThermalModeRealStatus() {
                    return new Promise( (resolve, reject) => {
                        if( thermalModeStatus !== 0) {
                            resolve(thermalModeStatus);
                        }
                        reject('getThermalModeRealStatus error');
                    });
                },
                getAutoSwitchStatus() {
                    return new Promise( (resolve, reject) => {
                        resolve(autoSwitchStatus);
                        reject('getAutoSwitchStatus error');
                    });
                },
                setAutoSwitchStatus(value: boolean) {
                    return new Promise( (resolve, reject) => {
                        if(setReturnValue) {
                            autoSwitchStatus = value;
                            resolve(setReturnValue);
                        } else {
                            resolve(setReturnValue);
                        }
                        reject('setThermalModeStatus error');
                    });
                },
                regThermalModeRealStatusEvent() {
                    return new Promise( (resolve, reject) => {
                        resolve(setReturnValue);
                        reject('regThermalModeRealStatusEvent error');
                    });
                },
            };
            spy.getGamingThermalMode.and.returnValue(stubValue);
            TestBed.configureTestingModule({
                imports: [
                    HttpClientModule
                ],
                providers: [
                    GamingThermalModeService, 
                    LoggerService,
                    { provide: VantageShellService, useValue: spy},
                ],
            });
            gamingThermalModeService = TestBed.inject(GamingThermalModeService);
            shellService = TestBed.inject(VantageShellService);
        });
        it('inject gamingThermalModeService & shellService', () => {
            expect(gamingThermalModeService).toBeTruthy('can not inject gamingThermalModeService');
            expect(shellService).toBeTruthy('can not inject spy');
        })
        it('isShellAvailable is true', () => {
            expect(gamingThermalModeService.isShellAvailable).toBe(true);
        })
        it('getThermalModeSettingStatus should return value', async(() => {
            thermalModeStatus = 1;
            gamingThermalModeService.getThermalModeSettingStatus().then( res =>{
                expect(res).toBe(1, 'get thermal mode status should be 1');
            });
            thermalModeStatus = 2;
            gamingThermalModeService.getThermalModeSettingStatus().then( res =>{
                expect(res).toBe(2, 'get thermal mode status should be 2');
            });
            thermalModeStatus = 3;
            gamingThermalModeService.getThermalModeSettingStatus().then( res =>{
                expect(res).toBe(3, 'get thermal mode status should be 3');
            });
        }))
        it('setThermalModeSettingStatus should return boolean value', fakeAsync(() => {
            setReturnValue = true;
            for( let i = 1; i<4; i++){
                tick();
                gamingThermalModeService.setThermalModeSettingStatus(i).then( res => {
                    expect(res).toBe(true, 'setReturnValue should be true');
                    expect(thermalModeStatus).toBe(i, `setReturnValue is ${setReturnValue}, set thermal mode status to be ${i} FAIL!`);
                });
            }
            tick();
            setReturnValue = false;
            for(let i = 1; i<4; i++) {
                tick();
                thermalModeStatus = i;
                for( let j = 1; j<4; j++){
                    tick();
                    gamingThermalModeService.setThermalModeSettingStatus(j).then( res => {
                        expect(res).toBe(false, 'setReturnValue should be false');
                        expect(thermalModeStatus).toBe(i, `setReturnValue is ${setReturnValue}, thermal mode status should keep ${i}`);
                    });
                }
            }
            // gamingThermalModeService.setThermalModeSettingStatus(1).then( res => {
            //     expect(res).toBe(true);
            //     expect(thermalModeStatus).toBe(1);
            // });
            // tick();
            // gamingThermalModeService.setThermalModeSettingStatus(2).then( res => {
            //     expect(res).toBe(true);
            //     expect(thermalModeStatus).toBe(2);
            // });
            // tick();
            // gamingThermalModeService.setThermalModeSettingStatus(3).then( res => {
            //     expect(res).toBe(true);
            //     expect(thermalModeStatus).toBe(3);
            // });
        }))
        it('regThermalModeChangeEvent should return boolean value', async(() => {
            setReturnValue = false;
            gamingThermalModeService.regThermalModeChangeEvent().then( res => {
                expect(res).toBe(false, 'regThermalModeChangeEvent shoule return false');
            });
            setReturnValue = true;
            gamingThermalModeService.regThermalModeChangeEvent().then( res => {
                expect(res).toBe(true, 'regThermalModeChangeEvent shoule return true');
            })

        }))
        // thermal mode 2
        it('getThermalModeRealStatus should return value', async(() => {
            thermalModeStatus = 1;
            gamingThermalModeService.getThermalModeRealStatus().then( res => {
                expect(res).toBe(1, 'getThermalModeRealStatus shoule be 1');
            });
            thermalModeStatus = 2;
            gamingThermalModeService.getThermalModeRealStatus().then( res => {
                expect(res).toBe(2, 'getThermalModeRealStatus shoule be 2');
            });
            thermalModeStatus = 3;
            gamingThermalModeService.getThermalModeRealStatus().then( res => {
                expect(res).toBe(3, 'getThermalModeRealStatus shoule be 3');
            });
        }))
        it('getAutoSwitchStatus should return boolean value', async(() => {
            autoSwitchStatus = true;
            gamingThermalModeService.getAutoSwitchStatus().then( res => {
                expect(res).toBe(true, 'getAutoSwitchStatus should be true');
            });
            autoSwitchStatus = false;
            gamingThermalModeService.getAutoSwitchStatus().then( res => {
                expect(res).toBe(false, 'getAutoSwitchStatus should be false');
            });
        }))
        it('setAutoSwitchStatus should return undefined', fakeAsync(() => {
            setReturnValue = true;
            gamingThermalModeService.setAutoSwitchStatus(true).then( res => {
                expect(res).toBe(true, `setReturnValue is ${setReturnValue}, setAutoSwitchStatus should return true`);
                expect(autoSwitchStatus).toBe(true, `setReturnValue is ${setReturnValue}, autoSwitchStatus should be true`);
            });
            tick();
            gamingThermalModeService.setAutoSwitchStatus(false).then( res => {
                expect(res).toBe(true, `setReturnValue is ${setReturnValue}, setAutoSwitchStatus should return true`);
                expect(autoSwitchStatus).toBe(false, `setReturnValue is ${setReturnValue}, autoSwitchStatus should be false`);
            });
            tick();
            setReturnValue = false;
            autoSwitchStatus = false;
            gamingThermalModeService.setAutoSwitchStatus(true).then( res => {
                expect(res).toBe(false, `setReturnValue is ${setReturnValue}, setAutoSwitchStatus should return false`);
                expect(autoSwitchStatus).toBe(false, `setReturnValue is ${setReturnValue}, autoSwitchStatus should be false`);
            });
            tick();
            autoSwitchStatus = true;
            gamingThermalModeService.setAutoSwitchStatus(false).then( res => {
                expect(res).toBe(false, `setReturnValue is ${setReturnValue}, setAutoSwitchStatus should return false`);
                expect(autoSwitchStatus).toBe(true, `setReturnValue is ${setReturnValue}, autoSwitchStatus should be true`);
            });
        }))
        it('regThermalModeRealStatusChangeEvent should return undefined', async(() => {
            setReturnValue = true;
            gamingThermalModeService.regThermalModeRealStatusChangeEvent().then( res => {
                expect(res).toBe(true, 'regThermalModeRealStatusChangeEvent should return true');
            });
            setReturnValue = false;
            gamingThermalModeService.regThermalModeRealStatusChangeEvent().then( res => {
                expect(res).toBe(false, 'regThermalModeRealStatusChangeEvent should return false');
            })
        }))
    })
    describe('catch error', () => {
        beforeEach(() => {
            let spy = jasmine.createSpyObj('VantageService', ['getGamingThermalMode', 'getLogger']);
            let stubValue =  {
                getThermalModeStatus() {
                    throw new Error('getThermalModeStatus error');
                },
                setThermalModeStatus(value: any) {
                    throw new Error('setThermalModeStatus error');
                },
                regThermalModeEvent() {
                    throw new Error('regThermalModeEvent error');
                },
                getThermalModeRealStatus() {
                    throw new Error('getThermalModeRealStatus error');
                },
                getAutoSwitchStatus() {
                    throw new Error('getAutoSwitchStatus error');
                },
                setAutoSwitchStatus(value: boolean) {
                    throw new Error('setAutoSwitchStatus error');
                },
                regThermalModeRealStatusEvent() {
                    throw new Error('regThermalModeRealStatusEvent error');
                },
            };
            spy.getGamingThermalMode.and.returnValue(stubValue);
            TestBed.configureTestingModule({
                imports: [
                    HttpClientModule
                ],
                providers: [
                    GamingThermalModeService, 
                    LoggerService,
                    { provide: VantageShellService, useValue: spy},
                ],
            });
            gamingThermalModeService = TestBed.inject(GamingThermalModeService);
            shellService = TestBed.inject(VantageShellService);
        });
        it('inject gamingThermalModeService & shellService', () => {
            expect(gamingThermalModeService).toBeTruthy('can not inject gamingThermalModeService');
            expect(shellService).toBeTruthy('can not inject spy');
        })
        it('isShellAvailable is true', () => {
            expect(gamingThermalModeService.isShellAvailable).toBe(true);
        })
        it('getThermalModeSettingStatus should return err', async(() => {
            try {
                gamingThermalModeService.getThermalModeSettingStatus();
            } catch(err) {
                expect(err).toMatch('getThermalModeStatus error');
            }
        }))
        it('setThermalModeSettingStatus should return err', fakeAsync(() => {
            try {
                gamingThermalModeService.setThermalModeSettingStatus(1);
            } catch(err) {
                expect(err).toMatch('setThermalModeStatus error', 'set thermal mode status to 1 FAIL');
            }
            tick()
            try {
                gamingThermalModeService.setThermalModeSettingStatus(2);
            } catch(err) {
                expect(err).toMatch('setThermalModeStatus error', 'set thermal mode status to 2 FAIL');
            }
            tick();
            try {
                gamingThermalModeService.setThermalModeSettingStatus(3);
            } catch(err) {
                expect(err).toMatch('setThermalModeStatus error', 'set thermal mode status to 3 FAIL');
            }
        }))
        it('regThermalModeChangeEvent should return err', async(() => {
            try {
                gamingThermalModeService.regThermalModeChangeEvent();
            } catch(err) {
                expect(err).toMatch('regThermalModeEvent error');
            }
        }))
        // thermal mode 2
        it('getThermalModeRealStatus should return err', async(() => {
            try {
                gamingThermalModeService.getThermalModeRealStatus();
            } catch(err) {
                expect(err).toMatch('getThermalModeRealStatus error');
            }
        }))
        it('getAutoSwitchStatus should return err', async(() => {
            try {
                gamingThermalModeService.getAutoSwitchStatus();
            } catch(err) {
                expect(err).toMatch('getAutoSwitchStatus error');
            }
        }))
        it('setAutoSwitchStatus should return err', fakeAsync(() => {
            try {
                gamingThermalModeService.setAutoSwitchStatus(true);
            } catch(err) {
                expect(err).toMatch('setAutoSwitchStatus error', 'set autoSwitch status to true FAIL');
            }
            tick();
            try {
                gamingThermalModeService.setAutoSwitchStatus(false);
            } catch(err) {
                expect(err).toMatch('setAutoSwitchStatus error', 'set autoSwitch status to false FAIL');
            }
        }))
        it('regThermalModeRealStatusChangeEvent should return err', async(() => {
            try {
                gamingThermalModeService.regThermalModeRealStatusChangeEvent();
            } catch(err) {
                expect(err).toMatch('regThermalModeRealStatusEvent error');
            }
        }))
    })
});

