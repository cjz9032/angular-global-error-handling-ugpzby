import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiSmartPerformanceComponent } from './ui-smart-performance.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslationModule } from 'src/app/modules/translation.module';
import { TranslateStore } from '@ngx-translate/core';
import { SmartPerformanceService } from 'src/app/services/smart-performance/smart-performance.service';

fdescribe('UiSmartPerformanceComponent', () => {
	let component: UiSmartPerformanceComponent;
	let fixture: ComponentFixture<UiSmartPerformanceComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UiSmartPerformanceComponent],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [TranslationModule],
			providers: [TranslateStore]
		})
			.compileComponents();
	}));

	describe(':', () => {

		function setup() {
			const fixture = TestBed.createComponent(UiSmartPerformanceComponent);
            const component = fixture.debugElement.componentInstance;
            const smartService = fixture.debugElement.injector.get(SmartPerformanceService);
			
			return { fixture, component, smartService };
		}

		it('should create the app', (() => {
			const { component } = setup();
			expect(component).toBeTruthy();
		}));

		// it('should test changeScanStatus ', () => {
		// 	const { fixture, component } = setup();
		// 	spyOn(component, 'changeScanStatus');
			
		// 	fixture.detectChanges();
        //     component.changeScanStatus();
		// 	expect(component.changeScanStatus).toHaveBeenCalled();
        // });
        
        it('should test changeScanStatus ', () => {
            const { fixture, component } = setup();
            spyOn(component, 'changeScanStatus');
            
            fixture.detectChanges();
            component.changeScanStatus();
            expect(component.changeScanStatus).toHaveBeenCalled();
        });
        
        it('#ScanNow should call', () => {
            const { fixture, component, smartService } = setup();
            spyOn(smartService, 'getReadiness').and.returnValue(Promise.resolve(true));
            fixture.detectChanges();
            component.ScanNow();
            expect(smartService.getReadiness).toHaveBeenCalled();
        });

	});
});
