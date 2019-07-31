import { Component, OnInit } from '@angular/core';
import { CMSService } from 'src/app/services/cms/cms.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'vtr-page-autoclose',
  templateUrl: './page-autoclose.component.html',
  styleUrls: ['./page-autoclose.component.scss']
})
export class PageAutocloseComponent implements OnInit {
  cardContentPositionA: any = {
    FeatureImage: './../../../../assets/cms-cache/content-card-4x4-support.jpg'
  };
  cardContentPositionB: any = {
    FeatureImage: './../../../../assets/cms-cache/Security4x3-zone2.jpg'
  };
  backId = 'vtr-gaming-macrokey-btn-back';
  constructor(private cmsService: CMSService) { }

  ngOnInit() {
    const queryOptions = {
      Page: 'dashboard',
	  Lang: this.cmsService.cmsQueryParams.language,
	  GEO: this.cmsService.cmsQueryParams.region,
	  OEM: this.cmsService.cmsQueryParams.OEM,
	  OS: this.cmsService.cmsQueryParams.OS,
	  Segment: this.cmsService.cmsQueryParams.segment,
	  Brand: this.cmsService.cmsQueryParams.brand
    };

    this.cmsService.fetchCMSContent(queryOptions).subscribe((response: any) => {
      const cardContentPositionA = this.cmsService.getOneCMSContent(
        response,
        'half-width-top-image-title-link',
        'position-F'
      )[0];
      if (cardContentPositionA) {
        this.cardContentPositionA = cardContentPositionA;
      }

      const cardContentPositionB = this.cmsService.getOneCMSContent(
        response,
        'half-width-title-description-link-image',
        'position-B'
      )[0];
      if (cardContentPositionB) {
        this.cardContentPositionB = cardContentPositionB;
        if (this.cardContentPositionB.BrandName) {
          this.cardContentPositionB.BrandName = this.cardContentPositionB.BrandName.split('|')[0];
        }
      }
    });
  }
}
