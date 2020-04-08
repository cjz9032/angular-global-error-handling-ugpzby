import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AntiTheftComponent } from './anti-theft.component';

describe('AntiTheftComponent', () => {
  let component: AntiTheftComponent;
  let fixture: ComponentFixture<AntiTheftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AntiTheftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AntiTheftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
