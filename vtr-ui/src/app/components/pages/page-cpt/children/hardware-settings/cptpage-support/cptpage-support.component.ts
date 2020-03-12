import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CMSService } from 'src/app/services/cms/cms.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';

import { SupportContentStatus } from 'src/app/enums/support-content-status.enum';

//for cpt
import { Subject, Observable, empty } from 'rxjs';
import { isEmpty } from 'rxjs/operators';
import { isNull, isUndefined } from 'util';


declare let JSONEditor: any;
declare let ClipboardJS: any;

@Component({
  selector: 'vtr-cptpage-support',
  templateUrl: './cptpage-support.component.html',
  styleUrls: ['./cptpage-support.component.scss']
})
export class CptpageSupportComponent implements OnInit, OnDestroy {

  title = 'Support';
  SupportContentStatus = SupportContentStatus;
  searchWords = '';
  searchCount = 1;
  emptyArticles = {
    leftTop: [],
    middleTop: [],
    leftBottom: [],
    middleBottom: [],
    right: [],
    leftBottomSmall: [],
    middleBottomSmall: [],
  };
  backupContentArticles = this.copyObjectArray(this.emptyArticles);
  articles = this.copyObjectArray(this.emptyArticles);
  articlesType = '';
  articleCategories: any = [];
  getArticlesTimeout: any;
  isOnline: boolean = true;

  offlineImages = [
    'assets/images/support/support-offline-1.jpg',
    'assets/images/support/support-offline-2.jpg',
    'assets/images/support/support-offline-3.jpg',
    'assets/images/support/support-offline-4.jpg',
  ];
  localCateIcons = [
    'assets/images/support/design-innovation.svg',
    'assets/images/support/how-to.svg',
    'assets/images/support/lifestyle-entertainment.svg',
    'assets/images/support/software-apps.svg',
  ]

  //for editor
  editorSupport: any;
  clipboardSupport: any;
  currentSelection = {
    categoryId: '',
    defaultArticleUrl: '',
    articleUrl: '',
  };


  constructor(
    private commonService: CommonService,
    private cmsService: CMSService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    //jsonEditor 
    if (!this.editorSupport) {
      this.editorSupport = new JSONEditor(document.getElementById('jeditorSupport'), { mode: 'view' }, {});
    }

    //copyClipboard
    if (!this.clipboardSupport) {
      this.clipboardSupport = new ClipboardJS('.btnCopySupport');
    }

  }

  sliceArticles(allArticles: any) {
    this.articles = this.copyObjectArray(this.emptyArticles);
    allArticles.forEach((article, index) => {
      if (index < 4) {
        if (index % 2 === 0) {
          this.articles.leftTop.push(article);
        } else {
          this.articles.middleTop.push(article);
        }
      } else {
        if (index % 3 === 1) {
          this.articles.leftBottom.push(article);
        } else if (index % 3 === 2) {
          this.articles.middleBottom.push(article);
        } else {
          this.articles.right.push(article);
        }
        if (index % 2 === 0) {
          this.articles.leftBottomSmall.push(article);
        } else {
          this.articles.middleBottomSmall.push(article);
        }
      }
    });
  }

  copyObjectArray(obj: any) {
    return JSON.parse(JSON.stringify(obj));
  }

  search(value: string) {
    this.searchWords = value;
  }

  setCurrentSelection(categoryId: string) {
    this.currentSelection.categoryId = categoryId;
    this.currentSelection.articleUrl = this.currentSelection.defaultArticleUrl + '&category='+categoryId;
  }

  resetCurrentSelection() {
    this.currentSelection.categoryId = '';
    this.currentSelection.articleUrl = '';
  }

  /**
     * For cpt, 
     * To send response to parent component, 
     * Observable added before  
     * this.cmsService.fetchCMSContent
     */
  getCmsJsonResponse() {
    this.articlesType = SupportContentStatus.Loading;
    const queryOptions = {
      Page: 'support'
    };

    return new Observable((observer) => {
      this.cmsService.fetchCMSContent(queryOptions).subscribe(
        (response: any) => {

          observer.next(response);//cpt
          observer.complete();

          if (response && response.length > 0) {
            response = response.filter(r => r.Page === 'support');
            response.forEach(article => {
              if (article.FeatureImage) {
                article.FeatureImage = article.FeatureImage.replace('(', '%28').replace(')', '%29');
              }
            });
            this.sliceArticles(response);
            this.backupContentArticles = this.copyObjectArray(this.articles);
            // console.log(this.articles);
            this.articlesType = SupportContentStatus.Content;

          } else {

            this.sliceArticles([]);
            this.articlesType = SupportContentStatus.Empty;
          }

          //load categories 
          this.fetchCMSArticleCategory();

        },
        error => {
          observer.error(error);
          this.getArticlesTimeout = setTimeout(() => { this.getCmsJsonResponse(); }, 5000);
        }
      );

    });
  }


  fetchCMSArticleCategory() {
    const queryOptions = {};
    this.cmsService.fetchCMSArticleCategories(queryOptions).then(
      (response: any) => {
        if (response && response.length > 0) {
          this.articleCategories = response.slice(0, 4);
          response.forEach(cate => {
            if (cate.Image) {
              cate.Image = cate.Image.replace('(', '%28').replace(')', '%29');
            }
          });

        }
      },
      error => {
        //console.log('fetchCMSArticleCategories error', error);
        setTimeout(() => { this.fetchCMSArticleCategory(); }, 5000);
      }
    );
  }

  clickCategory(categoryId: string) {
    this.setCurrentSelection(categoryId);
    clearTimeout(this.getArticlesTimeout);
    this.fetchCMSArticles(categoryId);

  }

  onInnerBack() {
    this.resetCurrentSelection();
    clearTimeout(this.getArticlesTimeout);
    if (this.backupContentArticles.leftTop.length > 0) {
      this.articlesType = SupportContentStatus.Content;
      this.articles = this.copyObjectArray(this.backupContentArticles);
    } else {
      this.getCmsJsonResponse();
    }
  }


  fetchCMSArticles(categoryId: string, lang?: string) {
    this.articlesType = SupportContentStatus.Loading;
    const queryOptions = {
      category: categoryId,
    };
    if (lang) {
      Object.assign(queryOptions, { Lang: lang, GEO: 'us' });
    }

    this.cmsService.fetchCMSArticles(queryOptions, true).then(
      (response: any) => {

        if (this.editorSupport) {
          this.editorSupport.set(response);
        }

        if (response && response.length > 0) {
          response.forEach(article => {
            if (article.Thumbnail) {
              article.Thumbnail = article.Thumbnail.replace('(', '%28').replace(')', '%29');
            }
          });
          this.sliceArticles(response);
          this.articlesType = SupportContentStatus.Articles;
        } else {
          this.sliceArticles([]);
          this.articlesType = SupportContentStatus.Empty;
          //this.editorSupport.set({});
        }
      },
      error => {
        //console.log('fetchCMSArticles error', error);
        if (lang.toLowerCase() !== 'en') {
          this.getArticlesTimeout = setTimeout(() => { this.fetchCMSArticles(categoryId, 'en'); }, 5000);
        }
      }
    );


  }

  ngOnDestroy() { 
    clearTimeout(this.getArticlesTimeout); 
    
    // when app destroyed then remove ServerSwitch values
    window.localStorage.removeItem(LocalStorageKey.ServerSwitchKey);
  }

}
