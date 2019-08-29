import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatteryIndicatorComponent } from './battery-indicator.component';
import { TranslationModule } from 'src/app/modules/translation.module';
import { TranslateStore } from '@ngx-translate/core';

describe('BatteryIndicatorComponent', () => {
	let component: BatteryIndicatorComponent;
	let fixture: ComponentFixture<BatteryIndicatorComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [BatteryIndicatorComponent],
			imports: [TranslationModule],
			providers: [TranslateStore]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BatteryIndicatorComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('#ngOnInit should call getCssDeclaration, refreshLevel, checkRemainingTimeIsZero', () => {
		spyOn(component, 'getCssDeclaration');
		spyOn(component, 'refreshLevel');
		spyOn(component, 'checkRemainingTimeIsZero');
		component.ngOnInit();
		expect(component.getCssDeclaration).toHaveBeenCalled();
		expect(component.refreshLevel).toHaveBeenCalled();
		expect(component.checkRemainingTimeIsZero).toHaveBeenCalled();
	});

	it('#refreshLevel should set battery percentage to  50', () => {
		component.percentage = 50;
		component.batteryNotDetected = false;
		spyOn(component, 'getLevelCssValues').and.returnValues(
			{
				borderColor: ' rgba(49, 228, 182, 0.4)',
				borderShadowColor: ' rgba(49, 228, 182, 0.4)',
				fillColor: ' linear-gradient( 315deg, #35e6b9 0%, #2ecc71 100% )'

			});
		component.refreshLevel();
		expect(component.getLevelCssValues).toHaveBeenCalledWith(component.percentage);
		// expect(component.batteryIndicator.nativeElement.style.cssText).toBe('--border-shadow-color: rgba(49, 228, 182, 0.4); --border-color: rgba(49, 228, 182, 0.4); --acid-fill-gradient: linear-gradient( 315deg, #35e6b9 0%, #2ecc71 100% ); --acid-width:calc(50% - 0.85rem)');
	});

	it('#refreshLevel should set battery percentage to  22', () => {
		component.percentage = 22;
		component.batteryNotDetected = false;
		spyOn(component, 'getLevelCssValues').and.returnValues(
			{
				borderColor: ' rgba(255, 165, 0, 0.4)',
				borderShadowColor: ' rgba(255, 165, 0, 0.4)',
				fillColor: ' linear-gradient( 315deg, #fad961 0%, #ffaf00 100% );'
			});
		component.refreshLevel();
		expect(component.getLevelCssValues).toHaveBeenCalledWith(component.percentage);
		// expect(component.batteryIndicator.nativeElement.style.cssText).toEqual('--border-shadow-color: rgba(255, 165, 0, 0.4); --border-color: rgba(255, 165, 0, 0.4); --acid-fill-gradient: linear-gradient( 315deg, #fad961 0%, #ffaf00 100% ); --acid-width:calc(22% - 0.85rem);');
	});

	it('#refreshLevel should set battery percentage to  11', () => {
		component.percentage = 11;
		component.batteryNotDetected = false;
		spyOn(component, 'getLevelCssValues').and.returnValues(
			{
				borderColor: ' rgba(217, 72, 57, 0.4)',
				borderShadowColor: ' rgba(217, 72, 57, 0.4)',
				fillColor: ' linear-gradient( 315deg, #f17f14 0%, #ed4e04 100% )'
			});
		component.refreshLevel();
		expect(component.getLevelCssValues).toHaveBeenCalledWith(component.percentage);
		// expect(component.batteryIndicator.nativeElement.style.cssText).toEqual('--border-shadow-color: rgba(217, 72, 57, 0.4); --border-color: rgba(217, 72, 57, 0.4); --acid-fill-gradient: linear-gradient( 315deg, #f17f14 0%, #ed4e04 100% ); --acid-width:calc(11% - 0.85rem);');

	});
});
