import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerCardStateComponent } from './container-card-state.component';

describe('ContainerCardStateComponent', () => {
  let component: ContainerCardStateComponent;
  let fixture: ComponentFixture<ContainerCardStateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContainerCardStateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerCardStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
