import { TestBed } from '@angular/core/testing';

import { WarrantyService } from './warranty.service';
import { TranslationModule } from 'src/app/modules/translation.module';
import { HttpClientModule } from '@angular/common/http';
import { TranslateStore } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { MetricsDirective } from 'src/app/directives/metrics.directive';
import { MetricsModule } from 'src/app/directives/metrics.module';
import { DeviceService } from '../device/device.service';
import { CommonService } from '../common/common.service';
import { VantageShellService } from '../vantage-shell/vantage-shell-mock.service';

xdescribe('WarrantyService', () => {
	beforeEach(() => TestBed.configureTestingModule({
		imports: [RouterTestingModule, TranslationModule, HttpClientModule, MetricsModule],
		providers: [TranslateStore, CommonService, DeviceService, VantageShellService, MetricsDirective]
	}));

	it('should be created', () => {
		const service: WarrantyService = TestBed.get(WarrantyService);
		expect(service).toBeTruthy();
	});
});
