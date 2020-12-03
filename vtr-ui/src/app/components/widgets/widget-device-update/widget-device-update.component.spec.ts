import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { WidgetDeviceUpdateComponent } from './widget-device-update.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpLoaderFactory } from 'src/app/modules/translation.module';
import { HttpClient } from '@angular/common/http';
describe('WidgetDeviceUpdateComponent', () => {
	let component: WidgetDeviceUpdateComponent;
	let fixture: ComponentFixture<WidgetDeviceUpdateComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			schemas: [NO_ERRORS_SCHEMA],
			declarations: [WidgetDeviceUpdateComponent],
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
			providers: [TranslateService],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(WidgetDeviceUpdateComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
	it('should call onCheckForUpdates', () => {
		component.onCheckForUpdates();
		expect(component.isCancelingStatus).toBeFalse();
	});
	it('should call cancelUpdates', () => {
		spyOn(component.cancelUpdateCheck, 'emit');
		component.cancelUpdates();
		expect(component.cancelUpdateCheck.emit).toHaveBeenCalled();
	});
	it('should call onCancelUpdateDownload', () => {
		spyOn(component.cancelUpdateDownload, 'emit');
		component.onCancelUpdateDownload();
		expect(component.cancelUpdateDownload.emit).toHaveBeenCalled();
	});
});
