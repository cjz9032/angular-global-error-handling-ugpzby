import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRebootConfirmComponent } from './modal-reboot-confirm.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

xdescribe('ModalRebootConfirmComponent', () => {
	let component: ModalRebootConfirmComponent;
	let fixture: ComponentFixture<ModalRebootConfirmComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ModalRebootConfirmComponent],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [
				TranslateModule.forRoot(),
				HttpClientTestingModule,
				RouterTestingModule
			],
			providers: [NgbActiveModal]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ModalRebootConfirmComponent);
		component = fixture.componentInstance;
		/*
				const close = document.createElement('button');
				close.id = 'btnClose';
				fixture.debugElement.nativeElement.append(close); */
		fixture.detectChanges();
	});

	it('should create', () => {
		component.btnClose = fixture.debugElement.nativeElement.querySelector('#btnClose');
		expect(component).toBeTruthy();
	});
});
