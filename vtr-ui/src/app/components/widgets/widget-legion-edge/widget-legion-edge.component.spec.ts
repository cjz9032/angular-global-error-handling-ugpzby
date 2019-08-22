import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { WidgetLegionEdgeComponent } from './widget-legion-edge.component';
import { Pipe } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { GamingSystemUpdateService } from 'src/app/services/gaming/gaming-system-update/gaming-system-update.service';
import { GamingKeyLockService } from 'src/app/services/gaming/gaming-keylock/gaming-key-lock.service';
import { GamingHybridModeService } from 'src/app/services/gaming/gaming-hybrid-mode/gaming-hybrid-mode.service';

const gamingSystemUpdateServiceMock = jasmine.createSpyObj('GamingSystemUpdateService', ['isShellAvailable', 'getCpuOCStatus', 'getRamOCStatus']);
const gamingKeyLockServiceMock = jasmine.createSpyObj('GamingKeyLockService', ['isShellAvailable', 'getKeyLockStatus']);
const gamingHybridModeServiceMock = jasmine.createSpyObj('GamingHybridModeService', ['isShellAvailable', 'getHybridModeStatus']);

xdescribe('WidgetLegionEdgeComponent', () => {
  let component: WidgetLegionEdgeComponent;
  let fixture: ComponentFixture<WidgetLegionEdgeComponent>;
  gamingSystemUpdateServiceMock.isShellAvailable.and.returnValue(true);
  gamingKeyLockServiceMock.isShellAvailable.and.returnValue(true);
  gamingHybridModeServiceMock.isShellAvailable.and.returnValue();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WidgetLegionEdgeComponent,
        mockPipe({ name: 'translate' })],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: HttpClient },
        { provide: GamingSystemUpdateService, useValue: gamingSystemUpdateServiceMock },
        { provide: GamingKeyLockService, useValue: gamingKeyLockServiceMock },
        { provide: GamingHybridModeService, useValue: gamingHybridModeServiceMock }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(WidgetLegionEdgeComponent);
    component = fixture.debugElement.componentInstance;
    gamingKeyLockServiceMock.getKeyLockStatus();
    fixture.detectChanges();
  }));

  it('should render the legion edge container image', async(() => {
    fixture = TestBed.createComponent(WidgetLegionEdgeComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('div.justify-content-between>img').src).toContain('/assets/images/gaming/legionEdge.png');
  }));

  it('should reder the Question icon image on legion edge container', async(() => {
    fixture = TestBed.createComponent(WidgetLegionEdgeComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('div.help-box>a>i.icon-question')).toBeTruthy();
  }));

  it('should have default value ON for CPU over clock if localstorage not set', () => {
    fixture = TestBed.createComponent(WidgetLegionEdgeComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
    //Expected Default Behaviour
    expect(component.drop.curSelected).toEqual(1);
  });

  it('should update or have same CPU over clock value on service and in Local storage and UI', fakeAsync((done: any) => {
    let cpuOCStatusPromisedData: number;
    const uiCpuOCStatusValue = component.drop.curSelected;
    const cacheCPUOverClockStatusValue = component.GetCPUOverClockCacheStatus();
    gamingSystemUpdateServiceMock.getCpuOCStatus.and.returnValue(Promise.resolve(uiCpuOCStatusValue));
    gamingSystemUpdateServiceMock.getCpuOCStatus().then((response: any) => {
      cpuOCStatusPromisedData = response;
    });
    tick(10);
    fixture.detectChanges();
    expect(uiCpuOCStatusValue).toEqual(cacheCPUOverClockStatusValue);
    expect(uiCpuOCStatusValue).toEqual(cpuOCStatusPromisedData);
    expect(cacheCPUOverClockStatusValue).toEqual(cpuOCStatusPromisedData);
  }));

  it('should able to mock Hybrid Mode service data ',  fakeAsync((done: any) => {
    let hybridModeStatusPromisedData: boolean;
    //Mocking True
    gamingHybridModeServiceMock.getHybridModeStatus.and.returnValue(Promise.resolve(true));
    gamingHybridModeServiceMock.getHybridModeStatus().then((response: any) => {
      hybridModeStatusPromisedData = response;
    });
    tick(10);
    fixture.detectChanges();
    expect(hybridModeStatusPromisedData).toEqual(true);

    //Mocking false
    gamingHybridModeServiceMock.getHybridModeStatus.and.returnValue(Promise.resolve(false));
    gamingHybridModeServiceMock.getHybridModeStatus().then((response: any) => {
      hybridModeStatusPromisedData = response;
    });
    tick(10);
    fixture.detectChanges();
    expect(hybridModeStatusPromisedData).toEqual(false);

  }));

  it('should able to mock RAM Overclock service data ',  fakeAsync((done: any) => {
    let ramOverclockStatusPromisedData: boolean;
    //Mocking True
    gamingSystemUpdateServiceMock.getRamOCStatus.and.returnValue(Promise.resolve(true));
    gamingSystemUpdateServiceMock.getRamOCStatus().then((response: any) => {
      ramOverclockStatusPromisedData = response;
    });
    tick(10);
    fixture.detectChanges();
    expect(ramOverclockStatusPromisedData).toEqual(true);

    //Mocking false
    gamingSystemUpdateServiceMock.getRamOCStatus.and.returnValue(Promise.resolve(false));
    gamingSystemUpdateServiceMock.getRamOCStatus().then((response: any) => {
      ramOverclockStatusPromisedData = response;
    });
    tick(10);
    fixture.detectChanges();
    expect(ramOverclockStatusPromisedData).toEqual(false);

  }));

  it('should update or have same Touchpad Lock value on service and in Local storage and UI', fakeAsync((done: any) => {
    let touchpadLockPromisedData: boolean;
    const uiTouchpadLockStatusValue = component.legionUpdate[5].isChecked;
    const cacheTouchpadStatusValue = component.GetTouchpadLockCacheStatus();
    gamingKeyLockServiceMock.getKeyLockStatus.and.returnValue(Promise.resolve(uiTouchpadLockStatusValue));
    gamingKeyLockServiceMock.getKeyLockStatus().then((response: any) => {
      touchpadLockPromisedData = response;
    });
    tick(10);
    fixture.detectChanges();
    expect(uiTouchpadLockStatusValue).toEqual(cacheTouchpadStatusValue);
    expect(uiTouchpadLockStatusValue).toEqual(touchpadLockPromisedData);
    expect(cacheTouchpadStatusValue).toEqual(touchpadLockPromisedData);
  }));

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

});

/**
 * @param options pipeName which has to be mock
 * @description To mock the pipe.
 * @summary This has to move to one utils file.
 */
export function mockPipe(options: Pipe): Pipe {
  const metadata: Pipe = {
    name: options.name
  };
  return <any>Pipe(metadata)(class MockPipe {
    public transform(query: string, ...args: any[]): any {
      return query;
    }
  });
}
