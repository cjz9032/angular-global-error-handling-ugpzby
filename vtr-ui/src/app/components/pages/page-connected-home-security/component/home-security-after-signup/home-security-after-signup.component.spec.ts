import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeSecurityAfterSignupComponent } from './home-security-after-signup.component';

xdescribe('HomeSecurityAfterSignupComponent', () => {
	let component: HomeSecurityAfterSignupComponent;
	let fixture: ComponentFixture<HomeSecurityAfterSignupComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [HomeSecurityAfterSignupComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(HomeSecurityAfterSignupComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	// it('should create', () => {
	// 	expect(component).toBeTruthy();
	// });
});
