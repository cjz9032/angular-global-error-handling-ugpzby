import { HttpClientModule } from '@angular/common/http';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { CommonService } from '../../../../../../services/common/common.service';
import { VantageShellService } from '../../../../../../services/vantage-shell/vantage-shell.service';
import { BacklightLevelEnum, BacklightStatusEnum } from './backlight.enum';
import { BacklightLevel, BacklightStatus } from './backlight.interface';
import { BacklightService } from './backlight.service';


describe('BacklightService', () => {
	let backlightService: BacklightService;
	let vantageShellService: VantageShellService;
	let shellServiceSpy;

	beforeEach(() => {
		shellServiceSpy = jasmine.createSpyObj('VantageShellService', ['getBacklight']);
		TestBed.configureTestingModule({
			providers: [
				BacklightService,
				{ provide: VantageShellService, useValue: shellServiceSpy },
				CommonService
			],
			imports: [HttpClientModule]
		});
		vantageShellService = TestBed.inject(VantageShellService);
		backlightService = TestBed.inject(BacklightService);
	});

	it('should be created', () => {
		expect(backlightService).toBeTruthy();
	});

	it('#get backlight should return backlight\' data', fakeAsync(() => {
		const stubValue: Array<BacklightStatus | BacklightLevel> = [
			{
				key: 'KeyboardBacklightLevel',
				value: BacklightLevelEnum.ONE_LEVEL,
				enabled: 0,
				errorCode: 0
			},
			{
				key: 'KeyboardBacklightStatus',
				value: BacklightStatusEnum.OFF,
				enabled: 0,
				errorCode: 0
			}
		];
		shellServiceSpy.getBacklight.and.returnValue({
			getBacklight() {
				return Promise.resolve({
					settingList: {
						setting: stubValue
					}
				});
			}
		});
		backlightService = new BacklightService(shellServiceSpy);
		backlightService.backlight.subscribe(value => {
			expect(value).toBe(stubValue);
		});
	}));

	it('#get backlight should directly return cache$ if cache is already exist', fakeAsync(() => {
		const stubValue: Array<BacklightStatus | BacklightLevel> = [
			{
				key: 'KeyboardBacklightLevel',
				value: BacklightLevelEnum.ONE_LEVEL,
				enabled: 0,
				errorCode: 0
			},
			{
				key: 'KeyboardBacklightStatus',
				value: BacklightStatusEnum.OFF,
				enabled: 0,
				errorCode: 0
			}
		];
		shellServiceSpy.getBacklight.and.returnValue({
			getBacklight() {
				return Promise.resolve({
					settingList: {
						setting: stubValue
					}
				});
			}
		});
		backlightService = new BacklightService(shellServiceSpy);
		const cacheStub$ = new Observable<Array<BacklightStatus | BacklightLevel>>();
		backlightService.cache$ = cacheStub$;
		// const spy = spyOnProperty(backlightService, 'backlight');
		const result = backlightService.backlight;
		expect(result).toBe(cacheStub$);
	}));

	it('should clear cache after forceReload method has been called', () => {
		const spy = spyOn(backlightService.reload$, 'next');
		backlightService.forceReload();
		expect(backlightService.cache$).toBeNull();
		expect(spy).toHaveBeenCalled();
	});

	it('should clear cache after clearCache method has been called', () => {
		backlightService.clearCache();
		expect(backlightService.cache$).toBeNull();
	});

	it('should call backlightFeature.setBacklight', () => {
		shellServiceSpy.getBacklight.and.returnValue({
			setBacklight() {
				return Promise.resolve({
					errorCode: 0
				});
			}
		});
		backlightService = new BacklightService(shellServiceSpy);
		backlightService.setBacklight({
			checked: true,
			disabled: false,
			value: BacklightStatusEnum.OFF,
			title: 'device.deviceSettings.inputAccessories.backlight.level.off'
		});
		expect(shellServiceSpy.getBacklight).toHaveBeenCalled();
	});

	it('should call backlightFeature.getBacklightOnSystemChange', () => {
		shellServiceSpy.getBacklight.and.returnValue({
			getBacklightOnSystemChange() { }
		});
		backlightService = new BacklightService(shellServiceSpy);
		backlightService.getBacklightOnSystemChange();
		expect(shellServiceSpy.getBacklight).toHaveBeenCalled();
	});

	it('#backlightFeature.getBacklightOnSystemChange should receive two arguments', fakeAsync(() => {
		shellServiceSpy.getBacklight.and.returnValue({
			getBacklightOnSystemChange() {
				return Promise.resolve({
					response: {
						settingList: {
							setting: [
								{
									key: 'KeyboardBacklightLevel',
									value: BacklightLevelEnum.ONE_LEVEL,
									enabled: 0,
									errorCode: 0
								},
								{
									key: 'KeyboardBacklightStatus',
									value: BacklightStatusEnum.OFF,
									enabled: 0,
									errorCode: 0
								}
							]
						}
					}
				});
			}
		});
		const svc = new BacklightService(shellServiceSpy);
		const getBacklightOnSystemChangeSpy = spyOn(svc.backlightFeature, 'getBacklightOnSystemChange');
		getBacklightOnSystemChangeSpy.and.returnValue(Promise.resolve({
			settingList: {
				setting: [
					{
						key: 'KeyboardBacklightLevel',
						value: BacklightLevelEnum.ONE_LEVEL,
						enabled: 0,
						errorCode: 0
					},
					{
						key: 'KeyboardBacklightStatus',
						value: BacklightStatusEnum.OFF,
						enabled: 0,
						errorCode: 0
					}
				]
			}
		}));
		svc.getBacklightOnSystemChange().subscribe();
		tick();
		expect(getBacklightOnSystemChangeSpy).toHaveBeenCalledWith(jasmine.any(Object), jasmine.any(Function));
	}));

	it('#backlightFeature.getBacklightOnSystemChange should reject this request', fakeAsync(() => {
		shellServiceSpy.getBacklight.and.returnValue({
			getBacklightOnSystemChange() { }
		});
		const svc = new BacklightService(shellServiceSpy);
		const getBacklightOnSystemChangeSpy = spyOn(svc.backlightFeature, 'getBacklightOnSystemChange');
		getBacklightOnSystemChangeSpy.and.returnValue(Promise.reject({
			errorcode: 1
		}));
		svc.getBacklightOnSystemChange().subscribe(
			() => { },
			err => {
				expect(err.errorcode).toBe(1);
			}
		);
		tick();
	}));

	it('#backlightFeature.getBacklightOnSystemChange should complete this call when errorcode is 606', fakeAsync(() => {
		shellServiceSpy.getBacklight.and.returnValue({
			getBacklightOnSystemChange() { }
		});
		const svc = new BacklightService(shellServiceSpy);
		const getBacklightOnSystemChangeSpy = spyOn(svc.backlightFeature, 'getBacklightOnSystemChange');
		getBacklightOnSystemChangeSpy.and.returnValue(Promise.reject({
			errorcode: 606,
			payload: {}
		}));
		svc.getBacklightOnSystemChange().subscribe(
			response => {
				expect(response).not.toBeNull();
			}
		);
		tick();
	}));

	it('#backlightFeature.getBacklightOnSystemChange should receive callback\'s data', fakeAsync(() => {
		shellServiceSpy.getBacklight.and.returnValue({
			getBacklightOnSystemChange() { }
		});
		const svc = new BacklightService(shellServiceSpy);
		const getBacklightOnSystemChangeSpy = spyOn(svc.backlightFeature, 'getBacklightOnSystemChange');
		getBacklightOnSystemChangeSpy.and.callFake((first, second) => {
			second.call(svc, {
				errorcode: 0,
				payload: 'test'
			});
			return Promise.resolve({
				settingList: {
					setting: [
						{
							key: 'KeyboardBacklightLevel',
							value: BacklightLevelEnum.ONE_LEVEL,
							enabled: 0,
							errorCode: 0
						},
						{
							key: 'KeyboardBacklightStatus',
							value: BacklightStatusEnum.OFF,
							enabled: 0,
							errorCode: 0
						}
					]
				}
			});
		});
		svc.getBacklightOnSystemChange().subscribe(
			response => {
				expect(response).not.toBeNull();
			}
		);
		tick();
	}));
});
