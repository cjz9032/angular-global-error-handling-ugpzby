import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ModalSmartPerformanceCancelComponent } from './modal-smart-performance-cancel.component';
import { SmartPerformanceService } from 'src/app/services/smart-performance/smart-performance.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { CommonService } from 'src/app/services/common/common.service';

import { TranslateModule } from '@ngx-translate/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { By } from '@angular/platform-browser';

describe('ModalSmartPerformanceCancelComponent', () => {
	let component: ModalSmartPerformanceCancelComponent;
	let fixture: ComponentFixture<ModalSmartPerformanceCancelComponent>;
	let smartPerformanceService: SmartPerformanceService;
	let commonService: CommonService;
	let activeModal: NgbActiveModal;
	let modal: DebugElement;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ModalSmartPerformanceCancelComponent],
			imports: [HttpClientTestingModule, RouterTestingModule, TranslateModule.forRoot()],
			schemas: [NO_ERRORS_SCHEMA],
			providers: [NgbActiveModal, SmartPerformanceService, VantageShellService],
		});
		fixture = TestBed.createComponent(ModalSmartPerformanceCancelComponent);
		component = fixture.componentInstance;
	}));

	it('should create ModalSmartPerformanceCancelComponent', fakeAsync(() => {
		smartPerformanceService = TestBed.inject(SmartPerformanceService);
		spyOn(smartPerformanceService, 'cancelScan').and.returnValue(Promise.resolve(true));
		component.secondsCountdown = 0;
		fixture.detectChanges();
		tick(1000);
		expect(component).toBeTruthy();
	}));

	it('should create ModalSmartPerformanceCancelComponent - else case', fakeAsync(() => {
		smartPerformanceService = TestBed.inject(SmartPerformanceService);
		spyOn(smartPerformanceService, 'cancelScan').and.returnValue(Promise.resolve(false));
		component.secondsCountdown = 9;
		fixture.detectChanges();
		tick(10000);
		expect(component).toBeTruthy();
	}));

	it('should close modal', () => {
		component['timerRef'] = true;
		activeModal = TestBed.inject(NgbActiveModal);
		const spy = spyOn(activeModal, 'close');
		component.closeModal();
		expect(spy).toHaveBeenCalled();
	});

	it('should close modal - else case', () => {
		component['timerRef'] = false;
		activeModal = TestBed.inject(NgbActiveModal);
		const spy = spyOn(activeModal, 'close');
		component.closeModal();
		expect(spy).toHaveBeenCalled();
	});

	it('should call onAgree', () => {
		component['timerRef'] = true;
		activeModal = TestBed.inject(NgbActiveModal);
		const spy = spyOn(activeModal, 'close');
		component.onAgree();
		expect(spy).toHaveBeenCalled();
	});

	it('should call onAgree - else case', () => {
		component['timerRef'] = false;
		activeModal = TestBed.inject(NgbActiveModal);
		const spy = spyOn(activeModal, 'close');
		component.onAgree();
		expect(spy).toHaveBeenCalled();
	});

	it('should call cancelScan', () => {
		component['timerRef'] = false;
		const spy = spyOn<any>(component, 'stopCountdown');
		component.cancelScan();
		expect(spy).not.toHaveBeenCalled();
	});

	it('should call onFocus when calling modal focus', () => {
		const modalDiv = document.createElement('div');
		modalDiv.setAttribute('class', 'cancel-modal');
		fixture.debugElement.nativeElement.append(modal);
		component.onFocus();
		expect(modal).toBeTruthy();
	});
});
