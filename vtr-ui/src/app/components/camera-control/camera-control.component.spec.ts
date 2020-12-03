import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateStore } from '@ngx-translate/core';
import { TranslationModule } from 'src/app/modules/translation.module';
import { BaseCameraDetail } from 'src/app/services/camera/camera-detail/base-camera-detail.service';
import { CameraFeedService } from 'src/app/services/camera/camera-feed/camera-feed.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell-mock.service';
import { UiSwitchOnoffComponent } from '../ui/ui-switch-onoff/ui-switch-onoff.component';
import { CameraControlComponent } from './camera-control.component';

xdescribe('CameraControlComponent', () => {
	let component: CameraControlComponent;
	let fixture: ComponentFixture<CameraControlComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [CameraControlComponent, UiSwitchOnoffComponent],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [TranslationModule, HttpClientModule],
			providers: [
				TranslateStore,
				UiSwitchOnoffComponent,
				CameraFeedService,
				BaseCameraDetail,
				VantageShellService,
				LoggerService,
			],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CameraControlComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
