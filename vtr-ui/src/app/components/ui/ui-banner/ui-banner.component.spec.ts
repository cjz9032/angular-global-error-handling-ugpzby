import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiBannerComponent } from './ui-banner.component';
import { TranslateModule } from '@ngx-translate/core';

describe('UiBannerComponent', () => {
  let component: UiBannerComponent;
  let fixture: ComponentFixture<UiBannerComponent>;

  beforeEach(async(() => {
	TestBed.configureTestingModule({
		declarations: [ UiBannerComponent ],
		imports: [TranslateModule.forRoot()]
	})
	.compileComponents();
  }));

  beforeEach(() => {
	fixture = TestBed.createComponent(UiBannerComponent);
	component = fixture.componentInstance;
	fixture.detectChanges();
  });

  it('should create', () => {
	expect(component).toBeTruthy();
  });
});
