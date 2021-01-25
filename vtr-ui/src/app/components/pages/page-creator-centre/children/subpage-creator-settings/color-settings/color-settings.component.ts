import { Component, OnInit } from '@angular/core';
import { DeviceService } from 'src/app/services/device/device.service';

@Component({
  selector: 'vtr-color-settings',
  templateUrl: './color-settings.component.html',
  styleUrls: ['./color-settings.component.scss']
})
export class ColorSettingsComponent{

  constructor(
    private deviceService: DeviceService
  ) { }

  launchProtocol(protocol: string) {
		this.deviceService.launchUri(protocol);
	}
}
