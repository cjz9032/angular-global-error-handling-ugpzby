import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerUseComponent } from './power-use.component';

describe('PowerUseComponent', () => {
  let component: PowerUseComponent;
  let fixture: ComponentFixture<PowerUseComponent>;

  beforeEach(async(() => {
	TestBed.configureTestingModule({
		declarations: [ PowerUseComponent ]
	})
	.compileComponents();
  }));

  beforeEach(() => {
	fixture = TestBed.createComponent(PowerUseComponent);
	component = fixture.componentInstance;
	fixture.detectChanges();
  });

  it('should create', () => {
	expect(component).toBeTruthy();
  });
});
