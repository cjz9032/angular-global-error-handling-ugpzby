import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SmartAssistService } from 'src/app/services/smart-assist/smart-assist.service';
import { IntelligentMediaComponent } from './intelligent-media.component';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';

import { LoggerService } from 'src/app/services/logger/logger.service';
import { DeviceService } from 'src/app/services/device/device.service';
import { DisplayService } from 'src/app/services/display/display.service';
import { TranslateService } from '@ngx-translate/core';
import { MetricService } from 'src/app/services/metric/metrics.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { RouterTestingModule } from "@angular/router/testing";
import { RouteHandlerService } from 'src/app/services/route-handler/route-handler.service';
import { DevService } from 'src/app/services/dev/dev.service';

describe('component: IntelligentMediaComponent', () => {
  let component: IntelligentMediaComponent;
  let fixture: ComponentFixture<IntelligentMediaComponent>;
  let smartAssist: SmartAssistService;
  let vantageShellService: VantageShellService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IntelligentMediaComponent],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        RouterTestingModule
      ],
      providers: [
        SmartAssistService,
        LoggerService,
        DeviceService,
        DevService,
        RouteHandlerService,
        DisplayService,
        TranslateService,
        MetricService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntelligentMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("setVideoPauseResumeStatus", () => {
    smartAssist = TestBed.get(SmartAssistService);
    smartAssist.isShellAvailable = true;
    const spy = spyOn(
      smartAssist,
      "setVideoPauseResumeStatus"
    ).and.returnValue(Promise.resolve(true));

    component.setVideoPauseResumeStatus({ switchValue: true });
    expect(smartAssist.setVideoPauseResumeStatus).toHaveBeenCalled();
  });

  it("setSuperResolutionStatus", () => {
    smartAssist = TestBed.get(SmartAssistService);
    smartAssist.isShellAvailable = true;
    const spy = spyOn(
      smartAssist,
      "setSuperResolutionStatus"
    ).and.returnValue(Promise.resolve(true));

    component.setSuperResolutionStatus({ switchValue: true });
    expect(smartAssist.setSuperResolutionStatus).toHaveBeenCalled();
  });
});
