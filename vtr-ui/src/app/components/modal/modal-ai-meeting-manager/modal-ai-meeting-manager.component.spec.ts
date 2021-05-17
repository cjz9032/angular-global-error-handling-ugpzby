import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef } from '@lenovo/material/dialog';
import { TranslateModule, TranslateService, TranslateLoader } from '@ngx-translate/core';

import { ModalAiMeetingManagerComponent } from './modal-ai-meeting-manager.component';
import { HttpLoaderFactory } from 'src/app/modules/translation.module';
import { SvgInlinePipe } from 'src/app/pipe/svg-inline/svg-inline.pipe';

describe('ModalAiMeetingManagerComponent', () => {
	let component: ModalAiMeetingManagerComponent;
	let fixture: ComponentFixture<ModalAiMeetingManagerComponent>;
	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				schemas: [NO_ERRORS_SCHEMA],
				imports: [
					TranslateModule.forRoot({
						loader: {
							provide: TranslateLoader,
							useFactory: HttpLoaderFactory,
							deps: [HttpClient],
						},
					}),
					HttpClientTestingModule,
					RouterTestingModule,
				],
				declarations: [ModalAiMeetingManagerComponent, SvgInlinePipe],
				providers: [MatDialogRef],
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(ModalAiMeetingManagerComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		component.value = '';
		fixture.detectChanges();
		expect(component).toBeDefined();
	});
	it('should call clode modal', () => {
		component.closeModal();
	});
});
