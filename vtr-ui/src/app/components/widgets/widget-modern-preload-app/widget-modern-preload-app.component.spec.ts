import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpLoaderFactory, TranslationModule } from 'src/app/modules/translation.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { WidgetModernPreloadAppComponent } from './widget-modern-preload-app.component';

describe('WidgetModernPreloadAppComponent', () => {
	let component: WidgetModernPreloadAppComponent;
	let fixture: ComponentFixture<WidgetModernPreloadAppComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [WidgetModernPreloadAppComponent],
			imports: [
				HttpClientModule,
				TranslateModule.forRoot({
					loader: {
						provide: TranslateLoader,
						useFactory: HttpLoaderFactory,
						deps: [HttpClient],
					},
					isolate: false,
				}),
				TranslationModule.forChild(),
			],

			schemas: [NO_ERRORS_SCHEMA],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(WidgetModernPreloadAppComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
