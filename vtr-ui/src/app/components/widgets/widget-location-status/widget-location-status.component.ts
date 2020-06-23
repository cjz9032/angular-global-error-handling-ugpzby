import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { DeviceLocationPermission } from 'src/app/data-models/home-security/device-location-permission.model';

@Component({
	selector: 'vtr-widget-location-status',
	templateUrl: './widget-location-status.component.html',
	styleUrls: ['./widget-location-status.component.scss']
})
export class WidgetLocationStatusComponent implements OnInit {
	@Input() linkId: string;
	@Input() title: string;
	@Input() subtitle: string;
	@Input() description: string;
	@Input() buttonText: string;
	@Input() locationPermission: DeviceLocationPermission = undefined;
	@Output() buttonClick = new EventEmitter();

	constructor(public dialogService: DialogService) { }

	ngOnInit(): void {
	}

	public enableLocation($event: any) {
		this.buttonClick.emit($event);
	}

}