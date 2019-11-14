import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSmartStandByComponent } from './modal-smart-stand-by.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslationModule } from 'src/app/modules/translation.module';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateStore } from '@ngx-translate/core';
import { PowerService } from 'src/app/services/power/power.service';
import SmartStandbyActivityModel from 'src/app/data-models/smart-standby-graph/smart-standby-activity.model';
import SmartStandbyActivityDetailModel from 'src/app/data-models/smart-standby-graph/smart-standby-activity-detail.model';

describe('ModalSmartStandByComponent', () => {

    const activities: SmartStandbyActivityModel[] = [
        {
            day: 'sunday',
            activities: [
                {
                    hour: 1,
                    usage: [20, 30, 10]
                }
            ]
        }
    ];

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ModalSmartStandByComponent],
            imports: [FontAwesomeModule, TranslationModule],
            providers: [NgbActiveModal, TranslateStore]
        }).compileComponents();
    }));

    describe(':', () => {

        function setup() {
            const fixture = TestBed.createComponent(ModalSmartStandByComponent);
            const component = fixture.debugElement.componentInstance;
            const powerService = fixture.debugElement.injector.get(PowerService);

            return { fixture, component, powerService };
        }

        it('should create the app', (() => {
            const { component } = setup();
            expect(component).toBeTruthy();
        }));

        it('getActiviesData calling powerService', async(() => {
            const { fixture, component, powerService } = setup();
            spyOn(powerService, 'getSmartStandbyPresenceData').and.returnValue(Promise.resolve(activities));
            spyOn(powerService, 'GetSmartStandbyActiveHours').and.returnValue(Promise.resolve(activities));
            
            component.getActiviesData();
            fixture.detectChanges();
            
            expect(powerService.getSmartStandbyPresenceData).toHaveBeenCalled();
            expect(powerService.GetSmartStandbyActiveHours).toHaveBeenCalled();
        }));

        it('getSmartStandbyActiveHours calling powerService', async(() => {
            const { fixture, component, powerService } = setup();
            spyOn(powerService, 'getSmartStandbyPresenceData').and.returnValue(Promise.resolve(activities));
            spyOn(powerService, 'GetSmartStandbyActiveHours').and.returnValue(Promise.resolve(activities));
            
            component.getSmartStandbyActiveHours();
            fixture.detectChanges();
            
            expect(powerService.getSmartStandbyPresenceData).toHaveBeenCalled();
            expect(powerService.GetSmartStandbyActiveHours).toHaveBeenCalled();
        }));

    });
});
