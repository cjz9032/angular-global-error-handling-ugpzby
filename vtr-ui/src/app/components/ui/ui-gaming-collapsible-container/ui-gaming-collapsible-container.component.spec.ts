import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiGamingCollapsibleContainerComponent } from './ui-gaming-collapsible-container.component';

xdescribe('UiGamingCollapsibleContainerComponent', () => {
  let component: UiGamingCollapsibleContainerComponent;
  let fixture: ComponentFixture<UiGamingCollapsibleContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UiGamingCollapsibleContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiGamingCollapsibleContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
   expect(component).toBeTruthy();
  });
});
