import { Component, OnInit } from '@angular/core';
import { WindowsVersionService } from 'src/app/services/windows-version/windows-version.service';

@Component({
  selector: 'vtr-subpage-creator-settings',
  templateUrl: './subpage-creator-settings.component.html',
  styleUrls: ['./subpage-creator-settings.component.scss']
})
export class SubpageCreatorSettingsComponent {

  public windowsOSVersion: number = undefined;
  intelligentPerformanceVisible = true;

  constructor(
    private windowsVersionService: WindowsVersionService
  ) {
    this.windowsOSVersion = windowsVersionService.currentBuildVersion;
   }

  updateIntelligentPerformanceCapability(value: boolean) {
    this.intelligentPerformanceVisible = value;
  }
   
}
