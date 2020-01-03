import { Gaming } from './../../../enums/gaming.enum';
import { CommonService } from './../../../services/common/common.service';
import { GamingLightingService } from 'src/app/services/gaming/lighting/gaming-lighting.service';
import { DeviceService } from './../../../services/device/device.service';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetLightingComponent } from './widget-lighting.component';
import { NO_ERRORS_SCHEMA, Pipe } from '@angular/core';
import { of } from 'rxjs';

fdescribe('WidgetLightingComponent', () => {
  let component: WidgetLightingComponent;
  let fixture: ComponentFixture<WidgetLightingComponent>;
  const commonServiceMock = {
    getLocalStorageValue: (key, defaultVal) => localStorage.getItem(key),
    setLocalStorageValue: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
    getCapabalitiesNotification: () => of({ type: Gaming.GamingCapabilities })
  };
  const gamingLightingServiceMock = {
    isShellAvailable: true,
    setLightingProfileId: (key1, key2) => Promise.resolve({didSuccess: true}),
    getLightingProfileId: () => Promise.resolve({didSuccess: true, profileId: 1})
  };
  const deviceServiceMock = { getMachineInfo: () => Promise.resolve({}) };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WidgetLightingComponent,
        mockPipe({ name: 'translate' }),
        mockPipe({ name: 'sanitize' })],
      providers: [
        { provide: DeviceService, useValue: deviceServiceMock },
        { provide: GamingLightingService, useValue: gamingLightingServiceMock},
        { provide: CommonService, useValue: commonServiceMock }
      ],
      imports: [HttpClientModule],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(WidgetLightingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check status', () => {
    component.checkStatus(1);
    expect(component.isdriverpopup).toBe(true);
  });

  it('should get the capabilities and should set islighting as false', () => {
    localStorage.setItem('[LocalStorageKey] LedSetFeature', 'true');
    localStorage.setItem('[LocalStorageKey] LedDriver', 'false');
    component.ledSetFeature = true;
    const res = component.getCapabilities();
    expect(res).toBe(undefined);
  });

  it('should get the capabilities and should set islighting as true', () => {
    localStorage.setItem('[LocalStorageKey] LedSetFeature', 'true');
    localStorage.setItem('[LocalStorageKey] LedDriver', 'true');
    fixture.detectChanges();
    const res = component.getCapabilities();
    expect(res).toBe(undefined);
  });

  it('should show popup', () => {
    component.isPopupVisible = true;
    component.SetProfile({target: 1});
    expect(component.isPopupVisible).toBe(true);
  });

  it('should not show popup', () => {
    component.isPopupVisible = false;
    component.SetProfile({ target: 1 });
    expect(component.isPopupVisible).toBe(false);
  });

});

export function mockPipe(options: Pipe): Pipe {
  const metadata: Pipe = {
    name: options.name
  };
  return Pipe(metadata)(
    class MockPipe {
      public transform(query: string, ...args: any[]): any {
        return query;
      }
    }
  );
}
