import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiColorWheelComponent } from './ui-color-wheel.component';
import { NO_ERRORS_SCHEMA, Pipe } from '@angular/core';

describe('UiColorWheelComponent', () => {
	let component: UiColorWheelComponent;
	let fixture: ComponentFixture<UiColorWheelComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UiColorWheelComponent,
				mockPipe({ name: 'translate' }),
				mockPipe({ name: 'sanitize' })],
				schemas: [NO_ERRORS_SCHEMA]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UiColorWheelComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should emit the color ', () => {
		const res = component.onApplyColorEffect('#ffff');
		expect(res).toBe(undefined);
	});

	it('should update the RGB based on color ', () => {
		component.color = [255, 0, 0];
		component.rgbChanged();
		expect(component.colorWheel.rgb).toEqual(component.color);
	});

	it('should Validate the input and return false ', () => {
		const event: any = {keyCode: 58};
		const res = component.validateInput(event);
		expect(res).toBe(false);
	});

	it('should Validate the input and return true.', () => {
		const event: any = { which: 31 };
		const res = component.validateInput(event);
		expect(res).toBe(true);
	});

	it('should check with the empty text.', () => {
		const event: any = { target: {value: ''} };
		const res = component.checkEmpty(event);
		expect(res).toBe(undefined);
	});

	it('should check with the test value.', () => {
		const event: any = { target: { value: 'test value' } };
		const res = component.checkEmpty(event);
		expect(res).toBe(undefined);
	});

	it('should update based on changes', () => {
		component.ngOnChanges({ inHEX: { previousValue: '#fff', currentValue: '#ffff'
		}, btnStatus: { previousValue: 'show', currentValue: 'hide'}});
		expect(component.inHEX ).toBe('#ffff');
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
