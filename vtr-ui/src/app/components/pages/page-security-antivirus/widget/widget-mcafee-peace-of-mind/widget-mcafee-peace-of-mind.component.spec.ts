import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { WidgetMcafeePeaceOfMindComponent } from './widget-mcafee-peace-of-mind.component';


describe('WidgetMcafeePeaceOfMindComponent', () => {
	let component: WidgetMcafeePeaceOfMindComponent;
	let fixture: ComponentFixture<WidgetMcafeePeaceOfMindComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [WidgetMcafeePeaceOfMindComponent],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [
				TranslateModule.forRoot(),
				HttpClientTestingModule,
				RouterTestingModule
			],
			providers: [
				TranslateService
			]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(WidgetMcafeePeaceOfMindComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
