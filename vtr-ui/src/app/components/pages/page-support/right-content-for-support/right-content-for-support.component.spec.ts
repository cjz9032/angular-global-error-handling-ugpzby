import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RightContentForSupportComponent } from './right-content-for-support.component';

describe('RightContentForSupportComponent', () => {
  let component: RightContentForSupportComponent;
  let fixture: ComponentFixture<RightContentForSupportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RightContentForSupportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RightContentForSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
