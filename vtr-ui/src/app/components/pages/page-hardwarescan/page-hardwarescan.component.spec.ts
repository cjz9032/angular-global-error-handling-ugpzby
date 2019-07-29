import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageHardwarescanComponent } from './page-hardwarescan.component';

xdescribe('PageHardwarescanComponent', () => {
  let component: PageHardwarescanComponent;
  let fixture: ComponentFixture<PageHardwarescanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageHardwarescanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageHardwarescanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
