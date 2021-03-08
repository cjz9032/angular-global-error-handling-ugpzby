
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SupportService } from '../../../services/support/support.service';
import { DeviceService } from '../../../services/device/device.service';
import { CMSService } from 'src/app/services/cms/cms.service';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { CommonService } from 'src/app/services/common/common.service';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { Subscription } from 'rxjs/internal/Subscription';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { LocalInfoService } from 'src/app/services/local-info/local-info.service';
import { SupportContentStatus } from 'src/app/enums/support-content-status.enum';
import { ContentSource } from 'src/app/enums/content.enum';
import cloneDeep from 'lodash/cloneDeep';

@Component({
  selector: 'vtr-page-content-library',
  templateUrl: './page-content-library.component.html',
  styleUrls: ['./page-content-library.component.scss']
})
export class PageContentLibraryComponent implements OnInit, OnDestroy {

  SupportContentStatus = SupportContentStatus;
  title = 'common.menu.contentLibrary';
  offlineConnection = 'offline-connection';
  backupContentArticles = [];
  articles = [];
  articlesType = '';
  articleCategories: any = [];
  isCategoryArticlesShow = false;
  selectedCategoryId = '';
  isOnline: boolean;
  notificationSubscription: Subscription;
  backId = 'content-library-page-btn-back';
  getArticlesTimeout: any;

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
  ];

  cateStartTime: any;
  contentStartTime: any;

  constructor(
    public supportService: SupportService,
    public deviceService: DeviceService,
    public localInfoService: LocalInfoService,
    private cmsService: CMSService,
    private commonService: CommonService,
    private loggerService: LoggerService,
  ) { }

  ngOnInit() {
    this.isOnline = this.commonService.isOnline;
    this.notificationSubscription = this.commonService.notification.subscribe(
      (response: AppNotification) => {
        this.onNotification(response);
      }
    );
    this.fetchCMSArticleCategory();
    this.fetchCMSContents();

  }

  ngOnDestroy() {
    clearTimeout(this.getArticlesTimeout);
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
  }

  onNotification(notification: AppNotification) {
    if (notification) {
      const { type, payload } = notification;
      switch (type) {
        case NetworkStatus.Online:
        case NetworkStatus.Offline:
          if (notification.payload.isOnline !== this.isOnline) {
            this.isOnline = notification.payload.isOnline;
            if (this.isOnline) {
              const retryInterval = setInterval(() => {
                if (
                  this.articleCategories.length > 0 &&
                  this.articles.length > 0
                ) {
                  clearInterval(retryInterval);
                  return;
                }
                if (this.articleCategories.length === 0) {
                  this.fetchCMSArticleCategory();
                }
                if (this.articles.length === 0) {
                  this.fetchCMSContents();
                }
              }, 2500);
            }
          }
          break;
        default:
          break;
      }
    }
  }

  fetchCMSContents(lang?: string) {
    this.contentStartTime = new Date();
    this.articlesType = SupportContentStatus.Loading;

    const queryOptions = {
      Page: 'support',
    };
    if (lang) {
      Object.assign(queryOptions, { Lang: lang, GEO: 'US' });
    }

    this.cmsService.fetchCMSContent(queryOptions).subscribe(
      (response: any) => {
        const contentEnd: any = new Date();
        const contentUseTime = contentEnd - this.contentStartTime;
        if (response && response.length > 0) {
          response = response.filter((r) => r.Page === 'support');
          response.forEach((article) => {
            article.DataSource = ContentSource.CMS;
            if (article.FeatureImage) {
              article.FeatureImage = article.FeatureImage
                .replace('(', '%28')
                .replace(')', '%29');
            }
          });
          this.articles = response;
          this.backupContentArticles = cloneDeep(this.articles);
          this.articlesType = SupportContentStatus.Content;
          const msg = `Performance: Content library page get content articles, ${contentUseTime}ms`;
          this.loggerService.info(msg);
        } else {
          const msg = `Performance: Content library page not have this Language content articles, ${contentUseTime}ms`;
          this.loggerService.info(msg);
          this.articles = [];
          this.articlesType = SupportContentStatus.Empty;
        }
      },
      (error) => {
        this.getArticlesTimeout = setTimeout(() => {
          this.fetchCMSContents();
        }, 5000);
      }
    );
  }

  fetchCMSArticleCategory() {
    this.cateStartTime = new Date();

    const queryOptions = {};

    this.cmsService.fetchCMSArticleCategories(queryOptions).then(
      (response: any) => {
        const cateEnd: any = new Date();
        const cateUseTime = cateEnd - this.cateStartTime;
        if (response && response.length > 0) {
          this.articleCategories = response.slice(0, 4);
          response.forEach((cate) => {
            if (cate.Image) {
              cate.Image = cate.Image
                .replace('(', '%28')
                .replace(')', '%29');
            }
          });
          const msg = `Performance: Content library page get article category, ${cateUseTime}ms`;
          this.loggerService.info(msg);
        } else {
          const msg = `Performance: Content library page not have this Language article category, ${cateUseTime}ms`;
          this.loggerService.info(msg);
        }
      },
      (error) => {
        setTimeout(() => {
          this.fetchCMSArticleCategory();
        }, 5000);
      }
    );
  }

  clickCategory(categoryId: string) {
    if (this.selectedCategoryId === categoryId) {
      return false;
    }
    this.isCategoryArticlesShow = true;
    this.selectedCategoryId = categoryId;
    clearTimeout(this.getArticlesTimeout);
    this.fetchCMSArticles(categoryId);
  }

  onInnerBack() {
    clearTimeout(this.getArticlesTimeout);
    this.isCategoryArticlesShow = false;
    this.selectedCategoryId = '';
    if (this.backupContentArticles.length > 0) {
      this.articlesType = SupportContentStatus.Content;
      this.articles = cloneDeep(this.backupContentArticles);
    } else {
      this.fetchCMSContents();
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
        if (response && response.length > 0) {
          response.forEach((article) => {
            article.DataSource = ContentSource.CMS;
            if (article.Thumbnail) {
              article.Thumbnail = article.Thumbnail
                .replace('(', '%28')
                .replace(')', '%29');
            }
          });
          this.articles = response;
          this.articlesType = SupportContentStatus.Articles;
        } else {
          this.articles = [];
          this.articlesType = SupportContentStatus.Empty;
        }
      },
      (error) => {
        if (lang.toLowerCase() !== 'en') {
          this.getArticlesTimeout = setTimeout(() => {
            this.fetchCMSArticles(categoryId, 'en');
          }, 5000);
        }
      }
    );
  }


}
