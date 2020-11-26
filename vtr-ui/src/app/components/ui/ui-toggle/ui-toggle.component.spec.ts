import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiToggleComponent } from './ui-toggle.component';

xdescribe('UiToggleComponent', () => {
	let component: UiToggleComponent;
	let fixture: ComponentFixture<UiToggleComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UiToggleComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UiToggleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
