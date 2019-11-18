import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {  TranslateStore } from '@ngx-translate/core';

import { BatteryGaugeResetComponent } from './battery-gauge-reset.component';
import { TranslationModule } from 'src/app/modules/translation.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';
describe('BatteryGaugeResetComponent', () => {
    let component: BatteryGaugeResetComponent;
    let fixture: ComponentFixture<BatteryGaugeResetComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BatteryGaugeResetComponent],
            imports: [TranslationModule.forChild()],
            providers: [TranslateStore],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BatteryGaugeResetComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
