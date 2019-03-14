import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerCollapsibleComponent } from './container-collapsible.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

describe('ContainerCollapsibleComponent', () => {
  let component: ContainerCollapsibleComponent;
  let fixture: ComponentFixture<ContainerCollapsibleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
		imports: [
			FontAwesomeModule
		],
      declarations: [ ContainerCollapsibleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerCollapsibleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
