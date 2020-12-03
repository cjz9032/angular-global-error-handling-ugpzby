import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UiListSupportComponent } from './ui-list-support.component';

xdescribe('UiListSupportComponent', () => {
	let component: UiListSupportComponent;
	let fixture: ComponentFixture<UiListSupportComponent>;

	beforeEach(waitForAsync(() => {
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
