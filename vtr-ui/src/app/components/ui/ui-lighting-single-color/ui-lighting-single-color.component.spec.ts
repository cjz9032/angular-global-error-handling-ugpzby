import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiLightingSingleColorComponent } from './ui-lighting-single-color.component';

xdescribe('UiLightingSingleColorComponent', () => {
	let component: UiLightingSingleColorComponent;
	let fixture: ComponentFixture<UiLightingSingleColorComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UiLightingSingleColorComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UiLightingSingleColorComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
