import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiFeatureHeadingComponent } from './ui-feature-heading.component';

describe('UiFeatureHeadingComponent', () => {
  let component: UiFeatureHeadingComponent;
  let fixture: ComponentFixture<UiFeatureHeadingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UiFeatureHeadingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiFeatureHeadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
