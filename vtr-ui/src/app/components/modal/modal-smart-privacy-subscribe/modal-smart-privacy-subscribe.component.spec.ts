import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogRef } from '@lenovo/material/dialog';

import { ModalSmartPrivacySubscribeComponent } from './modal-smart-privacy-subscribe.component';

import { CommonService } from 'src/app/services/common/common.service';
import { SupportService } from 'src/app/services/support/support.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { DevService } from 'src/app/services/dev/dev.service';
import { SanitizePipe } from 'src/app/pipe/sanitize.pipe';

describe('ModalSmartPerformanceSubscribeComponent', () => {
	let component: ModalSmartPrivacySubscribeComponent;
	let fixture: ComponentFixture<ModalSmartPrivacySubscribeComponent>;
	let activaModal: MatDialogRef<ModalSmartPrivacySubscribeComponent>;
	let supportService: SupportService;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				schemas: [NO_ERRORS_SCHEMA],
				declarations: [ModalSmartPrivacySubscribeComponent, SanitizePipe],
				imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
				providers: [MatDialogRef, CommonService, SupportService, LoggerService, DevService],
			});
			fixture = TestBed.createComponent(ModalSmartPrivacySubscribeComponent);
			component = fixture.componentInstance;
		})
	);

	it('should create Modal SmartPerformance Subscribe Component', () => {
		const machineInfo = {
			countryCode: 'en',
			serialnumber: 'PC0ZEPQ6',
			mt: '',
		};
		supportService = TestBed.inject(SupportService);
		spyOn(supportService, 'getMachineInfo').and.returnValue(Promise.resolve(machineInfo));
		fixture.detectChanges();
		expect(component).toBeTruthy();
	});

	it('should close modal popup', () => {
		activaModal = TestBed.inject(MatDialogRef);
		const spy = spyOn(activaModal, 'close');
		component.closeModal();
		fixture.detectChanges();
		expect(spy).toHaveBeenCalledWith('close');
	});
});
