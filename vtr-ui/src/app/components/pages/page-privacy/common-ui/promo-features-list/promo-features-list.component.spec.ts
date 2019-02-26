import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoFeaturesListComponent } from './promo-features-list.component';

describe('PromoFeaturesListComponent', () => {
  let component: PromoFeaturesListComponent;
  let fixture: ComponentFixture<PromoFeaturesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromoFeaturesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromoFeaturesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
