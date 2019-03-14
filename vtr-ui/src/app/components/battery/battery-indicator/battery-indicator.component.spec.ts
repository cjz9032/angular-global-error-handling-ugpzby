import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatteryIndicatorComponent } from './battery-indicator.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

describe('BatteryIndicatorComponent', () => {
  let component: BatteryIndicatorComponent;
  let fixture: ComponentFixture<BatteryIndicatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
		imports: [
			FontAwesomeModule
		],
      declarations: [ BatteryIndicatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatteryIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
