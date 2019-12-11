import { MacrokeyService } from './../../../services/gaming/macrokey/macrokey.service';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { WidgetMacrokeySettingsComponent } from './widget-macrokey-settings.component';
import { Pipe, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { GamingAllCapabilitiesService } from 'src/app/services/gaming/gaming-capabilities/gaming-all-capabilities.service';

const macrokeyServiceMock = jasmine.createSpyObj('MacrokeyService', [
	'isMacroKeyAvailable',
	'getMacrokeyTypeStatusCache',
	'getMacrokeyRecordedStatusCache',
	'getMacrokeyInitialKeyDataCache',
	'getMacrokeyInputChangeCache',
	'gamingMacroKeyInitializeEvent',
	'setMacrokeyTypeStatusCache',
	'setMacrokeyRecordedStatusCache',
	'setMacrokeyInputChangeCache',
	'setMacrokeyInitialKeyDataCache',
	'setStartRecording',
	'setStopRecording',
	'setKey'
]);

const gamingAllCapabilitiesServiceMock = jasmine.createSpyObj('GamingAllCapabilitiesService', [
	'gamingAllCapabilities',
	'isShellAvailable',
	'getCapabilityFromCache'
]);

const keyTypeSampleData = { MacroKeyStatus: 1, MacroKeyType: 0 };
let recordedStatusSampleData = [
	{ key: '7', status: false },
	{ key: '8', status: false },
	{ key: '9', status: false },
	{ key: '4', status: false },
	{ key: '5', status: false },
	{ key: '6', status: false },
	{ key: '1', status: false },
	{ key: '2', status: true },
	{ key: '3', status: false },
	{ key: '0', status: true }
];
const inputChangeSampleData = { macro: { inputs: [], repeat: 1, interval: 1 }, key: '0' };
const sampleInputData = {
	key: '0',
	macro: {
		repeat: 1,
		interval: 1,
		inputs: [
			{ status: 1, key: 'S', interval: 0, pairName: 'pair-S-1' },
			{ status: 0, key: 'S', interval: 208, pairName: 'pair-S-1' },
			{ status: 1, key: 'D', interval: 174, pairName: 'pair-D-1' },
			{ status: 0, key: 'D', interval: 186, pairName: 'pair-D-1' },
			{ status: 1, key: 'F', interval: 144, pairName: 'pair-F-1' },
			{ status: 0, key: 'F', interval: 126, pairName: 'pair-F-1' }
		]
	}
};

describe('WidgetMacrokeySettingsComponent', () => {
	let component: WidgetMacrokeySettingsComponent;
	let fixture: ComponentFixture<WidgetMacrokeySettingsComponent>;
	macrokeyServiceMock.isMacroKeyAvailable.and.returnValue(true);
	gamingAllCapabilitiesServiceMock.getCapabilityFromCache.and.returnValue(true);
	macrokeyServiceMock.gamingMacroKeyInitializeEvent.and.returnValue(Promise.resolve(true));
	macrokeyServiceMock.getMacrokeyTypeStatusCache.and.returnValue(keyTypeSampleData);
	macrokeyServiceMock.getMacrokeyRecordedStatusCache.and.returnValue(recordedStatusSampleData);
	macrokeyServiceMock.getMacrokeyInputChangeCache.and.returnValue(sampleInputData);
	macrokeyServiceMock.getMacrokeyInitialKeyDataCache.and.returnValue(sampleInputData);
	macrokeyServiceMock.setKey.and.returnValue(true);

	beforeEach(
		async(() => {
			TestBed.configureTestingModule({
				declarations: [
					WidgetMacrokeySettingsComponent,
					mockPipe({ name: 'translate' }),
					mockPipe({ name: 'sanitize' })
				],
				schemas: [NO_ERRORS_SCHEMA],
				providers: [
					{ provide: HttpClient },
					{ provide: Router, useValue: { navigate: (route) => route } },
					{ provide: MacrokeyService, useValue: macrokeyServiceMock },
					{ provide: GamingAllCapabilitiesService, useValue: gamingAllCapabilitiesServiceMock }
				]
			}).compileComponents();
			fixture = TestBed.createComponent(WidgetMacrokeySettingsComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
		})
	);

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('Numberpad should be true', () => {
		keyTypeSampleData.MacroKeyType = 0;
		component.onGamingMacroKeyInitializeEvent(keyTypeSampleData);
		expect(component.isNumpad).toEqual(true);
	});

	it('Numberpad should be false', () => {
		keyTypeSampleData.MacroKeyType = 1;
		component.onGamingMacroKeyInitializeEvent(keyTypeSampleData);
		expect(component.isNumpad).toEqual(false);
	});

	it('Macrokey status should be off', () => {
		keyTypeSampleData.MacroKeyStatus = 1;
		component.onGamingMacroKeyInitializeEvent(keyTypeSampleData);
		expect(component.macroKeyTypeStatus.MacroKeyStatus).toEqual(1);
	});

	it('Macrokey status should be on', () => {
		keyTypeSampleData.MacroKeyStatus = 2;
		component.onGamingMacroKeyInitializeEvent(keyTypeSampleData);
		expect(component.macroKeyTypeStatus.MacroKeyStatus).toEqual(2);
	});

	it('Macrokey status should be when gaming', () => {
		keyTypeSampleData.MacroKeyStatus = 3;
		component.onGamingMacroKeyInitializeEvent(keyTypeSampleData);
		expect(component.macroKeyTypeStatus.MacroKeyStatus).toEqual(3);
	});

	it('Inital number selected should be 0', () => {
		component.onGamingMacroKeyRecordedChangeEvent(recordedStatusSampleData);
		expect(component.numberSelected.key).toEqual('0');
	});

	it('Number selected should change to 0', () => {
		inputChangeSampleData.key = '0';
		component.onGamingMacroKeyKeyChangeEvent(inputChangeSampleData);
		expect(component.numberSelected.key).toEqual('0');
	});

	it('Number selected should change to 6', () => {
		inputChangeSampleData.key = '6';
		component.onGamingMacroKeyKeyChangeEvent(inputChangeSampleData);
		expect(component.numberSelected.key).toEqual('6');
	});

	it('Input data should change to defaults', () => {
		inputChangeSampleData.key = '0';
		inputChangeSampleData.macro.interval = 1;
		inputChangeSampleData.macro.repeat = 1;
		inputChangeSampleData.macro.inputs = [];
		component.onGamingMacroKeyKeyChangeEvent(inputChangeSampleData);
		expect(component.macroKeyInputData.key).toEqual('0');
		expect(component.macroKeyInputData.macro.interval).toEqual(1);
		expect(component.macroKeyInputData.macro.repeat).toEqual(1);
		expect(component.macroKeyInputData.macro.inputs).toEqual([]);
	});

	it('Reset inputs and message data when started recording', () => {
		const recordingChangeData = { recordingStatus: true };
		component.onRecordingChanged(recordingChangeData);
		expect(component.macroKeyInputData.macro.inputs).toEqual([]);
		expect(component.macroKeyMessageData).toEqual('');
		recordingChangeData.recordingStatus = false;
		component.onRecordingChanged(recordingChangeData);
	});
	it('Should select the number', fakeAsync(() => {
		component.onNumberSelected({ key: 9 });
		expect(component.numberSelected).toEqual({ key: 9 });
	})
	);
	it('Should route back', fakeAsync(() => {
		const result = component.redirectBack();
		expect(result).toEqual(undefined);
	})
	);
	it('Should update the macrokey message event', fakeAsync(() => {
		component.updateMacroKeyInputMessageEvent({message: 'Dummy message here'});
		tick(10);
		fixture.detectChanges();
		expect(component.macroKeyMessageData).toEqual({message: 'Dummy message here'});
	}));
});

export function mockPipe(options: Pipe): Pipe {
	const metadata: Pipe = {
		name: options.name
	};
	return Pipe(metadata)(
		class MockPipe {
			public transform(query: string, ...args: any[]): any {
				return query;
			}
		}
	);
}
