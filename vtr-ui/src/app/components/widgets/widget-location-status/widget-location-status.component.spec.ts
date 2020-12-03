import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WidgetLocationStatusComponent } from './widget-location-status.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from 'src/app/services/user/user.service';
import { CookieService } from 'ngx-cookie-service';
import { CommsService } from 'src/app/services/comms/comms.service';
import { DevService } from 'src/app/services/dev/dev.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('WidgetLocationStatusComponent', () => {
	let component: WidgetLocationStatusComponent;
	let fixture: ComponentFixture<WidgetLocationStatusComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [WidgetLocationStatusComponent],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
			providers: [DialogService, UserService, CookieService, CommsService, DevService],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(WidgetLocationStatusComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
