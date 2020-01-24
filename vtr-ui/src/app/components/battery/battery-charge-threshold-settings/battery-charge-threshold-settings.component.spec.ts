import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatteryChargeThresholdSettingsComponent } from './battery-charge-threshold-settings.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslationModule } from 'src/app/modules/translation.module';
import { TranslateStore } from '@ngx-translate/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SecureMath } from '@lenovo/tan-client-bridge';
import { FormsModule } from '@angular/forms';

describe('BatteryChargeThresholdSettingsComponent', () => {
	//let component: BatteryChargeThresholdSettingsComponent;
	//let fixture: ComponentFixture<BatteryChargeThresholdSettingsComponent>;
	let isCheckedAuto: any;
	let textId = 'threshold-primary-battery';
	let startAtChargeOptions = [40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95];
	let stopAtChargeOptions = [45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];
	let selectedStartAtCharge = 10;
	let selectedStopAtCharge = 90;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [BatteryChargeThresholdSettingsComponent],
			imports: [FontAwesomeModule, TranslationModule, FormsModule],
			providers: [NgbActiveModal, TranslateStore, SecureMath]
		}).compileComponents();
	}));

	describe(':', () => {

		function setup() {
			const fixture = TestBed.createComponent(BatteryChargeThresholdSettingsComponent);
			const component = fixture.debugElement.componentInstance;
			//const componentElement = fixture.debugElement.nativeElement;
			return { fixture, component };
		}

		it('should create the app', (() => {
			const { component } = setup();
			expect(component).toBeTruthy();
		}));

		it('should test startAtCharge triggers onChargeChange', async(() => {
			const { fixture, component } = setup();
			spyOn(component, 'onChargeChange');
			component.textId = textId;
			component.startAtChargeOptions = startAtChargeOptions;
			component.stopAtChargeOptions = stopAtChargeOptions;
			fixture.detectChanges();

			let button = fixture.debugElement.nativeElement.querySelector('a[id^="' + textId + '-startAtChargeOption"]');
			button.click();
			fixture.whenStable().then(() => {
				expect(component.onChargeChange).toHaveBeenCalled();
			});

		}));

		it('should test stopAtCharge triggers onChargeChange', async(() => {
			const { fixture, component } = setup();
			spyOn(component, 'onChargeChange');
			component.textId = textId;
			component.startAtChargeOptions = startAtChargeOptions;
			component.stopAtChargeOptions = stopAtChargeOptions;
			fixture.detectChanges();

			let button = fixture.debugElement.nativeElement.querySelector('a[id^="' + textId + '-stopAtCharge"]');
			button.click();
			fixture.whenStable().then(() => {
				expect(component.onChargeChange).toHaveBeenCalled();
			});
		}));

		//for Case A & Case B
		it('should test onChargeChange method sets values and calls methods', () => {
			const { fixture, component } = setup();
			spyOn(component, 'autoStartStopAtCharge');
			spyOn(component, 'toggleAutoChargeSettings');
			component.textId = textId;
			component.startAtChargeOptions = startAtChargeOptions;
			component.stopAtChargeOptions = stopAtChargeOptions;
			component.selectedStartAtCharge = selectedStartAtCharge;
			component.selectedStopAtCharge = selectedStopAtCharge;
			component.isCheckedAuto = false;
			fixture.detectChanges();

			let newCharge = 25;
			let startToggle = fixture.debugElement.nativeElement.querySelector('button[id^="' + textId + '-start-dropdown"]');
			let endToggle = fixture.debugElement.nativeElement.querySelector('button[id^="' + textId + '-stop-dropdown"]');
			//case A =>
			component.onChargeChange('startAtCharge', newCharge, new Event('click'), startToggle);
			expect(component.selectedStartAtCharge).toEqual(newCharge);
			expect(component.selectedOptionsData).toEqual({
				startValue: newCharge,
				stopValue: selectedStopAtCharge,
				checkboxValue: false
			});

			//case B
			component.isCheckedAuto = true;
			component.onChargeChange('stopAtCharge', newCharge, new Event('click'), endToggle);
			expect(component.selectedStopAtCharge).toEqual(newCharge);
			expect(component.autoStartStopAtCharge).toHaveBeenCalled();
			expect(component.toggleAutoChargeSettings).toHaveBeenCalled();
		});

		it('should test autoStartStopAtCharge', async(() => {
			const { fixture, component } = setup();
			component.textId = textId;
			component.startAtChargeOptions = startAtChargeOptions;
			component.stopAtChargeOptions = stopAtChargeOptions;
			component.selectedStartAtCharge = selectedStartAtCharge;
			component.selectedStopAtCharge = selectedStopAtCharge;
			fixture.detectChanges();

			component.autoStartStopAtCharge();
			expect(component.selectedStartAtCharge).toEqual(selectedStopAtCharge-5);
		}));

		it('should test toggleAutoChargeSettings', async(() => {
			const { fixture, component } = setup();
			spyOn(component, 'autoStartStopAtCharge');
			component.textId = textId;
			component.startAtChargeOptions = startAtChargeOptions;
			component.stopAtChargeOptions = stopAtChargeOptions;
			component.selectedStartAtCharge = selectedStartAtCharge;
			component.selectedStopAtCharge = selectedStopAtCharge;
			fixture.detectChanges();

			component.toggleAutoChargeSettings('testing');
			expect(component.autoStartStopAtCharge).toHaveBeenCalled();
		}));


	});


	// beforeEach(async(() => {
	// 	TestBed.configureTestingModule({
	// 		declarations: [BatteryChargeThresholdSettingsComponent]
	// 	})
	// 		.compileComponents();
	// }));

	// beforeEach(() => {
	// 	fixture = TestBed.createComponent(BatteryChargeThresholdSettingsComponent);
	// 	component = fixture.componentInstance;
	// 	fixture.detectChanges();
	// });

	// it('should create', () => {
	// 	expect(component).toBeTruthy();
	// });
});
