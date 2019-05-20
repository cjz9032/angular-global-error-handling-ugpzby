import { Component, OnInit, EventEmitter } from '@angular/core';
import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';

@Component({
  selector: 'vtr-subpage-device-settings-smart-assist',
  templateUrl: './subpage-device-settings-smart-assist.component.html',
  styleUrls: ['./subpage-device-settings-smart-assist.component.scss']
})
export class SubpageDeviceSettingsSmartAssistComponent implements OnInit {
	public disableMain = false;
	public disableOne = false;
	public disableTwo = false;
	public tooltipText = 'device.deviceSettings.smartAssist.intelligentSecurity.autoScreenLock.autoScreenLockTimer.toolTipContent';
	title = 'device.deviceSettings.smartAssist.title';
	public manualRefresh: EventEmitter<void> = new EventEmitter<void>();
	public humanPresenceDetecStatus = new FeatureStatus(false, true);
	public autoIrCameraLoginStatus = new FeatureStatus(false, true);

	headerMenuItems = [
		{
			title: 'device.deviceSettings.smartAssist.jumpTo.security',
			path: 'security'
		},
		{
			title: 'device.deviceSettings.smartAssist.jumpTo.screen',
			path: 'screen'
		},
		{
			title: 'device.deviceSettings.smartAssist.jumpTo.media',
			path: 'media'
		},
		{
			title: 'device.deviceSettings.smartAssist.jumpTo.voice',
			path: 'voice'
		}
	];

  constructor() { }

  ngOnInit() {
  }

  public onCardCollapse(isCollapsed: boolean) {
	if (!isCollapsed) {
		this.manualRefresh.emit();
	}
}

public onhumanPresenceDetecStatusToggle($event) {
	this.disableMain = !$event.switchValue;
}
public onautoIrCameraLoginStatusToggle($event) {
	this.disableOne = !$event.switchValue;
}

public onautoScreenLockStatusToggle($event) {
	this.disableTwo = !$event.switchValue;
}

}
