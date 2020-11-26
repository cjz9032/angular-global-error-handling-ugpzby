import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageDeviceUpdatesComponent } from './page-device-updates.component';

xdescribe('PageDeviceUpdatesComponent', () => {
	let component: PageDeviceUpdatesComponent;
	let fixture: ComponentFixture<PageDeviceUpdatesComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [PageDeviceUpdatesComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PageDeviceUpdatesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
