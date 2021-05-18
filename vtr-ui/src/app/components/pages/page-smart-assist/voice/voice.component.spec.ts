import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

import { MatDialog } from '@lenovo/material/dialog';

import { SmartAssistService } from 'src/app/services/smart-assist/smart-assist.service';
import { LoggerService } from 'src/app/services/logger/logger.service';

import { VoiceComponent } from './voice.component';

describe('VoiceComponent', () => {
	let component: VoiceComponent;
	let fixture: ComponentFixture<VoiceComponent>;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [VoiceComponent],
				schemas: [NO_ERRORS_SCHEMA],
				imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
				providers: [SmartAssistService, LoggerService, MatDialog],
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(VoiceComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
