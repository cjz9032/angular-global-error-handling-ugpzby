import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarBenefitsWidgetComponent } from './sidebar-benefits-widget.component';

describe('SidebarBenefitsWidgetComponent', () => {
  let component: SidebarBenefitsWidgetComponent;
  let fixture: ComponentFixture<SidebarBenefitsWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarBenefitsWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarBenefitsWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be false', () => {
    expect(component.isOpen).toEqual(false);
  })
});
