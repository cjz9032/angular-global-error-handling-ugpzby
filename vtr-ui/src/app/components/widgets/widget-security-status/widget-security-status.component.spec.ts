import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WidgetSecurityStatusComponent } from './widget-security-status.component';

xdescribe('WidgetSecurityStatusComponent', () => {
	let component: WidgetSecurityStatusComponent;
	let fixture: ComponentFixture<WidgetSecurityStatusComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [WidgetSecurityStatusComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(WidgetSecurityStatusComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
