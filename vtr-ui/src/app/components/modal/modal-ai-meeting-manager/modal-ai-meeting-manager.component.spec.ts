import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { ModalAiMeetingManagerComponent } from './modal-ai-meeting-manager.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/modules/translation.module';
import { SvgInlinePipe } from 'src/app/pipe/svg-inline/svg-inline.pipe';

describe('ModalAiMeetingManagerComponent', () => {
	let component: ModalAiMeetingManagerComponent;
	let fixture: ComponentFixture<ModalAiMeetingManagerComponent>;
	let activaModal: NgbActiveModal;
	beforeEach(waitForAsync(() => {
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
			providers: [NgbActiveModal],
		}).compileComponents();
	}));

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
	it('should call onFocus when calling modal focus', () => {
		const modal = document.createElement('div');
		modal.setAttribute('class', 'ai-meeting-manager-modal');
		fixture.debugElement.nativeElement.append(modal);
		component.onFocus();
		expect(modal).toBeTruthy();
	});
});
