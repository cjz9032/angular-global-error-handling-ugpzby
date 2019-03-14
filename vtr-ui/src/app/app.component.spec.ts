import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { WidgetSwitchIconComponent } from './components/widgets/widget-switch-icon/widget-switch-icon.component';
import { MenuMainComponent } from './components/menu-main/menu-main.component';
import { UiSwitchOnoffComponent } from './components/ui/ui-switch-onoff/ui-switch-onoff.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UserService } from './services/user/user.service';
import { CookieService } from 'ngx-cookie-service';
import { CommsService } from './services/comms/comms.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { DevService } from './services/dev/dev.service';
import { ContainerService } from './services/container/container.service';
import { DisplayService } from './services/display/display.service';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
		RouterTestingModule,
		FontAwesomeModule
      ],
      declarations: [
		AppComponent,
		WidgetSwitchIconComponent,
		MenuMainComponent,
		UiSwitchOnoffComponent
	  ],
	  providers: [
		UserService,
		CookieService,
		CommsService,
		HttpClient,
		HttpHandler,
		DevService,
		ContainerService,
		DisplayService
	  ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'vtr-ui'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('vtr-ui');
  });

  it('should render title in a h1 tag', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to vtr-ui!');
  });
});
