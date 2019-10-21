import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoverBadSectorsComponent } from './recover-bad-sectors.component';

xdescribe('RecoverBadSectorsComponent', () => {
  let component: RecoverBadSectorsComponent;
  let fixture: ComponentFixture<RecoverBadSectorsComponent>;

  beforeEach(async(() => {
	TestBed.configureTestingModule({
		declarations: [ RecoverBadSectorsComponent ]
	})
	.compileComponents();
  }));

  beforeEach(() => {
	fixture = TestBed.createComponent(RecoverBadSectorsComponent);
	component = fixture.componentInstance;
	fixture.detectChanges();
  });

  it('should create', () => {
	expect(component).toBeTruthy();
  });
});
