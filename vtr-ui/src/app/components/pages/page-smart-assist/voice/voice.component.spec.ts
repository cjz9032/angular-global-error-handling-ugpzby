import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { VoiceComponent } from './voice.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SmartAssistService } from 'src/app/services/smart-assist/smart-assist.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

describe('VoiceComponent', () => {
	let component: VoiceComponent;
	let fixture: ComponentFixture<VoiceComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [VoiceComponent],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [
				TranslateModule.forRoot(),
				HttpClientTestingModule,
				RouterTestingModule
			],
			providers: [SmartAssistService, LoggerService, NgbModal]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(VoiceComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
