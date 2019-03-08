import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerArticleComponent } from './container-article.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DisplayService } from 'src/app/services/display/display.service';
import { DevService } from 'src/app/services/dev/dev.service';

describe('ContainerArticleComponent', () => {
  let component: ContainerArticleComponent;
  let fixture: ComponentFixture<ContainerArticleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
		imports: [
			FontAwesomeModule
		],
	  declarations: [ ContainerArticleComponent ],
	  providers: [
		DisplayService,
		DevService
	  ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
