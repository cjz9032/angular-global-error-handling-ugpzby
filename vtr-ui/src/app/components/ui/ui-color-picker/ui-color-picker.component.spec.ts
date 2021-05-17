import { NO_ERRORS_SCHEMA } from '@angular/core';
import { fakeAsync, ComponentFixture, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@lenovo/material/dialog';

import { GAMING_DATA } from './../../../../testing/gaming-data';
import { UiColorPickerComponent } from './ui-color-picker.component';

const presetColorList = [
	{ color: 'FFECE6', isChecked: true },
	{ color: 'FFFBE6', isChecked: false },
];

describe('UiColorPickerComponent', () => {
	let component: UiColorPickerComponent;
	let fixture: ComponentFixture<UiColorPickerComponent>;
	const dummyElement = document.createElement('div');
	dummyElement.id = 'menu-main-btn-navbar-toggler';
	document.getElementById = jasmine.createSpy('HTML Element').and.returnValue(dummyElement);

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [
					UiColorPickerComponent,
					GAMING_DATA.mockPipe({ name: 'translate' }),
					GAMING_DATA.mockPipe({ name: 'sanitize' }),
				],
				providers: [MatDialog, MatDialogRef],
				schemas: [NO_ERRORS_SCHEMA],
				imports: [HttpClientModule],
			}).compileComponents();
			fixture = TestBed.createComponent(UiColorPickerComponent);
			component = fixture.componentInstance;
			component.color = '';
			fixture.detectChanges();
		})
	);

	it('should create', fakeAsync(() => {
		expect(component).toBeTruthy();

		fixture.detectChanges();
		component.isSliderOut = false;
		const button = document.getElementById('menu-main-btn-navbar-toggler');
		if (button) {
			button.click();
			fixture.detectChanges();
		}
		fixture.whenStable().then(() => {
			expect(component.isColorPicker).toBe(false);
		});
		tick(100);
	}));

	it('should hide color picker when resize', () => {
		component.onResize({});
		expect(component.isColorPicker).toEqual(false);
	});

	it('should choose color that first', () => {
		component.presetColorList = presetColorList;
		component.color = 'FFECE6';
		component.ngOnInit();
		expect(component.presetColorList[0].isChecked).toEqual(true);
	});

	it('should change color', () => {
		component.colorChange(0, true);
		expect(component.isColorPicker).toEqual(false);
		component.colorChange(0, false);
		expect(component.isColorPicker).toEqual(true);
	});

	it('should click apply button to choose color', () => {
		component.colorPickerSelectFun();
		expect(component.isColorPicker).toEqual(false);
	});

	it('should click cancel button to deselect color', () => {
		component.colorPickerCancelFun();
		expect(component.isColorPicker).toEqual(false);
	});

	it('should open advanced color disk', () => {
		component.isToggleMoreColor = true;
		component.moreColorFun(1);
		expect(component.isToggleMoreColor).toEqual(false);

		component.isToggleMoreColor = true;
		component.moreColorFun(2);
		expect(component.isToggleMoreColor).toEqual(true);

		component.isToggleMoreColor = false;
		component.moreColorFun(1);
		expect(component.isToggleMoreColor).toEqual(false);

		component.isToggleMoreColor = false;
		component.moreColorFun(2);
		expect(component.isToggleMoreColor).toEqual(true);
	});

	it('should change color picker', () => {
		const event = 'rgba(127,44,23)';
		component.colorPickerChangeFun(event);
		expect(component.color).toEqual('7f2c17');
	});

	it('should show preset color', () => {
		component.colorPresetFun();
		expect(component.isColorPicker).toEqual(true);
	});

	it('should show color picker when click component', (done) => {
		const event = new Event('click');
		component.generalClick(event);
		const p = new Promise((resolve, reject) => setTimeout(() => resolve(''), 50));
		component.isSliderOut = true;
		p.then((result) => {
			fakeAsync(() => {
				expect(component.isSliderOut).toEqual(false);
			});
			done();
		});
	});

	it('should hide color picker when click component', (done) => {
		const event = new Event('click');
		component.generalClick(event);
		const p = new Promise((resolve, reject) => setTimeout(() => resolve(''), 50));
		component.isSliderOut = false;
		p.then((result) => {
			fakeAsync(() => {
				expect(component.isColorPicker).toEqual(false);
			});
			done();
		});
	});

	it('should slider drag end', () => {
		const event = new Event('click');
		component.clickEvent = event;
		component.isFirstTrigger = true;
		component.cpSliderDragEndFun({});
		expect(component.isSliderOut).toEqual(true);

		component.clickEvent = { target: '' };
		component.cpSliderDragEndFun(event);
		expect(component.isFirstTrigger).toBe(false);

		component.isFirstTrigger = false;
		component.cpSliderDragEndFun(event);
		expect(component.isSliderOut).toBe(true);
	});

	it('should change some message when page change', () => {
		component.ngOnChanges({});
		expect(component.ngOnChanges({})).toBeUndefined();
	});
});
