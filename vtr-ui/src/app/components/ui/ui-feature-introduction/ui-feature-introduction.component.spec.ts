import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiFeatureIntroductionComponent } from './ui-feature-introduction.component';

describe('UiFeatureIntroductionComponent', () => {
  let component: UiFeatureIntroductionComponent;
  let fixture: ComponentFixture<UiFeatureIntroductionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UiFeatureIntroductionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiFeatureIntroductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
