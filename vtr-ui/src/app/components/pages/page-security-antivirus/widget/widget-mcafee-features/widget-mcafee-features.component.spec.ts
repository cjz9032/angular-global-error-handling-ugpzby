import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { WidgetMcafeeFeaturesComponent } from './widget-mcafee-features.component';

describe('WidgetMcafeeFeaturesComponent', () => {
	let component: WidgetMcafeeFeaturesComponent;
	let fixture: ComponentFixture<WidgetMcafeeFeaturesComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [WidgetMcafeeFeaturesComponent],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
			providers: [TranslateService],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(WidgetMcafeeFeaturesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
