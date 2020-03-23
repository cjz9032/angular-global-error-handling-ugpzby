import { NO_ERRORS_SCHEMA } from "@angular/core";
import { async, TestBed, ComponentFixture } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";

import { BacklightComponent } from "./backlight.component";
import { BacklightLevel, BacklightStatus } from "./backlight.interface";
import { RemoveSpacePipe } from "../../../../../../pipe/remove-space/remove-space.pipe";
import { BacklightLevelEnum, BacklightStatusEnum } from "./backlight.enum";

import { BacklightService } from "./backlight.service";
import { VantageShellService } from "../../../../../../services/vantage-shell/vantage-shell.service";
import { DevService } from "src/app/services/dev/dev.service";
import { CommonService } from "src/app/services/common/common.service";
import { MetricService } from '../../../../../../services/metric/metric.service';

import { TranslateModule } from "@ngx-translate/core";
import { of } from "rxjs";

class MockMetricService {
    sendMetrics() {
        return;
    }
}

describe("Backlight", () => {
	let component: BacklightComponent;
	let fixture: ComponentFixture<BacklightComponent>;
	let backlightService: BacklightService;
	let devService: DevService;
	let commonService: CommonService;
    let shellService: VantageShellService;
    let metric: MetricService

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			schemas: [NO_ERRORS_SCHEMA],
			declarations: [BacklightComponent, RemoveSpacePipe],
			imports: [TranslateModule.forRoot(), HttpClientTestingModule],
			providers: [
				VantageShellService,
				BacklightService,
				DevService,
                CommonService,
                {provide: MetricService, useClass: MockMetricService}
			]
		});
	}));

	it("should create Backlight Component", async(() => {      
		fixture = TestBed.createComponent(BacklightComponent);
        component = fixture.componentInstance;
		fixture.detectChanges();
		expect(component).toBeTruthy();
    }));
    
    it('should call onToggleOnOff - when switchValue is true', async(() => {
        fixture = TestBed.createComponent(BacklightComponent);
        component = fixture.componentInstance;
        const event = {
            switchValue: true
        }
        const spy = spyOn(component.update$, 'next')
        component.onToggleOnOff(event)
        expect(spy).toHaveBeenCalled()
    }));

    it('should call onToggleOnOff - when no switchValue', async(() => {
        fixture = TestBed.createComponent(BacklightComponent);
        component = fixture.componentInstance;
        const event = {}
        component.onToggleOnOff(event)
        const spy = spyOn(component.update$, 'next')
        component.onToggleOnOff(event)
        expect(spy).toHaveBeenCalled()
    }));
})