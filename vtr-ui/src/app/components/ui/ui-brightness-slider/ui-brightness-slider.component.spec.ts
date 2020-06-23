import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiBrightnessSliderComponent } from './ui-brightness-slider.component';
import { By } from '@angular/platform-browser';

describe('UiBrightnessSliderComponent', () => {
	let component: UiBrightnessSliderComponent;
	let fixture: ComponentFixture<UiBrightnessSliderComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UiBrightnessSliderComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UiBrightnessSliderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should check dragEnd when event false', () => {
		spyOn(component.onSliderChanged, 'emit').and.callThrough();
		component.onSliderChanged.subscribe((res: any) => {
			expect(res).toBe(false);
		});
		component.dragEnd({value: false});
	});

	it('should check dragEnd when event true', () => {
		spyOn(component.onSliderChanged, 'emit').and.callThrough();
		component.onSliderChanged.subscribe((res: any) => {
			expect(res).toBe(true);
		});
		component.dragEnd({value: true});
	});

	it('set attribute to radiogroup when tab focus', (() => {
			component.onFocusSlider({ which: 9 });
			fixture.detectChanges()
			const elem = fixture.debugElement.query(By.css('.brightness_slider')).nativeElement;
			expect(elem.role).toBe(undefined);
		}));

	it('set attribute to slider when mouse hover', (() => {
			component.onMouseSlider();
		  fixture.detectChanges();
			const elem = fixture.debugElement.query(By.css('.brightness_slider'));
			expect(elem.attributes.role).toContain('slider');
		}));

});
