import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineWidgetComponent } from './offline-widget.component';

describe('OfflineWidgetComponent', () => {
  let component: OfflineWidgetComponent;
  let fixture: ComponentFixture<OfflineWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfflineWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
