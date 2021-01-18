import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageCreatorCentreComponent } from './page-creator-centre.component';

describe('PageCreatorCentreComponent', () => {
  let component: PageCreatorCentreComponent;
  let fixture: ComponentFixture<PageCreatorCentreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageCreatorCentreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageCreatorCentreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
