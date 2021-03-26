import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResultEmptyTipsComponent } from './search-result-empty-tips.component';

describe('SearchResultEmptyTipsComponent', () => {
  let component: SearchResultEmptyTipsComponent;
  let fixture: ComponentFixture<SearchResultEmptyTipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchResultEmptyTipsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchResultEmptyTipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
