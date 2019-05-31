import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlePitchComponent } from './article-pitch.component';

describe('ArticlePitchComponent', () => {
  let component: ArticlePitchComponent;
  let fixture: ComponentFixture<ArticlePitchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticlePitchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticlePitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
