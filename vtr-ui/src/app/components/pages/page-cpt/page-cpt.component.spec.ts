import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageCptComponent } from './page-cpt.component';

describe('PageCptComponent', () => {
  let component: PageCptComponent;
  let fixture: ComponentFixture<PageCptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageCptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageCptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
