import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiMacrokeyDetailsComponent } from './ui-macrokey-details.component';
import { Pipe, NO_ERRORS_SCHEMA } from '@angular/core';

fdescribe('UiMacrokeyDetailsComponent', () => {
	let component: UiMacrokeyDetailsComponent;
	let fixture: ComponentFixture<UiMacrokeyDetailsComponent>;

	beforeEach(
		async(() => {
			TestBed.configureTestingModule({
				declarations: [UiMacrokeyDetailsComponent,
					mockPipe({ name: 'translate' }),
					mockPipe({ name: 'sanitize' })],
				schemas: [NO_ERRORS_SCHEMA]
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(UiMacrokeyDetailsComponent);
		component = fixture.componentInstance;
		component.recording = false;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should start recording', async () => {
		try {
			await component.toggleRecording();
		} catch (e) {
			console.log(e);
		}
		expect(component.recording).toEqual(true);

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
