import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UiSecurityStatusbarComponent } from './ui-security-statusbar.component';

xdescribe('UiSecurityStatusbarComponent', () => {
	let component: UiSecurityStatusbarComponent;
	let fixture: ComponentFixture<UiSecurityStatusbarComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [UiSecurityStatusbarComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UiSecurityStatusbarComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
