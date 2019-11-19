// import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
// import { WidgetQuicksettingsListComponent } from './widget-quicksettings-list.component';
// import { Pipe } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import { AudioService } from 'src/app/services/audio/audio.service';
// import { GamingThermalModeService } from 'src/app/services/gaming/gaming-thermal-mode/gaming-thermal-mode.service';

// const audioServiceMock = jasmine.createSpyObj('AudioService', ['isShellAvailable', 'getDolbyFeatureStatus', 'setDolbyOnOff']);
// const gamingThermalModeServiceMock = jasmine.createSpyObj('GamingThermalModeService', ['isShellAvailable', 'getThermalModeStatus', 'setThermalModeStatus', 'regThermalModeEvent']);

// describe('WidgetQuicksettingsListComponent', () => {
// 	let component: WidgetQuicksettingsListComponent;
// 	let fixture: ComponentFixture<WidgetQuicksettingsListComponent>;
// 	gamingThermalModeServiceMock.isShellAvailable.and.returnValue(true);

// 	beforeEach(async(() => {
// 		TestBed.configureTestingModule({
// 			declarations: [WidgetQuicksettingsListComponent,
// 				mockPipe({ name: 'translate' })],
// 			schemas: [NO_ERRORS_SCHEMA],
// 			providers: [
// 				{ provide: HttpClient },
// 				{ provide: GamingThermalModeService, useValue: gamingThermalModeServiceMock },
// 				{ provide: AudioService, useValue: audioServiceMock }
// 			]
// 		}).compileComponents();
// 		fixture = TestBed.createComponent(WidgetQuicksettingsListComponent);
// 		component = fixture.debugElement.componentInstance;
// 		fixture.detectChanges();
// 	}));

// 	it('should create', () => {
// 		expect(component).toBeTruthy();
// 	});

// 	it('should have default value Balance for thermal mode if localstorage not set', () => {
// 		fixture = TestBed.createComponent(WidgetQuicksettingsListComponent);
// 		component = fixture.debugElement.componentInstance;
// 		fixture.detectChanges();
// 		//Expected Default Behaviour
// 		expect(component.drop.curSelected).toEqual(2);
// 	});

// 	it('should update the thermal mode value on service and in Local storage', fakeAsync((done: any) => {
// 		let thermalModePromisedData: number;
// 		const uiThermalModeValue = component.drop.curSelected;
// 		const cacheThermalModeValue = component.GetThermalModeCacheStatus();
// 		gamingThermalModeServiceMock.getThermalModeStatus.and.returnValue(Promise.resolve(uiThermalModeValue));
// 		gamingThermalModeServiceMock.getThermalModeStatus().then((response: any) => {
// 			thermalModePromisedData = response;
// 		});
// 		component.renderThermalModeStatus();
// 		tick(10);
// 		fixture.detectChanges();
// 		expect(uiThermalModeValue).toEqual(cacheThermalModeValue);
// 		expect(uiThermalModeValue).toEqual(thermalModePromisedData);
// 		expect(cacheThermalModeValue).toEqual(thermalModePromisedData);
// 	}));

// 	it('Should not have same value in current and previous local storage', fakeAsync(() => {
// 		const cacheThermalModeValue = component.GetThermalModeCacheStatus();
// 		const PreCacheThermalModeValue = component.GetThermalModePrevCacheStatus();
// 		tick(10);
// 		fixture.detectChanges();
// 		expect(cacheThermalModeValue).not.toEqual(PreCacheThermalModeValue);
// 	}));

// 	it('should give ischecked true after calling set dolby', fakeAsync(() => {
// 		component.setDolbySettings(true);
// 		expect(component.quickSettings[3].isChecked).toEqual(false);
// 	}));

// });

// /**
//  * @param options pipeName which has to be mock
//  * @description To mock the pipe.
//  * @summary This has to move to one utils file.
//  */
// export function mockPipe(options: Pipe): Pipe {
// 	const metadata: Pipe = {
// 		name: options.name
// 	};
// 	return <any>Pipe(metadata)(class MockPipe {
// 		public transform(query: string, ...args: any[]): any {
// 			return query;
// 		}
// 	});
// }
