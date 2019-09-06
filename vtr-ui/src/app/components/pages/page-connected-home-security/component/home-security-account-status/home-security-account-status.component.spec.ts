import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeSecurityAccountStatusComponent } from './home-security-account-status.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslationModule } from 'src/app/modules/translation.module';
import { TranslateStore } from '@ngx-translate/core';
import { DaysIntervalPipe } from 'src/app/pipe/connected-home-security/account-status/days-interval.pipe';

describe('HomeSecurityAccountStatusComponent', () => {
	let component: HomeSecurityAccountStatusComponent;
	let fixture: ComponentFixture<HomeSecurityAccountStatusComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [HomeSecurityAccountStatusComponent, DaysIntervalPipe],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [TranslationModule],
			providers: [TranslateStore]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(HomeSecurityAccountStatusComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
