import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatteryCardComponent } from './battery-card.component';
import { BatteryDetailComponent } from '../battery-detail/battery-detail.component';
import { BatteryIndicatorComponent } from '../battery-indicator/battery-indicator.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

describe('BatteryCardComponent', () => {
  let component: BatteryCardComponent;
  let fixture: ComponentFixture<BatteryCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
		imports: [
			FontAwesomeModule
		],
	  declarations: [
		  BatteryCardComponent,
		  BatteryDetailComponent,
		  BatteryIndicatorComponent,
	 ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatteryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
