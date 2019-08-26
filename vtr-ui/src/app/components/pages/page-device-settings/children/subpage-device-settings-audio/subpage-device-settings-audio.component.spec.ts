import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubpageDeviceSettingsAudioComponent } from './subpage-device-settings-audio.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslationModule } from 'src/app/modules/translation.module';
import { CommonPipeModule } from 'src/app/modules/common/common-pipe.module';
import { DolbyModesTranslationPipe } from 'src/app/pipe/dolby-modes-translation.pipe';
import { TranslateService, TranslateStore } from '@ngx-translate/core';

xdescribe('SubpageDeviceSettingsAudioComponent', () => {
	let component: SubpageDeviceSettingsAudioComponent;
	let fixture: ComponentFixture<SubpageDeviceSettingsAudioComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [SubpageDeviceSettingsAudioComponent, DolbyModesTranslationPipe],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [
				TranslationModule.forChild(), CommonPipeModule],
			providers: [TranslateStore]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
