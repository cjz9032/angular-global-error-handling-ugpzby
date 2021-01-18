import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubpageEasyRenderingComponent } from './subpage-easy-rendering.component';

describe('SubpageEasyRenderingComponent', () => {
  let component: SubpageEasyRenderingComponent;
  let fixture: ComponentFixture<SubpageEasyRenderingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubpageEasyRenderingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubpageEasyRenderingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
