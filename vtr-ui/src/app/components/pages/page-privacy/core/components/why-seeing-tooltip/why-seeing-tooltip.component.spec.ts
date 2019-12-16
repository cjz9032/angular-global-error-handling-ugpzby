import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhySeeingTooltipComponent } from './why-seeing-tooltip.component';

xdescribe('WhySeeingTooltipComponent', () => {
  let component: WhySeeingTooltipComponent;
  let fixture: ComponentFixture<WhySeeingTooltipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhySeeingTooltipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhySeeingTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
