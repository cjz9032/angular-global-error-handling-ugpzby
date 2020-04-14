import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AntiTheftComponent } from './anti-theft.component';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { SmartAssistService } from 'src/app/services/smart-assist/smart-assist.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { Router, NavigationExtras } from '@angular/router';
import { DeviceService } from 'src/app/services/device/device.service';
import { DisplayService } from 'src/app/services/display/display.service';
import { DropDownInterval } from '../../../../data-models/common/drop-down-interval.model';
import { TranslateService } from '@ngx-translate/core';
import { MetricService } from 'src/app/services/metric/metric.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { RouterTestingModule } from "@angular/router/testing";
import { RouteHandlerService } from 'src/app/services/route-handler/route-handler.service';
import { DevService } from 'src/app/services/dev/dev.service';

describe('component: AntiTheftComponent', () => {
  let component: AntiTheftComponent;
  let fixture: ComponentFixture<AntiTheftComponent>;
  let smartAssist: SmartAssistService;
  let logger: LoggerService;
  let router: Router;
  let deviceService: DeviceService;
  let displayService: DisplayService;
  let translate: TranslateService;
  let metrics: MetricService;
  let navigationExtras: NavigationExtras;
  let vantageShellService: VantageShellService;
  let cameraAccessChangedHandler: any;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AntiTheftComponent],
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
    fixture = TestBed.createComponent(AntiTheftComponent);
    smartAssist = TestBed.get(SmartAssistService);
    component = fixture.componentInstance;
    metrics = TestBed.get(MetricService);
    logger = TestBed.get(LoggerService);
    vantageShellService = TestBed.get(VantageShellService);
    smartAssist.windows = vantageShellService.getWindows();
    cameraAccessChangedHandler
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("setAntiTheftStatus", () => {
    smartAssist = TestBed.get(SmartAssistService);
    smartAssist.isShellAvailable = true;
    const spy = spyOn(
      smartAssist,
      "setAntiTheftStatus"
    ).and.returnValue(Promise.resolve(true));

    component.setAntiTheftStatus(true);
    expect(smartAssist.setAntiTheftStatus).toHaveBeenCalled();
  });

  it("setAlarmOften", () => {
    smartAssist = TestBed.get(SmartAssistService);
    smartAssist.isShellAvailable = true;
    const spy = spyOn(
      smartAssist,
      "setAlarmOften"
    ).and.returnValue(Promise.resolve(true));

    component.setAlarmOften(1);
    expect(smartAssist.setAlarmOften).toHaveBeenCalled();
  });

  it("setPhotoNumber", () => {
    smartAssist = TestBed.get(SmartAssistService);
    smartAssist.isShellAvailable = true;
    const spy = spyOn(
      smartAssist,
      "setPhotoNumber"
    ).and.returnValue(Promise.resolve(true));

    component.setPhotoNumber(1);
    expect(smartAssist.setPhotoNumber).toHaveBeenCalled();
  });

  it("setAllowCamera", () => {
    smartAssist = TestBed.get(SmartAssistService);
    smartAssist.isShellAvailable = true;
    const spy = spyOn(
      smartAssist,
      "setAllowCamera"
    ).and.returnValue(Promise.resolve(true));

    component.setAllowCamera(true);
    expect(smartAssist.setAllowCamera).toHaveBeenCalled();
  });

  it("showCameraPrivacyPage", () => {
    router = TestBed.get(Router);
    component.showCameraPrivacyPage();
  });

  it("showCameraAuthorizedAccess", () => {
    deviceService = TestBed.get(DeviceService);
    component.showCameraAuthorizedAccess();
  });

  it("showPhotoFolder", () => {
    smartAssist = TestBed.get(SmartAssistService);
    smartAssist.isShellAvailable = true;
    component.showPhotoFolder("C://");
  });

  it("showAccessingFileSystem", () => {
    deviceService = TestBed.get(DeviceService);
    component.showAccessingFileSystem();
  });

  it("cameraAuthorizedChange", () => {
    component.cameraAuthorizedChange({ status: true });
  });

  it("cameraPrivacyChange", () => {
    component.cameraPrivacyChange({ status: true });
  });

  it("onRightIconClick", () => {
    component.onRightIconClick('', '');
  });

  it("toggleToolTip", () => {
    let tooltip = { isOpen() { return true; }, close() { } }
    component.toggleToolTip(tooltip, false);
  });

  it("toggleToolTip", () => {
    let tooltip = { isOpen() { return false; }, open() { } }
    component.toggleToolTip(tooltip, true);
  });

});
