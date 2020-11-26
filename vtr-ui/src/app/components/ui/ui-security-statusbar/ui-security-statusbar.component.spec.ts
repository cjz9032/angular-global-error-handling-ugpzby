import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiSecurityStatusbarComponent } from './ui-security-statusbar.component';

xdescribe('UiSecurityStatusbarComponent', () => {
	let component: UiSecurityStatusbarComponent;
	let fixture: ComponentFixture<UiSecurityStatusbarComponent>;

	beforeEach(async(() => {
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
