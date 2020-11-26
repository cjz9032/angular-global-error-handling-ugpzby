import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SvgInlinePipe } from 'src/app/pipe/svg-inline/svg-inline.pipe';
import { BatteryDetailService } from 'src/app/services/battery-detail/battery-detail.service';
import { ModalBatteryChargeThresholdComponent } from './modal-battery-charge-threshold.component';

describe('ModalBatteryChargeThresholdComponent', () => {
	/* 	let title: string;
		let description1: string;
		let description2: string;
		let positiveResponseText: string;
		let negativeResponseText: string; */
	let batteryDetailService: BatteryDetailService;
	let activeModal;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ModalBatteryChargeThresholdComponent, SvgInlinePipe],
			imports: [FontAwesomeModule, TranslateModule.forRoot(), HttpClientTestingModule],
			providers: [NgbActiveModal, BatteryDetailService, TranslateService],
		}).compileComponents();
	}));

	describe(':', () => {
		function setup() {
			const fixture = TestBed.createComponent(ModalBatteryChargeThresholdComponent);
			const component = fixture.debugElement.componentInstance;
			return { fixture, component };
		}

		it('should create the app', () => {
			const { fixture, component } = setup();
			const translate = TestBed.inject(TranslateService);
			const spy = spyOn(translate, 'instant');
			batteryDetailService = TestBed.inject(BatteryDetailService);
			batteryDetailService.currentOpenModal = '1';
			fixture.detectChanges();
			expect(component).toBeTruthy();
		});

		it('enableBatteryChargeThreshold calling activeModal close', async(() => {
			const { fixture, component } = setup();
			activeModal = TestBed.inject(NgbActiveModal);
			const spy = spyOn(activeModal, 'close');
			component.enableBatteryChargeThreshold();
			expect(spy).toHaveBeenCalled();
		}));

		it('closeModal calling activeModal close', async(() => {
			const { fixture, component } = setup();
			spyOn(component.activeModal, 'close').and.returnValue(Promise.resolve('negative'));
			component.closeModal();
			expect(component.activeModal.close).toHaveBeenCalled();
		}));

		it('onKeydownHandler calling activeModal close', async(() => {
			const { fixture, component } = setup();
			spyOn(component, 'closeModal');
			component.onKeydownHandler(KeyboardEvent);
			expect(component.closeModal).toHaveBeenCalled();
		}));
	});
});
