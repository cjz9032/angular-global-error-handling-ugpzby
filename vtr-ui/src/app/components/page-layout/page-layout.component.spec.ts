import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PageLayoutComponent } from './page-layout.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpLoaderFactory } from 'src/app/modules/translation.module';
import { HttpClient } from '@angular/common/http';
import { CommsService } from 'src/app/services/comms/comms.service';
import { DevService } from 'src/app/services/dev/dev.service';
describe('PageContainerComponent', () => {
	let component: PageLayoutComponent;
	let fixture: ComponentFixture<PageLayoutComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			schemas: [NO_ERRORS_SCHEMA],
			declarations: [PageLayoutComponent],
			imports: [
				RouterTestingModule,
				TranslateModule.forRoot({
					loader: {
						provide: TranslateLoader,
						useFactory: HttpLoaderFactory,
						deps: [HttpClient],
					},
				}),
				HttpClientTestingModule,
			],
			providers: [TranslateService, CommsService, DevService],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PageLayoutComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
	it('should call onInnerBack', () => {
		spyOn(component.innerBack, 'emit');
		component.onInnerBack();
		expect(component.innerBack.emit).toHaveBeenCalled();
	});
});
