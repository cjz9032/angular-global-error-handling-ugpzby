import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { MatDialogRef } from '@lenovo/material/dialog';

import { ModalVoiceComponent } from './modal-voice.component';

import { HttpLoaderFactory } from 'src/app/modules/translation.module';
import { SvgInlinePipe } from 'src/app/pipe/svg-inline/svg-inline.pipe';

describe('ModalVoiceComponent', () => {
	let component: ModalVoiceComponent;
	let fixture: ComponentFixture<ModalVoiceComponent>;
	let activaModal: MatDialogRef<ModalVoiceComponent>;
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
				declarations: [ModalVoiceComponent, SvgInlinePipe],
				providers: [MatDialogRef],
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(ModalVoiceComponent);
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
	it('should call onFocus when calling modal focus', () => {
		const modal = document.createElement('div');
		modal.setAttribute('class', 'Voice-Modal');
		fixture.debugElement.nativeElement.append(modal);
		component.onFocus();
		expect(modal).toBeTruthy();
	});
});
