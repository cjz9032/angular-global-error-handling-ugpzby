import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../../base/base.component';
import { DeviceService } from 'src/app/services/device/device.service';
import { GamingCollapsableContainerEvent } from 'src/app/data-models/gaming/gaming-collapsable-container-event';
@Component({
	selector: 'vtr-widget-device-update-settings',
	templateUrl: './widget-device-update-settings.component.html',
	styleUrls: ['./widget-device-update-settings.component.scss']
})
export class WidgetDeviceUpdateSettingsComponent extends BaseComponent implements OnInit {

	@Input() title: string;
	@Input() description: string;
	@Input() items: any[];
	@Input() options;
	@Output() optionSelected = new EventEmitter<any>();
	@Output() toggleOnOff = new EventEmitter<any>();

	constructor(private deviceService: DeviceService) {
		super();
	}

	ngOnInit() { }
	showVar: boolean = false;

	public onToggleOnOff($event: any) {
		this.toggleOnOff.emit($event);
	}

	public onLinkClick(path: string) {
		if (path && path.length > 0) {
			this.deviceService.launchUri(path);
		}
	}
}

