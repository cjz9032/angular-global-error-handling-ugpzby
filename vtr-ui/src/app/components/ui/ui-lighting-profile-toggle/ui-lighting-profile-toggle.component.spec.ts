import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiLightingProfileToggleComponent } from './ui-lighting-profile-toggle.component';
import { NO_ERRORS_SCHEMA, Pipe } from '@angular/core';

describe('UiLightingProfileToggleComponent', () => {
  let component: UiLightingProfileToggleComponent;
  let fixture: ComponentFixture<UiLightingProfileToggleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        UiLightingProfileToggleComponent,
        mockPipe({ name: 'translate' }),
        mockPipe({ name: 'sanitize' })
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(UiLightingProfileToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should set the profile', () => {
    component.SetProfile({ target: { value: 1 } });
    expect(component.currentProfile).toBe(1);
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
