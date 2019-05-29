import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginLenovoIdComponent } from './login-lenovo-id.component';

describe('LoginLenovoIdComponent', () => {
  let component: LoginLenovoIdComponent;
  let fixture: ComponentFixture<LoginLenovoIdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginLenovoIdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginLenovoIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
