import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, Directive, Input, ViewChild, ElementRef } from '@angular/core';

import { ModalRebootConfirmComponent } from './modal-reboot-confirm.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('ModalRebootConfirmComponent', () => {
	let component: ModalRebootConfirmComponent;
	let fixture: ComponentFixture<ModalRebootConfirmComponent>;
	let debugElement;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ModalRebootConfirmComponent],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
			providers: [NgbActiveModal],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ModalRebootConfirmComponent);

		debugElement = fixture.debugElement;

		component = fixture.componentInstance;
		fixture.detectChanges();
	});
});
