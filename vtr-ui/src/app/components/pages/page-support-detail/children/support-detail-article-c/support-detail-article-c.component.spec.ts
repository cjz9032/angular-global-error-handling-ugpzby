import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportDetailArticleCComponent } from './support-detail-article-c.component';

describe('SupportDetailArticleCComponent', () => {
  let component: SupportDetailArticleCComponent;
  let fixture: ComponentFixture<SupportDetailArticleCComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportDetailArticleCComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportDetailArticleCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
