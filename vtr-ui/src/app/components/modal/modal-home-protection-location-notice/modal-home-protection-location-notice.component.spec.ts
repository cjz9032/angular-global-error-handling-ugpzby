import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalHomeProtectionLocationNoticeComponent } from './modal-home-protection-location-notice.component';

describe('ModalWifiSecuriryLocationNoticeComponent', () => {
	let component: ModalHomeProtectionLocationNoticeComponent;
	let fixture: ComponentFixture<ModalHomeProtectionLocationNoticeComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ModalHomeProtectionLocationNoticeComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ModalHomeProtectionLocationNoticeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
