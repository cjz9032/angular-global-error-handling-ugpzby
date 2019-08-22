import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopRowFunctionsComponent } from './top-row-functions.component';

describe('TopRowFunctionsComponent', () => {
  let component: TopRowFunctionsComponent;
  let fixture: ComponentFixture<TopRowFunctionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopRowFunctionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopRowFunctionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
