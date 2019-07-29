import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiHeaderSubpageComponent } from './ui-header-subpage.component';

xdescribe('UiHeaderSubpageComponent', () => {
  let component: UiHeaderSubpageComponent;
  let fixture: ComponentFixture<UiHeaderSubpageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UiHeaderSubpageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiHeaderSubpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
