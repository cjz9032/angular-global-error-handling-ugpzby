import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GamingMenuComponent } from './gaming-menu.component';

describe('GamingMenuComponent', () => {
  let component: GamingMenuComponent;
  let fixture: ComponentFixture<GamingMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GamingMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GamingMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
