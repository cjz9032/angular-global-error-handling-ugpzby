import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderMainComponent } from './header-main.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MenuHeaderComponent } from '../menu-header/menu-header.component';

describe('HeaderMainComponent', () => {
  let component: HeaderMainComponent;
  let fixture: ComponentFixture<HeaderMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
		imports: [
			FontAwesomeModule
		],
      declarations: [
		  HeaderMainComponent,
		  MenuHeaderComponent
		 ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
