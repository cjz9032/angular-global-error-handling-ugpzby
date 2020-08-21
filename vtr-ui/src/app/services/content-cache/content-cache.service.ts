import { Injectable } from '@angular/core';
import { Md5 } from "ts-md5";
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { LocalInfoService } from '../local-info/local-info.service';
import { LoggerService } from '../logger/logger.service';
import { UPEService } from '../upe/upe.service';
import { CMSService } from '../cms/cms.service';
import { ContentActionType, ContentSource } from 'src/app/enums/content.enum';
import { BuildInContentService } from '../build-in-content/build-in-content.service';
import { SegmentConst } from '../self-select/self-select.service';
import { MetricService } from '../metric/metrics.service';

interface IConfigItem {
  cardId: string;
  displayContent: any;
  template: string;
  positionParam: string;
  tileSource: string;
  cmsContent: any;
  upeContent: any;
}

interface ICacheSettings {
  Key: string,
  Value: string,
  Component: string,
  UserName: string
}

@Injectable({
  providedIn: 'root'
})
export class ContentCacheService {
  private buildInContents = {};
  private contentLocalCacheContract: any;

  constructor(
    private vantageShellService: VantageShellService,
    private localInfoService: LocalInfoService,
    private cmsService: CMSService,
    private upeService: UPEService,
    private buildInContentService: BuildInContentService,
    private logger: LoggerService,
    private metrics: MetricService) {
    this.contentLocalCacheContract = this.vantageShellService.getContentLocalCache();
  }

  public async getCachedContents(page: string, contentCards: any) {
    const startTime = new Date();
    const cmsOptions = await this.cmsService.generateContentQueryParams({ Page: page });
    const cacheKey = Md5.hashStr(JSON.stringify(cmsOptions));

    var cachedContents = await this.loadCachedContents(cacheKey) || await this.loadBuildInContents(cmsOptions);
    this.sendCacheMetrics(startTime, 'loadedCacheContents');

    this.cacheContents(cacheKey, cmsOptions, contentCards);

    return cachedContents;
  }

  public async getArticleById(actionType: ContentActionType, articleId: any) {
    const loclInfo = await this.cmsService.getLocalinfo();
    if (actionType == ContentActionType.BuildIn) {
      return this.buildInContentService.getArticle(articleId, loclInfo.Lang);
    } else {
      var article = await this.getCachedArticle(articleId, loclInfo.Lang);
      if (article) {
        return article;
      }
      return this.cmsService.fetchCMSArticle(articleId);
    }
  }

  private sendCacheMetrics(startTime, metricsName){
    const endTime = new Date();
    const diff = endTime.getTime() - startTime.getTime();
    
    const metricsData = {
      ItemParent: 'ContentCache',
      ItemType: metricsName,
      ItemName: 'TimeDuration(ms)',
      ItemValue: diff
    };
    this.metrics.sendMetrics(metricsData);
  }

  private async loadBuildInContents(queryParams: any) {
    const key = `${queryParams.Page}_${queryParams.Lang}`;
    if (this.buildInContents[key]) {
      return this.buildInContents[key];
    }

    const contents = await this.buildInContentService.getContents(queryParams);
    const contentIds = Object.keys(contents);
    contentIds.forEach(id => {
      contents[id] = this.formalizeContent(contents[id], id, ContentSource.Local);
    })
    this.buildInContents[key] = contents;
    return contents;
  }

  private async loadCachedContents(cacheKey) {
    let iCacheSettings: ICacheSettings = {
      Key: cacheKey,
      Value: null,
      Component: "ContentCache",
      UserName: "ContentCache_Contents"
    };
    const cachedObject = await this.contentLocalCacheContract.get(iCacheSettings);
    if (cachedObject && cachedObject.Value) {
      const contents = JSON.parse(cachedObject.Value);
      const contentIds = Object.keys(contents);
      contentIds.forEach(id => {
        contents[id] = this.removeInvalidContents(contents[id], id);
        contents[id] = this.formalizeContent(contents[id], id);
      });
      return contents;
    }
    return undefined;
  }

  private removeInvalidContents(contents, cardId) {
    const array = [];
    contents.forEach(content => {
      if (cardId !== 'positionA' && array.length > 0) {
        return;
      }
      if (this.canDisplay(content.DisplayStartDate) && !this.hasExpirated(content.ExpirationDate)) {
        array.push(content);
      }
    });

    return array;
  }

  private canDisplay(displayStartDate) {
    if (displayStartDate == null) {
      return true;
    }
    return new Date(displayStartDate) < new Date();
  }

  private hasExpirated(expirationDate) {
    if (expirationDate == null) {
      return false;
    }
    return new Date(expirationDate) < new Date();
  }

  private async cacheContents(cacheKey, cmsOptions: any, contentCards: any) {
    const startTime = new Date();
    Promise.all([this.fetchCMSContent(cmsOptions, contentCards), this.fetchUPEContent(contentCards)])
      .then(async response => {
        let cacheValueOfContents = {
          "positionA": [],
          "positionB": [],
          "positionC": [],
          "positionD": [],
          "positionE": [],
          "positionF": [],
          "welcome-text": []
        }
        await this.fillCacheValue(response, contentCards, cacheValueOfContents)
        const contents = await this.getUpdatedContents(cacheKey, cacheValueOfContents);
        await this.saveContents(cacheKey, cacheValueOfContents);
        await this.cacheContentDetail(contents);
        this.sendCacheMetrics(startTime, 'fetchedCacheContents');
      }).catch(error => {
        this.logger.error('cacheContents error ', error);
      });
  }

  private async fillCacheValue(response: any, contentCards: any, cacheValueOfContents: any) {
    const cmsContents = response[0];
    if (cmsContents && cmsContents.length > 0) {
      this.populateContent(cmsContents, contentCards, ContentSource.CMS, cacheValueOfContents);
      const welcomeTextContent = this.cmsService.getOneCMSContent(cmsContents, 'top-title-welcome-text', 'welcome-text')[0];
      if (welcomeTextContent && welcomeTextContent.Title) {
        const localInfo = await this.getLocalInfo();
        if ([SegmentConst.Consumer, SegmentConst.SMB].includes(localInfo.Segment)) {
          cacheValueOfContents['welcome-text'] = new Array(welcomeTextContent);
        } else {
          cacheValueOfContents['welcome-text'] = [];
        }
      }
    }
    const upeContents = response[1];
    if (upeContents && upeContents.length > 0) {
      this.populateContent(upeContents, contentCards, ContentSource.UPE, cacheValueOfContents);
    }
  }

  private async saveContents(cacheKey: string, cacheValueOfContents: any) {
    let iCacheSettings: ICacheSettings = {
      Key: cacheKey,
      Value: JSON.stringify(cacheValueOfContents),
      Component: "ContentCache",
      UserName: "ContentCache_Contents"
    }
    await this.contentLocalCacheContract.set(iCacheSettings);
  }

  private async getUpdatedContents(cacheKey: any, cacheValueOfContents: any) {
    const contents = [];
    let cachedContents = [];
    let iCacheSettings: ICacheSettings = {
      Key: cacheKey,
      Value: null,
      Component: "ContentCache",
      UserName: "ContentCache_Contents"
    };
    const cachedObj = await this.contentLocalCacheContract.get(iCacheSettings);
    if (cachedObj && cachedObj.Value) {
      cachedContents = JSON.parse(cachedObj.Value);
      for (const key in cacheValueOfContents) {
        if ("welcome-text" == key) {
          continue;
        }
        const contentList = cacheValueOfContents[key];
        const cachedContentList = cachedContents[key];
        this.findUpdatedContents(contentList, cachedContentList, contents);
        this.removeExpiredArticle(contentList, cachedContentList);
      }
    } else {
      for (const key in cacheValueOfContents) {
        cacheValueOfContents[key].forEach(content => {
          contents.push(content);
        });
      }
    }
  }

  private findUpdatedContents(contentList: any, cachedContentList: any, contents: any[]) {
    for (const index in contentList) {
      const content = contentList[index];
      let needUpdated = true;
      for (const idx in cachedContentList) {
        const cachedContent = cachedContentList[idx];
        if (content.Id == cachedContent.Id && 
          content.Revision == cachedContent.Revision) {
          needUpdated = false;
          break;
        }
      }
      if (needUpdated) {
        contents.push(content);
      }
    }
  }

  private removeExpiredArticle(contentList: any, cachedContentList: any) {

  }

  private cacheContentDetail(contents: any) {
    return new Promise(async (resolve, reject) => {
      const downLoadImages = [];
      if (contents && contents.length > 0) {
        const localInfo = await this.getLocalInfo();
        contents.forEach(content => {
          this.cacheContentImage(content, downLoadImages);
          this.cacheArticle(content, localInfo.Lang, downLoadImages);
        });
      }
      const downLoadImagesTimeInterval = setInterval(() => {
        const notComplete = downLoadImages.find(item => !item.complete);
        if (!notComplete) {
          clearInterval(downLoadImagesTimeInterval);
          resolve();
        }
      }, 500);
    });
  }

  private cacheContentImage(content: any, downLoadImages: any[]) {
    if (content.FeatureImage) {
      const image = new Image();
      image.src = content.FeatureImage;
      downLoadImages.push(image);
    }
  }

  private async cacheArticle(content: any, lang: string, downLoadImages: any[]) {
    const actionType = content.ActionType;
    const articId = content.ActionLink;
    if (actionType && actionType === 'Internal'
      && articId && !articId.startsWith('lenovo-vantage3:')
      && !articId.startsWith('dcc-demo')) {
      const response = await this.cmsService.fetchCMSArticle(articId);
      this.saveArticle(articId, lang, response);
      this.cacheArticleImage(response, downLoadImages);
    }
  }

  private saveArticle(articId: any, lang: any, response: any) {
    const key = `${articId}_${lang}`;
    let iCacheSettings: ICacheSettings = {
      Key: key,
      Value: JSON.stringify(response),
      Component: "ContentCache",
      UserName: "ContentCache_Articles"
    }
    this.contentLocalCacheContract.set(iCacheSettings);
  }

  private cacheArticleImage(response: any, downLoadImages: any[]) {
    if (response.Results.Image) {
      const image = new Image();
      image.src = response.Image;
      downLoadImages.push(image);
    }
    const body = response.Results.Body;
    const div = document.createElement('div');
    div.innerHTML = body;
    const images: any = div.getElementsByTagName('img');
    for (const element of images) {
      downLoadImages.push(element);
    }
    div.innerHTML = '';
  }

  private async fetchCMSContent(cmsOptions: any, contentCards: any) {
    try {
      return await this.cmsService.fetchContents(cmsOptions);
    } catch (ex) {
      this.logger.error('fech cms contents error.');
    }
  }

  private async fetchUPEContent(contentCards: any) {
    const contentCardList: IConfigItem[] = Object.values(contentCards);
    const upeContentCards = contentCardList.filter(contentCard => contentCard.tileSource === 'UPE');
    if (upeContentCards.length == 0) {
      return;
    }
    try {
      const upePositions = upeContentCards.map(contentCard => contentCard.positionParam);
      return await this.upeService.fetchUPEContent({ positions: upePositions });
    } catch (ex) {
      this.logger.error('fech upe contents error.');
    }
  }

  private async getLocalInfo() {
    return await this.localInfoService.getLocalInfo();
  }

  private populateContent(response: any, contentCards: any, dataSource: ContentSource, cacheValueOfContents: any) {
    const contentCardList: IConfigItem[] = Object.values(contentCards);
    contentCardList.filter(contentCard => contentCard.cardId != 'welcome-text').forEach(contentCard => {
      let contents: any = this.cmsService.getOneCMSContent(response, contentCard.template, contentCard.positionParam, dataSource);
      if (contents && contents.length > 0) {
        if (contentCard.positionParam != 'position-A') {
          contents = this.filterContentsByCondition(contents);
        }
        cacheValueOfContents[contentCard.cardId] = contents;
      }
    });
  }

  private filterContentsByCondition(contents: any) {
    const result = [];
    for (let i = 0; i < contents.length; i++) {
      const content = contents[i];
      if (i == 0) {
        result.push(content);
        if (content.ExpirationDate == null) {
          return result;
        }
      }
      if (content.ExpirationDate == null) {
        result.push(content);
        return result;
      }
    }
  }

  private async getCachedArticle(articId: any, lang: any) {
    const key = `${articId}_${lang}`;
    let iCacheSettings: ICacheSettings = {
      Key: key,
      Value: null,
      Component: "ContentCache",
      UserName: "ContentCache_Articles"
    }
    const cachedObject = await this.contentLocalCacheContract.get(iCacheSettings);
    if (cachedObject && cachedObject.Value) {
      return JSON.parse(cachedObject.Value);
    }
    return undefined;
  }

  private formalizeContent(contents, cardId, dataSource?) {
    contents.forEach(content => {
      if (content.BrandName) {
        content.BrandName = content.BrandName.split('|')[0];
      }
      if (dataSource) {
        content.DataSource = dataSource;
      }
    });

    if (cardId === 'positionA') {
      return contents.map((record) => {
        return {
          albumId: 1,
          id: record.Id,
          source: record.Title,
          title: record.Description,
          url: record.FeatureImage,
          ActionLink: record.ActionLink,
          ActionType: record.ActionType,
          OverlayTheme: record.OverlayTheme ? record.OverlayTheme : '',
          DataSource: record.DataSource
        };
      });

    } else {
      return contents[0];
    }
  }

}
