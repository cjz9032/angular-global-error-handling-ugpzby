import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiButtonHWScanComponent } from './ui-button-hwscan.component';

xdescribe('UiButtonComponent', () => {
	let component: UiButtonHWScanComponent;
	let fixture: ComponentFixture<UiButtonHWScanComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UiButtonHWScanComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UiButtonHWScanComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
