import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchOfflineTipsComponent } from './search-offline-tips.component';

describe('SearchOfflineTipsComponent', () => {
  let component: SearchOfflineTipsComponent;
  let fixture: ComponentFixture<SearchOfflineTipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchOfflineTipsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchOfflineTipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
