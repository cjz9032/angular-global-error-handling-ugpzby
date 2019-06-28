import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { BaseComponent } from '../../base/base.component';
import { DeviceService } from 'src/app/services/device/device.service';
import { GamingCollapsableContainerEvent } from 'src/app/data-models/gaming/gaming-collapsable-container-event';
import { Router } from '@angular/router';
@Component({
	selector: 'vtr-widget-device-update-settings',
	templateUrl: './widget-device-update-settings.component.html',
	styleUrls: ['./widget-device-update-settings.component.scss']
})
export class WidgetDeviceUpdateSettingsComponent extends BaseComponent implements OnInit, AfterViewInit {
	@Input() title: string;
	@Input() description: string;
	@Input() items: any[];
	@Input() disableButtons: Boolean = false;
	@Input() options;
	@Output() optionSelected = new EventEmitter<any>();
	@Output() toggleOnOff = new EventEmitter<any>();
	@Output() popupClosed = new EventEmitter<any>();
	@Output() iconClick = new EventEmitter<any>();
	showVar = false;

	public showDriversPopup: boolean;
	constructor(private deviceService: DeviceService, private router: Router) {
		super();
	}

	public optionChanged(option: any, item: any) {
		const gamingCollapsableContainerEvent = new GamingCollapsableContainerEvent(option, item);
		this.optionSelected.emit(gamingCollapsableContainerEvent);
	}
	ngAfterViewInit() {
		this.showDriversPopup = true;
	}

	ngOnInit() { }

	public onToggleOnOff($event: any) {
		this.toggleOnOff.emit($event);
	}

	public onLinkClick(path: string) {
		if (path && path.length > 0) {
			this.deviceService.launchUri(path);
		}
	}

	public onClosed($event: any) {
		this.popupClosed.emit($event);
	}

	public navigateToLink(item: any) {
		if (!item.canNavigate) {
			this.router.navigate([item.routerLink]);
		} else {
			this.iconClick.emit(item);
		}
	}
}
