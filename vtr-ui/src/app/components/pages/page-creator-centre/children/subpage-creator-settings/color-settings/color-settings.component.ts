import { Component, OnInit } from '@angular/core';
import { CommonMetricsService } from 'src/app/services/common-metrics/common-metrics.service';
import { DeviceService } from 'src/app/services/device/device.service';

@Component({
  selector: 'vtr-color-settings',
  templateUrl: './color-settings.component.html',
  styleUrls: ['./color-settings.component.scss']
})
export class ColorSettingsComponent{

  constructor(
    private deviceService: DeviceService,
    private metrics: CommonMetricsService
  ) { }

  launchProtocol(protocol: string) {
    this.deviceService.launchUri(protocol);
    this.metrics.sendMetrics('hdr.click', 'hdColorSettings', 'Smb.CreatorSettings');
	}
}
