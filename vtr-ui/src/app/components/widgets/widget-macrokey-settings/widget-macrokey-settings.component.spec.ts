import { MacrokeyService } from './../../../services/gaming/macrokey/macrokey.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetMacrokeySettingsComponent } from './widget-macrokey-settings.component';
import { Pipe, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const macrokeyServiceMock = jasmine.createSpyObj('MacrokeyService', [ 'isMacroKeyAvailable' ]);

fdescribe('WidgetMacrokeySettingsComponent', () => {
	let component: WidgetMacrokeySettingsComponent;
	let fixture: ComponentFixture<WidgetMacrokeySettingsComponent>;
	macrokeyServiceMock.isMacroKeyAvailable.and.returnValue(true);

	beforeEach(
		async(() => {
			TestBed.configureTestingModule({
				declarations: [
					WidgetMacrokeySettingsComponent,
					mockPipe({ name: 'translate' }),
					mockPipe({ name: 'sanitize' })
				],
				schemas: [ NO_ERRORS_SCHEMA ],
				providers: [ { provide: HttpClient }, { provide: MacrokeyService, useValue: macrokeyServiceMock } ]
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(WidgetMacrokeySettingsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

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
