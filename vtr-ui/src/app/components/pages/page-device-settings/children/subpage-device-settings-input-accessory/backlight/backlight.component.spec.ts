import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BacklightComponent } from './backlight.component';

xdescribe('BacklightComponent', () => {
  let component: BacklightComponent;
  let fixture: ComponentFixture<BacklightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BacklightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BacklightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
