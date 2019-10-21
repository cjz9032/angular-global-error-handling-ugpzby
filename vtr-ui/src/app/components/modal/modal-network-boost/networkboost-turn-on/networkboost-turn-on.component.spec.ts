import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkboostTurnOnComponent } from './networkboost-turn-on.component';

xdescribe('NetworkboostTurnOnComponent', () => {
  let component: NetworkboostTurnOnComponent;
  let fixture: ComponentFixture<NetworkboostTurnOnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkboostTurnOnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkboostTurnOnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
