import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddAppsComponent } from './modal-add-apps.component';

describe('ModalAddAppsComponent', () => {
  let component: ModalAddAppsComponent;
  let fixture: ComponentFixture<ModalAddAppsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAddAppsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddAppsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
