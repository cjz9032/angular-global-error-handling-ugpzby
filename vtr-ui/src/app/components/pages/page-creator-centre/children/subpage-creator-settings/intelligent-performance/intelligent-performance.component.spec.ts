import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntelligentPerformanceComponent } from './intelligent-performance.component';

describe('IntelligentPerformanceComponent', () => {
  let component: IntelligentPerformanceComponent;
  let fixture: ComponentFixture<IntelligentPerformanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntelligentPerformanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntelligentPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
