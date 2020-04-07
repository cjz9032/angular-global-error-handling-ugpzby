import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalWifiSecurityLocationNoticeComponent } from './modal-wifi-security-location-notice.component';

xdescribe('ModalWifiSecurityLocationNoticeComponent', () => {
	let component: ModalWifiSecurityLocationNoticeComponent;
	let fixture: ComponentFixture<ModalWifiSecurityLocationNoticeComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ModalWifiSecurityLocationNoticeComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ModalWifiSecurityLocationNoticeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
