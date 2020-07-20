import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetMcafeeContentCardComponent } from './widget-mcafee-content-card.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

describe('WidgetMcafeeContentCardComponent', () => {
	let component: WidgetMcafeeContentCardComponent;
	let fixture: ComponentFixture<WidgetMcafeeContentCardComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [WidgetMcafeeContentCardComponent],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [
				TranslateModule.forRoot(),
				HttpClientTestingModule,
				RouterTestingModule
			],
			providers: [
				TranslateService,
				NgbModal
			]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(WidgetMcafeeContentCardComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
