import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'vtr-promotion-banner',
  templateUrl: './promotion-banner.component.html',
  styleUrls: ['./promotion-banner.component.scss']
})
export class PromotionBannerComponent {
  @Input() title;
  @Input() description;
  @Input() imgSrc;
}
