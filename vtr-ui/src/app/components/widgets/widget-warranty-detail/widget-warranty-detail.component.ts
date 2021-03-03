import { OnInit, Input, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WarrantyData, WarrantyStatusEnum } from 'src/app/data-models/warranty/warranty.model';

@Component({
  selector: 'vtr-widget-warranty-detail',
  templateUrl: './widget-warranty-detail.component.html',
  styleUrls: ['./widget-warranty-detail.component.scss']
})
export class WidgetWarrantyDetailComponent implements OnInit {

  @Input() isOnline: boolean;
  @Input() isLargeWidget = false;
  @Input() warrantyUrl = '';
  @Input() warrantyData: WarrantyData;

  WarrantyStatusEnum = WarrantyStatusEnum;

  warrantyRounds = [];

  public pageParent: string;
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
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    try {
      this.pageParent = this.activatedRoute.snapshot.data.pageName;
    } catch (ex) { }
  }

}
