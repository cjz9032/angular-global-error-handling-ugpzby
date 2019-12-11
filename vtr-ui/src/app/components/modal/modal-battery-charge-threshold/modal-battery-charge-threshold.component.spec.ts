import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';

import { ModalBatteryChargeThresholdComponent } from './modal-battery-charge-threshold.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslationModule } from 'src/app/modules/translation.module';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateStore } from '@ngx-translate/core';

describe('ModalBatteryChargeThresholdComponent', () => {

	let title: string;
	let description1: string;
	let description2: string;
	let positiveResponseText: string;
	let negativeResponseText: string;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ModalBatteryChargeThresholdComponent],
			imports: [FontAwesomeModule, TranslationModule],
			providers: [NgbActiveModal, TranslateStore]
		}).compileComponents();
	}));

	describe(':', () => {

		function setup() {
			const fixture = TestBed.createComponent(ModalBatteryChargeThresholdComponent);
			const component = fixture.debugElement.componentInstance;
			return { fixture, component };
		}

		it('should create the app', (() => {
			const { component } = setup();
			expect(component).toBeTruthy();
		}));

		it('enableBatteryChargeThreshold calling activeModal close', async(() => {
			const { fixture, component } = setup();
			spyOn(component.activeModal, 'close').and.returnValue(Promise.resolve('positive'));

			fixture.detectChanges();//ngOnInit
			component.enableBatteryChargeThreshold();

			expect(component.activeModal.close).toHaveBeenCalled();
		}));

		it('closeModal calling activeModal close', async(() => {
			const { fixture, component } = setup();
			spyOn(component.activeModal, 'close').and.returnValue(Promise.resolve('negative'));

			fixture.detectChanges();//ngOnInit
			component.closeModal();

			expect(component.activeModal.close).toHaveBeenCalled();
		}));

		it('onKeydownHandler calling activeModal close', async(() => {
			const { fixture, component } = setup();
			spyOn(component, 'closeModal');

			fixture.detectChanges();//ngOnInit
			component.onKeydownHandler(KeyboardEvent);

			expect(component.closeModal).toHaveBeenCalled();
		}));

		// it('onFocus calling modal focus', (() => {
		// 	const { fixture, component } = setup();

		// 	fixture.detectChanges();//ngOnInit

		// 	let modal = document.createElement('div');
		// 	modal.setAttribute('class', 'Battery-Charge-Threshold-Modal');
		// 	fixture.debugElement.nativeElement.append(modal);
		// 	component.onFocus();

		// 	expect(modal).toBeTruthy();
		// }));

		it('button clicked called closeModal', async(() => {
			const { fixture, component } = setup();
			spyOn(component, 'closeModal');

			fixture.detectChanges();//ngOnInit
			let button = fixture.debugElement.nativeElement.querySelector('button[id="ds-threshold-popup-close-button"]');
			button.click();
			fixture.whenStable().then(() => {
				expect(component.closeModal).toHaveBeenCalled();
			});
		}));


	});

});

// xdescribe('ModalBatteryChargeThresholdComponent', () => {
// 	let component: ModalBatteryChargeThresholdComponent;
// 	let fixture: ComponentFixture<ModalBatteryChargeThresholdComponent>;

// 	beforeEach(async(() => {
// 		TestBed.configureTestingModule({
// 			declarations: [ModalBatteryChargeThresholdComponent]
// 		})
// 			.compileComponents();
// 	}));

// 	beforeEach(() => {
// 		fixture = TestBed.createComponent(ModalBatteryChargeThresholdComponent);
// 		component = fixture.componentInstance;
// 		fixture.detectChanges();
// 	});

// 	it('should create', () => {
// 		expect(component).toBeTruthy();
// 	});
// });
