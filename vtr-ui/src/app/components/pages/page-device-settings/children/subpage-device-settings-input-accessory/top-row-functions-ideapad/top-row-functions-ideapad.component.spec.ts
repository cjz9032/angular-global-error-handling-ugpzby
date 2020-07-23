import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopRowFunctionsIdeapadComponent } from './top-row-functions-ideapad.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NO_ERRORS_SCHEMA, NgZone } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TopRowFunctionsIdeapadService } from './top-row-functions-ideapad.service';
import { CommonMetricsService } from 'src/app/services/common-metrics/common-metrics.service';
import { CommonService } from 'src/app/services/common/common.service';
import { DevService } from 'src/app/services/dev/dev.service';
import { CommsService } from 'src/app/services/comms/comms.service';

const mockNgZone = jasmine.createSpyObj('mockNgZone', ['run', 'runOutsideAngular']);
mockNgZone.run.and.callFake(fn => fn());

xdescribe('TopRowFunctionsIdeapadComponent', () => {
	let component: TopRowFunctionsIdeapadComponent;
	let fixture: ComponentFixture<TopRowFunctionsIdeapadComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TopRowFunctionsIdeapadComponent],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [
				TranslateModule.forRoot(),
				HttpClientTestingModule,
				RouterTestingModule
			],
			providers: [
				TopRowFunctionsIdeapadService,
				CommonMetricsService,
				CommonService,
				{ provide: NgZone, useValue: mockNgZone },
				CommsService,
				DevService,
			]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TopRowFunctionsIdeapadComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
