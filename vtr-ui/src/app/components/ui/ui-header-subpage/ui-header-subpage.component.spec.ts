import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiHeaderSubpageComponent } from './ui-header-subpage.component';
import { TranslationModule } from 'src/app/modules/translation.module';
import { HttpClientModule } from '@angular/common/http';
import { TranslateStore } from '@ngx-translate/core';
import { MetricsDirective } from 'src/app/directives/metrics.directive';
import { RouterModule } from '@angular/router';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { DevService } from 'src/app/services/dev/dev.service';
import { MetricsTranslateService } from 'src/app/services/mertics-traslate/metrics-translate.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('UiHeaderSubpageComponent', () => {
	let component: UiHeaderSubpageComponent;
	let fixture: ComponentFixture<UiHeaderSubpageComponent>;
	const title = 'device.deviceSettings.displayCamera.title';
	const caption = 'device.deviceSettings.displayCamera.description';
	const menuTitle = 'device.deviceSettings.displayCamera.jumpTo.title';
	const textId = 'ds-display-camera';

	const headerMenuItems = [
		{
			title: 'device.deviceSettings.displayCamera.jumpTo.shortcuts.display.title',
			path: 'display',
			metricsItem: 'Display'

		},
		{
			title: 'device.deviceSettings.displayCamera.jumpTo.shortcuts.camera.title',
			path: 'camera',
			metricsItem: 'Camera'
		}
	];

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UiHeaderSubpageComponent, MetricsDirective],
			imports: [TranslationModule, HttpClientModule, RouterTestingModule],
			providers: [TranslateStore, MetricsDirective, VantageShellService, DevService, MetricsTranslateService]

		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UiHeaderSubpageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('#UiHeaderSubpageComponent should create', () => {
		expect(component).toBeTruthy();
	});


	it('#UiHeaderSubpageComponent menuItemClick click event', () => {
		component = fixture.componentInstance;
		component.items = headerMenuItems;
		component.caption = caption;
		component.menuTitle = menuTitle;
		component.textId = textId;
		component.title = title;
		/* 	let button = fixture.debugElement.nativeElement.querySelector('#' + 'jumptoSetting-' + headerMenuItems[0].path);
			button.click(); */
		const event = { target: { checked: true, value: 'wed' } };
		component.menuItemClick(event, headerMenuItems[0]);
		fixture.detectChanges();

		fixture.whenStable().then(() => {
			expect(document.activeElement).toEqual(document.getElementById('#' + headerMenuItems[0].path));
		});

	});
});
