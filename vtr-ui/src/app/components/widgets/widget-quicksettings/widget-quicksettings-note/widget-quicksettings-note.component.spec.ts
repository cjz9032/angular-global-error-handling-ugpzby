import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { DeviceService } from 'src/app/services/device/device.service';

import { WidgetQuicksettingsNoteComponent } from './widget-quicksettings-note.component';

describe('WidgetQuicksettingsNoteComponent', () => {
	const path = 'path:uri';
	const id = 'widgetQuicksettingsNoteId';
	const text = 'this is a random text';

	const widgetQuicksettingsNote = {
		id,
		text,
		path,
	};

	let component: WidgetQuicksettingsNoteComponent;
	let fixture: ComponentFixture<WidgetQuicksettingsNoteComponent>;

	beforeEach(async () => {
		const deviceService = {
			launchUri: (args) => { }
		} as DeviceService;
		await TestBed.configureTestingModule({
			declarations: [WidgetQuicksettingsNoteComponent],
			imports: [
				TranslateModule.forRoot(),
			],
			providers: [{
				provide: DeviceService,
				useValue: deviceService
			}]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(WidgetQuicksettingsNoteComponent);
		component = fixture.componentInstance;
		component.note = widgetQuicksettingsNote;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('When render the HTML page', () => {
		it('Then should have a icon', () => {
			const iconElement = fixture.debugElement.query(By.css('#alert-icon'));
			const iconPathsElement = iconElement.queryAll(By.css('span'));

			expect(iconElement).toBeTruthy();
			expect(iconElement.attributes.class).toBe('icomoon icomoon-Alert');
			expect(iconElement.attributes.role).toBe('img');
			expect(iconElement.attributes['aria-label']).toBe(`alert ${id}`);

			expect(iconPathsElement).toBeTruthy();
			expect(iconPathsElement.length).toBe(2);
			expect(iconPathsElement[0].attributes.class).toBe('path1');
			expect(iconPathsElement[0].attributes['aria-hidden']).toBe('true');
			expect(iconPathsElement[1].attributes.class).toBe('path2');
			expect(iconPathsElement[1].attributes['aria-hidden']).toBe('true');
		});

		it('Then should have a note', () => {
			const noteElement = fixture.debugElement.query(By.css('#qs-note'));
			const descriptionElement = noteElement.queryAll(By.css('p'));
			const linkElement = noteElement.queryAll(By.css('a'));

			expect(noteElement).toBeTruthy();

			expect(descriptionElement).toBeTruthy();
			expect(descriptionElement.length).toBe(1);
			expect(descriptionElement[0].attributes.id).toBe(`qs-${widgetQuicksettingsNote.id}-note`);
			expect(descriptionElement[0].nativeElement.textContent).toBe(text);

			expect(linkElement).toBeTruthy();
			expect(linkElement.length).toBe(1);
			expect(linkElement[0].attributes.id).toBe(`qs-${widgetQuicksettingsNote.id}-access-link`);
			expect(linkElement[0].nativeElement.textContent).toBe('dashboard.quickSettings.note.accessUrl');
		});
	});

	it('When call goToSettingsClick, then should call launchUri with correct args', () => {
		const deviceService = TestBed.inject(DeviceService);
		const launchUriSpy = spyOn(deviceService, 'launchUri');
		component.goToSettingsClick();
		expect(launchUriSpy).toHaveBeenCalledWith(path);
	});
});
