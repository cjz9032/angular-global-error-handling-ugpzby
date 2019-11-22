import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiDaysPickerComponent } from './ui-days-picker.component';
import { SmartStandbyService } from 'src/app/services/smart-standby/smart-standby.service';
import { CommonService } from 'src/app/services/common/common.service';
import { NO_ERRORS_SCHEMA, SimpleChanges } from '@angular/core';
import { TranslationModule } from 'src/app/modules/translation.module';
import { TranslateStore } from '@ngx-translate/core';
import { CommonPipeModule } from 'src/app/modules/common/common-pipe.module';

fdescribe('UiDaysPickerComponent', () => {
	let component: UiDaysPickerComponent;
	let fixture: ComponentFixture<UiDaysPickerComponent>;
	let commonService:CommonService;
	let listbox=  document.createElement('div') as HTMLElement;
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UiDaysPickerComponent],
			schemas:[NO_ERRORS_SCHEMA],
			imports: [
				TranslationModule.forChild(), CommonPipeModule],
			providers: [TranslateStore]
		})
			.compileComponents();
	}));
	describe(':', () => {
		function setup() {
            const fixture = TestBed.createComponent(UiDaysPickerComponent);
            const component = fixture.debugElement.componentInstance;
            const smartStandbyService = fixture.debugElement.injector.get(SmartStandbyService);
			const commonService = fixture.debugElement.injector.get(CommonService);
            return { fixture, component, smartStandbyService,commonService };
        }

		it('should create the app', (() => {
            const { component } = setup();
            expect(component).toBeTruthy();
		}));

		 	// it(' sendToggleNotification ', async(() => {
			// 	const { fixture, component } = setup();
				
			// 	spyOn(component,'sendToggleNotification');
			// 	fixture.detectChanges();
				
			// 	component.sendNotification();
			// 	expect(component.sendToggleNotification).toHaveBeenCalled();

			//  }));
			 it(' ngOnInit ', (() => {
				const { fixture, component,smartStandbyService } = setup();
				
				spyOn(smartStandbyService,'splitDays');
				fixture.detectChanges();
				//component.ngOnInit();
				
				expect(smartStandbyService.splitDays).toHaveBeenCalled();
			 }));
		
			 it(' ngOnChanges ', (() => {
				const { fixture, component,smartStandbyService } = setup();
				
				spyOn(smartStandbyService,'splitDays');
				fixture.detectChanges();
				
				let changes: SimpleChanges;
				component.ngOnChanges(changes);
				expect(smartStandbyService.splitDays).toHaveBeenCalled();
			 }));
			
			it(' onToggleDropDown ', (() => {
				const { fixture, component,smartStandbyService } = setup();
				
				spyOn(smartStandbyService,'splitDays');
				fixture.detectChanges();
				
				
				component.onToggleDropDown();
				expect(smartStandbyService.splitDays).toHaveBeenCalled();
			 }));
			 it(' clearSettings ', (() => {
				const { fixture, component,smartStandbyService } = setup();
				
				spyOn(smartStandbyService,'splitDays');
				fixture.detectChanges();
				//spyOn(component,'focus');
				//fixture.detectChanges();
				

				component.clearSettings(listbox);
				expect(smartStandbyService.splitDays).toHaveBeenCalled();
				
			 }));

			//  it(' selectDay ', (() => {
			// 	const { fixture, component,smartStandbyService } = setup();
				
				
			// 	//spyOn(component.smartStandbyService.selectedDays,'splice');
			// 	fixture.detectChanges();
				
			// 	let event=new Event('click');
			// 	event.target['checked']=true;
			// 	event.target['value']=30;
			// 	component.smartStandbyService.days='sunday,monday,tuesday';
			// 	component.selectDay(event);
				
			// 	expect(component.smartStandbyService.checkedLength ).toEqual(component.smartStandbyService.selectedDays.length);
			//  }));
			// it(' sendToggleNotification ',async(() => {
			// 	const { fixture, component } = setup();
				
			// 	spyOn(component,'sendToggleNotification');
			// 	fixture.detectChanges();
				
				

			// 	component.setOffDays(listbox);
			// 	expect(component.sendToggleNotification).toHaveBeenCalled();
				
			//  }));

});


});