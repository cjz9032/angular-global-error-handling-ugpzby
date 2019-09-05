import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatteryCardComponent } from './battery-card.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateStore } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonService } from 'src/app/services/common/common.service';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslationModule } from 'src/app/modules/translation.module';

describe('BatteryCardComponent', () => {
	let component: BatteryCardComponent;
	let fixture: ComponentFixture<BatteryCardComponent>;
	let commonService: CommonService;
	let debugElement;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [BatteryCardComponent],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [TranslationModule, HttpClientModule, RouterTestingModule],
			providers: [TranslateStore]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BatteryCardComponent);
		debugElement = fixture.debugElement;
		commonService = debugElement.injector.get(CommonService);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
