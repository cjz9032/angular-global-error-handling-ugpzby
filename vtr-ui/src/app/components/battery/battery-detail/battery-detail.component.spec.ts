import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatteryDetailComponent } from './battery-detail.component';
import { BatteryIndicatorComponent } from '../battery-indicator/battery-indicator.component';
import { TranslationModule } from 'src/app/modules/translation.module';
import { TranslateStore } from '@ngx-translate/core';
import { MinutesToHourminPipe } from 'src/app/pipe/minutes-to-hourmin.pipe';
import BatteryIndicator from 'src/app/data-models/battery/battery-indicator.model';

fdescribe('BatteryDetailComponent', () => {
	let component: BatteryDetailComponent;
	let fixture: ComponentFixture<BatteryDetailComponent>;
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [BatteryDetailComponent, BatteryIndicatorComponent, MinutesToHourminPipe],
			imports: [TranslationModule],
			providers: [TranslateStore]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BatteryDetailComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		component.batteryIndicator = new BatteryIndicator();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
