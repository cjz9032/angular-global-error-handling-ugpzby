import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchInputWidgetComponent } from './search-input-widget.component';

describe('SearchInputWidgetComponent', () => {
  let component: SearchInputWidgetComponent;
  let fixture: ComponentFixture<SearchInputWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchInputWidgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchInputWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
