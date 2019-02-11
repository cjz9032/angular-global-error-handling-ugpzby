import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollapsibleContainerItemComponent } from './collapsible-container-item.component';

describe('CollapsibleContainerItemComponent', () => {
  let component: CollapsibleContainerItemComponent;
  let fixture: ComponentFixture<CollapsibleContainerItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollapsibleContainerItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollapsibleContainerItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
