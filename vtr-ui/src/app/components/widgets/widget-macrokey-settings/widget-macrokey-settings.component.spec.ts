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
	'gamingMacroKeyInitializeEvent'
]);

const gamingAllCapabilitiesServiceMock = jasmine.createSpyObj('GamingAllCapabilitiesService', [
	'gamingAllCapabilities',
	'isShellAvailable',
	'getCapabilityFromCache'
]);

const keyTypeSampleData = { MacroKeyStatus: 1, MacroKeyType: 0 };
const recordedStatusSampleData = [
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

fdescribe('WidgetMacrokeySettingsComponent', () => {
	let component: WidgetMacrokeySettingsComponent;
	let fixture: ComponentFixture<WidgetMacrokeySettingsComponent>;
	macrokeyServiceMock.isMacroKeyAvailable.and.returnValue(true);
	gamingAllCapabilitiesServiceMock.getCapabilityFromCache.and.returnValue(true);
	macrokeyServiceMock.gamingMacroKeyInitializeEvent.and.returnValue(Promise.resolve(true));
	macrokeyServiceMock.getMacrokeyTypeStatusCache.and.returnValue(keyTypeSampleData);
	macrokeyServiceMock.getMacrokeyRecordedStatusCache.and.returnValue(recordedStatusSampleData);
	macrokeyServiceMock.getMacrokeyInputChangeCache.and.returnValue(sampleInputData);

	beforeEach(
		async(() => {
			TestBed.configureTestingModule({
				declarations: [
					WidgetMacrokeySettingsComponent,
					mockPipe({ name: 'translate' }),
					mockPipe({ name: 'sanitize' })
				],
				schemas: [ NO_ERRORS_SCHEMA ],
				providers: [
					{ provide: HttpClient },
					{ provide: Router },
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
