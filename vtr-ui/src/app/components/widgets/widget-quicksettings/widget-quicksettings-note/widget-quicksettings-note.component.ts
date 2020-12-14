import { Component, Input, OnInit } from '@angular/core';
import { DeviceService } from 'src/app/services/device/device.service';
import { WidgetQuicksettingsNoteInterface } from './widget-quicksettings-note.interface';

@Component({
	selector: 'vtr-widget-quicksettings-note',
	templateUrl: './widget-quicksettings-note.component.html',
	styleUrls: ['./widget-quicksettings-note.component.scss']
})
export class WidgetQuicksettingsNoteComponent implements OnInit {

	@Input() note: WidgetQuicksettingsNoteInterface;

	constructor(private deviceService: DeviceService) { }

	ngOnInit(): void {
	}

	goToSettingsClick() {
		this.deviceService.launchUri(this.note.path);
	}
}
