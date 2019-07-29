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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetLegionEdgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetLegionEdgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
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
