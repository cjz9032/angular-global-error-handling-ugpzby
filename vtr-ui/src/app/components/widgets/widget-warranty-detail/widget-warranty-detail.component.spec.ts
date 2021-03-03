import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetWarrantyDetailComponent } from './widget-warranty-detail.component';

describe('WidgetWarrantyDetailComponent', () => {
  let component: WidgetWarrantyDetailComponent;
  let fixture: ComponentFixture<WidgetWarrantyDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WidgetWarrantyDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetWarrantyDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
