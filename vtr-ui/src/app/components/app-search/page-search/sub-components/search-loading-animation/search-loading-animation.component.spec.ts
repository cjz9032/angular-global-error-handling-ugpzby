import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchLoadingAnimationComponent } from './search-loading-animation.component';

describe('SearchLoadingAnimationComponent', () => {
  let component: SearchLoadingAnimationComponent;
  let fixture: ComponentFixture<SearchLoadingAnimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchLoadingAnimationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchLoadingAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
