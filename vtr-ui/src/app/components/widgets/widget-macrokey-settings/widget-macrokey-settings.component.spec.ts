import { MacrokeyService } from './../../../services/gaming/macrokey/macrokey.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetMacrokeySettingsComponent } from './widget-macrokey-settings.component';
import { Pipe, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { GamingAllCapabilitiesService } from 'src/app/services/gaming/gaming-capabilities/gaming-all-capabilities.service';

const macrokeyServiceMock = jasmine.createSpyObj('MacrokeyService', [
	'isMacroKeyAvailable',
	'getMacrokeyTypeStatusCache',
	'getMacrokeyRecordedStatusCache',
	'getMacrokeyInputChangeCache',
	'getMacrokeyInitialKeyDataCache',
	'gamingMacroKeyInitializeEvent'
]);

const gamingAllCapabilitiesServiceMock = jasmine.createSpyObj('GamingAllCapabilitiesService', [
	'gamingAllCapabilities',
	'isShellAvailable',
	'getCapabilityFromCache'
]);

fdescribe('WidgetMacrokeySettingsComponent', () => {
	let component: WidgetMacrokeySettingsComponent;
	let fixture: ComponentFixture<WidgetMacrokeySettingsComponent>;
	macrokeyServiceMock.isMacroKeyAvailable.and.returnValue(true);
	gamingAllCapabilitiesServiceMock.getCapabilityFromCache.and.returnValue(true);
	macrokeyServiceMock.gamingMacroKeyInitializeEvent.and.returnValue(Promise.resolve(true));

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
