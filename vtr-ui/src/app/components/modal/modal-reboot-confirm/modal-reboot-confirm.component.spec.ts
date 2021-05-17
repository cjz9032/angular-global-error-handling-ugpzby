import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogRef } from '@lenovo/material/dialog';

import { ModalRebootConfirmComponent } from './modal-reboot-confirm.component';

describe('ModalRebootConfirmComponent', () => {
	let component: ModalRebootConfirmComponent;
	let fixture: ComponentFixture<ModalRebootConfirmComponent>;
	let debugElement;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [ModalRebootConfirmComponent],
				schemas: [NO_ERRORS_SCHEMA],
				imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
				providers: [MatDialogRef],
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(ModalRebootConfirmComponent);

		debugElement = fixture.debugElement;

		component = fixture.componentInstance;
		fixture.detectChanges();
	});
});
