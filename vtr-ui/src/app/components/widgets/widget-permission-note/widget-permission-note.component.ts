import { Component, OnInit, Input } from '@angular/core';
import { DeviceService } from 'src/app/services/device/device.service';

@Component({
	selector: 'vtr-widget-permission-note',
	templateUrl: './widget-permission-note.component.html',
	styleUrls: ['./widget-permission-note.component.scss'],
})
export class WidgetPermissionNoteComponent implements OnInit {
	@Input() noteTitle: string;
	@Input() description: string;
	@Input() path: string;
	@Input() linkId: string;
	@Input() noPath: boolean;

	constructor(public deviceService: DeviceService) {}

	ngOnInit() {}

	onClick(event) {
		this.deviceService.launchUri(this.path);
	}
}
