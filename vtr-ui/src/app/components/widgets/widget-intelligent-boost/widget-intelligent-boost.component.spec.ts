import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetIntelligentBoostComponent } from './widget-intelligent-boost.component';

describe('WidgetIntelligentBoostComponent', () => {
  let component: WidgetIntelligentBoostComponent;
  let fixture: ComponentFixture<WidgetIntelligentBoostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WidgetIntelligentBoostComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetIntelligentBoostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
