import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiListSupportComponent } from './ui-list-support.component';

xdescribe('UiListSupportComponent', () => {
	let component: UiListSupportComponent;
	let fixture: ComponentFixture<UiListSupportComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UiListSupportComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UiListSupportComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
