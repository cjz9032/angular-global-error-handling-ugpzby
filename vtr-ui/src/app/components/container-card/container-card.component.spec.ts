import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerCardComponent } from './container-card.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DisplayService } from 'src/app/services/display/display.service';
import { DevService } from 'src/app/services/dev/dev.service';

describe('ContainerCardComponent', () => {
  let component: ContainerCardComponent;
  let fixture: ComponentFixture<ContainerCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
		imports: [
			FontAwesomeModule
		],
	  declarations: [ ContainerCardComponent ],
	  providers: [
		DisplayService,
		DevService
	  ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
