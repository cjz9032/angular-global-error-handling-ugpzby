// import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// import { UiSmartPerformanceComponent } from './ui-smart-performance.component';
// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import { TranslationModule } from 'src/app/modules/translation.module';
// import { TranslateStore } from '@ngx-translate/core';
// import { SmartPerformanceService } from 'src/app/services/smart-performance/smart-performance.service';

// describe('UiSmartPerformanceComponent', () => {
// 	let component: UiSmartPerformanceComponent;
// 	let fixture: ComponentFixture<UiSmartPerformanceComponent>;

// 	beforeEach(async(() => {
// 		TestBed.configureTestingModule({
// 			declarations: [UiSmartPerformanceComponent],
// 			schemas: [NO_ERRORS_SCHEMA],
// 			imports: [TranslationModule],
// 			providers: [TranslateStore]
// 		})
// 			.compileComponents();
// 	}));

// 	describe(':', () => {

// 		function setup() {
// 			const fixture = TestBed.createComponent(UiSmartPerformanceComponent);
//             const component = fixture.debugElement.componentInstance;
//             const smartService = fixture.debugElement.injector.get(SmartPerformanceService);
			
// 			return { fixture, component, smartService };
// 		}

// 		it('should create the app', (() => {
// 			const { component } = setup();
// 			expect(component).toBeTruthy();
// 		}));

// 		// it('should test changeScanStatus ', () => {
// 		// 	const { fixture, component } = setup();
// 		// 	// spyOn(component, 'changeScanStatus');
//         //     component.changeScanStatus();
// 		// 	fixture.detectChanges();
// 		// 	expect(component.changeScanStatus).toHaveBeenCalled();
//         // });
        
//         it('should test changeScanStatus ', () => {
//             const { fixture, component } = setup();
//             // spyOn(component, 'changeScanStatus');
//             let $event = {
// 				rating: 4,
// 				tune: 15,
// 				boost: 50,
// 				secure: 12,
// 			}
// 			component.changeScanStatus($event);
// 			expect(component.rating).toEqual($event.rating)
// 			expect(component.tune).toEqual($event.tune)
// 			expect(component.boost).toEqual($event.boost)
// 			expect(component.secure).toEqual($event.secure)
//             // fixture.detectChanges();
//             // expect(component.changeScanStatus).toHaveBeenCalled();
// 		});
		
// 		it('should call changeScanEvent', () => {
// 			const { fixture, component } = setup();
// 			component.changeScanEvent()
// 			expect(component.isScanning).toEqual(true)
// 		})
        
//         it('#ScanNow should call', () => {
// 			const { fixture, component, smartService } = setup();
// 			component.smartPerformanceService.isShellAvailable = true;
//             spyOn(smartService, 'getReadiness').and.returnValue(Promise.resolve(true));
//             fixture.detectChanges();
//             component.ScanNow();
//             expect(smartService.getReadiness).toHaveBeenCalled();
//         });

// 	});
// });
