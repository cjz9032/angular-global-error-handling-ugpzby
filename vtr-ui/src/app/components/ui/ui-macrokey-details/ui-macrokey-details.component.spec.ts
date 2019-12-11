import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiMacrokeyDetailsComponent } from './ui-macrokey-details.component';
import { Pipe, NO_ERRORS_SCHEMA } from '@angular/core';

describe('UiMacrokeyDetailsComponent', () => {
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

	it('should delete records', async () => {
		const result = await component.recordsDelete([1]);
		expect(result).toEqual(undefined);
	});


	it('should call the toggleRecording function when start clicked', async () => {
		await component.onStartClicked({});
		expect(component.recording).toEqual(true);
	});

	it('should call the toggleRecording function when stop clicked', async () => {
		await component.onStopClicked({});
		expect(component.recording).toEqual(true);
	});

	it('should add the event listener', async () => {
		const result = await component.ngOnInit();
		expect(result).toEqual(undefined);
	});

	it('should call the ngOnchanges with timeout10', async () => {
		const result = await component.ngOnChanges({ messageData: { currentValue: 'timeout10' } });
		expect(result).toEqual(undefined);
	});
	it('should call the ngOnchanges with timeout20 ', async () => {
		const result = await component.ngOnChanges({ messageData: { currentValue: 'timeout20' } });
		expect(result).toEqual(undefined);
	});
	it('should call the ngOnchanges with maximum timeout', async () => {
		const result = await component.ngOnChanges({ messageData: { currentValue: 'maximum' } });
		expect(result).toEqual(undefined);
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
