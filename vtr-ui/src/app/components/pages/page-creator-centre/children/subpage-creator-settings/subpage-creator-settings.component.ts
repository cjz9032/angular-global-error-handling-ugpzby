import { Component, OnInit } from '@angular/core';
import { WindowsVersionService } from 'src/app/services/windows-version/windows-version.service';

@Component({
  selector: 'vtr-subpage-creator-settings',
  templateUrl: './subpage-creator-settings.component.html',
  styleUrls: ['./subpage-creator-settings.component.scss']
})
export class SubpageCreatorSettingsComponent {

  private windowsOSVersion: number = undefined;
  public hdrCapability: boolean = undefined;
  intelligentPerformanceVisible = true;

  constructor(
    private windowsVersionService: WindowsVersionService
  ) {
    this.windowsOSVersion = this.windowsVersionService.currentBuildVersion;
    this.hdrCapability = this.windowsOSVersion > 17763;
  }

  updateIntelligentPerformanceCapability(value: boolean) {
    this.intelligentPerformanceVisible = value;
  }
}
