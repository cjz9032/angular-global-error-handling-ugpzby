import { Component, Input } from '@angular/core';
import { WarrantyDataRound } from 'src/app/data-models/warranty/warranty.model';

@Component({
  selector: 'vtr-ui-warranty-line',
  templateUrl: './ui-warranty-line.component.html',
  styleUrls: ['./ui-warranty-line.component.scss']
})
export class UiWarrantyLineComponent {

  @Input() round: WarrantyDataRound;
  @Input() isLargeWidget: boolean;

}
