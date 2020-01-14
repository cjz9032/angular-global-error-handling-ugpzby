import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerCardOfflineComponent } from './container-card-offline.component';

describe('ContainerCardOfflineComponent', () => {
  let component: ContainerCardOfflineComponent;
  let fixture: ComponentFixture<ContainerCardOfflineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContainerCardOfflineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerCardOfflineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
