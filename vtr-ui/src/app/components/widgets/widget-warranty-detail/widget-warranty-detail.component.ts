import { Input, Component } from '@angular/core';
import { Router } from '@angular/router';
import { WarrantyCodeEnum, WarrantyData, WarrantyStatusEnum } from 'src/app/data-models/warranty/warranty.model';
import { DeviceService } from 'src/app/services/device/device.service';

@Component({
  selector: 'vtr-widget-warranty-detail',
  templateUrl: './widget-warranty-detail.component.html',
  styleUrls: ['./widget-warranty-detail.component.scss']
})
export class WidgetWarrantyDetailComponent {

  @Input() isOnline: boolean;
  @Input() isLargeWidget = false;
  @Input() warrantyUrl = '';
  @Input() warrantyData: WarrantyData;

  WarrantyStatusEnum = WarrantyStatusEnum;
  WarrantyCodeEnum = WarrantyCodeEnum;

  warrantyRounds = [];

  status = {
    title: [
      'support.warranty.titleInWarranty',
      'support.warranty.titleWarrantyExpired',
      'support.warranty.titleWarrantyNotFound',
    ],
    detail: [
      'support.warranty.statusInWarranty',
      'support.warranty.statusWarrantyExpired',
      'support.warranty.statusWarrantyNotFound',
    ],
  };

  constructor(
    private deviceService: DeviceService,
    private router: Router,
  ) { }

  exploreOptionsClicked() {
    if (this.deviceService.isArm) {
      window.open(this.warrantyUrl, '_blank');
    } else {
      this.router.navigate(['/support']);
    }
  }

}
