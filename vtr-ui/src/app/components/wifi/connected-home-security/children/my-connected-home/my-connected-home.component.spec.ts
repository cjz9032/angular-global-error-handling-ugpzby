import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyConnectedHomeComponent } from './my-connected-home.component';

describe('MyConnectedHomeComponent', () => {
  let component: MyConnectedHomeComponent;
  let fixture: ComponentFixture<MyConnectedHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyConnectedHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyConnectedHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
