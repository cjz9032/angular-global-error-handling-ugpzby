import { Component, Input } from '@angular/core';
import { WarrantyData, WarrantyStatusEnum } from 'src/app/data-models/warranty/warranty.model';

@Component({
  selector: 'vtr-ui-warranty-indicator',
  templateUrl: './ui-warranty-indicator.component.html',
  styleUrls: ['./ui-warranty-indicator.component.scss']
})
export class UiWarrantyIndicatorComponent {

  WarrantyStatusEnum = WarrantyStatusEnum;

  @Input() warrantyData: WarrantyData;
}
