import { Component, Input } from '@angular/core';
import { WarrantyDataRound } from 'src/app/data-models/warranty/warranty.model';

@Component({
  selector: 'vtr-ui-warranty-round',
  templateUrl: './ui-warranty-round.component.html',
  styleUrls: ['./ui-warranty-round.component.scss']
})
export class UiWarrantyRoundComponent {

  @Input() round: WarrantyDataRound = {
    index: 0, mos: 0, isInUsed: true
  };
  @Input() isLargeWidget: boolean;

}
