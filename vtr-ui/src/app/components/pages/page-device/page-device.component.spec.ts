import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PageDeviceComponent } from './page-device.component';

xdescribe('PageDeviceComponent', () => {
	let component: PageDeviceComponent;
	let fixture: ComponentFixture<PageDeviceComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [PageDeviceComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PageDeviceComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
