import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiAddReduceButtonComponent } from './ui-add-reduce-button.component';

describe('UiAddReduceButtonComponent', () => {
  let component: UiAddReduceButtonComponent;
  let fixture: ComponentFixture<UiAddReduceButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UiAddReduceButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiAddReduceButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
