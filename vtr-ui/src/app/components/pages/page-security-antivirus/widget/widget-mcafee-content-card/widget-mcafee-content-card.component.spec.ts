import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialog } from '@lenovo/material/dialog';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { WidgetMcafeeContentCardComponent } from './widget-mcafee-content-card.component';

describe('WidgetMcafeeContentCardComponent', () => {
	let component: WidgetMcafeeContentCardComponent;
	let fixture: ComponentFixture<WidgetMcafeeContentCardComponent>;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [WidgetMcafeeContentCardComponent],
				schemas: [NO_ERRORS_SCHEMA],
				imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
				providers: [TranslateService, MatDialog],
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(WidgetMcafeeContentCardComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
