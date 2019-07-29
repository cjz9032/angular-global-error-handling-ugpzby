import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetSecurityComponent } from './widget-security.component';

xdescribe('WidgetSecurityComponent', () => {
  let component: WidgetSecurityComponent;
  let fixture: ComponentFixture<WidgetSecurityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetSecurityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
