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
	@Output() showDropDown = new EventEmitter();
	showVar = false;

	public showDriversPopup: boolean;
	constructor(private deviceService: DeviceService, private router: Router) {
		super();
	}

	public optionChanged(option: any, item: any, id) {
		this.currentFocus('cold' + id);
		const gamingCollapsableContainerEvent = new GamingCollapsableContainerEvent(option, item);
		this.optionSelected.emit(gamingCollapsableContainerEvent);
	}
	ngAfterViewInit() {
		this.showDriversPopup = true;
	}

	ngOnInit() { }
	currentFocus(id) {
        const focElement = document.getElementById(id);
        if (focElement) {
			focElement.focus();
		}
    }
	public onToggleOnOff($event: any) {
		this.toggleOnOff.emit($event);
	}

	public onLinkClick(path: string) {
		if (path && path.length > 0) {
			this.deviceService.launchUri(path);
		}
	}
	updateFocus(i: any = false) {
		if (i >= 0 && this.items[i]) {
			this.items[i].focus = true;
		}
		setTimeout(() => { this.items[i].focus = false; }, 50);
	}
	public onClosed($event: any, i: any = false) {
		this.updateFocus(i);
		if (i >= 0) {
			this.items[i].isPopup = false;
			this.items[i].isDriverPopup = false;
		}
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
