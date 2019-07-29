import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraBackgroundBlurComponent } from './camera-background-blur.component';

xdescribe('CameraBackgroundBlurComponent', () => {
  let component: CameraBackgroundBlurComponent;
  let fixture: ComponentFixture<CameraBackgroundBlurComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CameraBackgroundBlurComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CameraBackgroundBlurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
