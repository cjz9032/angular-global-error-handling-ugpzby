import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CMSService } from 'src/app/services/cms/cms.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { CommonService } from 'src/app/services/common/common.service';

//for cpt
import { Subject, Observable, empty } from 'rxjs';
import { isEmpty } from 'rxjs/operators';
import { isNull, isUndefined } from 'util';

@Component({
  selector: 'vtr-cptpage-security-antivirus',
  templateUrl: './cptpage-security-antivirus.component.html',
  styleUrls: ['./cptpage-security-antivirus.component.scss']
})
export class CptpageSecurityAntivirusComponent implements OnInit, OnDestroy {
  title = 'Anti-Virus';
  cardContentPositionA: any = {};
  mcafeeArticleId: string;
  mcafeeArticleCategory: string;

  constructor(
    private commonService: CommonService,
    private cmsService: CMSService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
  }

  /**
     * For cpt, 
     * To send response to parent component, 
     * Observable added before  
     * this.cmsService.fetchCMSContent
     */
  getCmsJsonResponse() {
    const queryOptions = {
      Page: 'anti-virus',
			Template: 'inner-page-right-side-article-image-background'
    };

    return new Observable((observer) => {
      this.cmsService.fetchCMSContent(queryOptions).subscribe(
        (response: any) => {

          observer.next(response);//cpt
          observer.complete();

          const cardContentPositionA = this.cmsService.getOneCMSContent(response, 'inner-page-right-side-article-image-background', 'position-A')[0];
          if (cardContentPositionA) {
            this.cardContentPositionA = cardContentPositionA;
            if (this.cardContentPositionA.BrandName) {
              this.cardContentPositionA.BrandName = this.cardContentPositionA.BrandName.split('|')[0];
            }
          }

          this.mcafeeArticleId = this.cardContentPositionA.ActionLink;
					this.cmsService.fetchCMSArticle(this.mcafeeArticleId).then((r: any) => {
						if (r && r.Results && r.Results.Category) {
							this.mcafeeArticleCategory = r.Results.Category.map((category: any) => category.Title).join(' ');
						}
					});

        },
        error => {
          observer.error(error);
        }
      );

    });
  }

  ngOnDestroy() { }

}