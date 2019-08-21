import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageNetworkboostComponent } from './page-networkboost.component';

xdescribe('PageNetworkboostComponent', () => {
  let component: PageNetworkboostComponent;
  let fixture: ComponentFixture<PageNetworkboostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageNetworkboostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageNetworkboostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
