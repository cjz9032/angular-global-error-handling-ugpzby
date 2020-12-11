import { ComponentFixture, fakeAsync, TestBed, waitForAsync, tick } from '@angular/core/testing';

import { UiColorWheelComponent } from './ui-color-wheel.component';
import { NO_ERRORS_SCHEMA, Pipe } from '@angular/core';
import { GAMING_DATA } from './../../../../testing/gaming-data';

describe('UiColorWheelComponent', () => {
	let component: UiColorWheelComponent;
	let fixture: ComponentFixture<UiColorWheelComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [
				UiColorWheelComponent,
				GAMING_DATA.mockPipe({ name: 'translate' }),
				GAMING_DATA.mockPipe({ name: 'sanitize' }),
			],
			schemas: [NO_ERRORS_SCHEMA],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UiColorWheelComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', fakeAsync(() => {
		expect(component).toBeTruthy();

		fixture.detectChanges();
		if (component.colorWheel) {
			component.colorWheel.onChange({
				hex: 'ff0000', rgb: '00ff00'
			});
			fixture.detectChanges();

			fixture.whenStable().then(() => {
				expect(component.backColor).toBe('ff0000');
				expect(component.color).toBe('00ff00');
			});
			tick(100);
		}
	}));

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
		const event: any = { keyCode: 58 };
		const res = component.validateInput(event);
		expect(res).toBe(false);
	});

	it('should Validate the input and return true.', () => {
		const event: any = { which: 31 };
		const res = component.validateInput(event);
		expect(res).toBe(true);
	});

	it('should check with the empty text.', () => {
		const event: any = { target: { value: '' } };
		const res = component.checkEmpty(event);
		expect(res).toBe(undefined);
	});

	it('should check with the test value.', () => {
		const event: any = { target: { value: 'test value' } };
		const res = component.checkEmpty(event);
		expect(res).toBe(undefined);
	});

	it('should update based on changes', () => {
		component.ngOnChanges({
			inHEX: { previousValue: '#fff', currentValue: '#ffff' },
			btnStatus: { previousValue: 'show', currentValue: 'hide' },
		});
		expect(component.inHEX).toBe('#ffff');
	});
});
