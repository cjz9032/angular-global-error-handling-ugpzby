import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BacklightThinkpadComponent } from './backlight-thinkpad.component';

describe('BacklightThinkpadComponent', () => {
  let component: BacklightThinkpadComponent;
  let fixture: ComponentFixture<BacklightThinkpadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BacklightThinkpadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BacklightThinkpadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
