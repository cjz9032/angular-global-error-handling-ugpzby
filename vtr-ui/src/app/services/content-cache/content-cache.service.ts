import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Md5 } from "ts-md5";
import { CommsService } from '../comms/comms.service';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { LocalInfoService } from '../local-info/local-info.service';
import { CommonService } from '../common/common.service';
import { DevService } from '../dev/dev.service';
import { LoggerService } from '../logger/logger.service';
import { UPEService } from '../upe/upe.service';
import { CMSService } from '../cms/cms.service';
import { ContentActionType, ContentSource } from 'src/app/enums/content.enum';
import { BuildInContentService } from '../build-in-content/build-in-content.service';
import { Subscription } from 'rxjs';
import { SelfSelectService, SegmentConst } from '../self-select/self-select.service';
import { HypothesisService } from '../hypothesis/hypothesis.service';
import { DashboardService } from '../dashboard/dashboard.service';
import { icon } from '@fortawesome/fontawesome-svg-core';


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
  private buildInArticls = {};
  private contentLocalCacheContract: any;

  constructor(
    private commsService: CommsService,
    private vantageShellService: VantageShellService,
    private localInfoService: LocalInfoService,
    private commonService: CommonService,
    private devService: DevService,
    private http: HttpClient,
    private cmsService: CMSService,
    private upeService: UPEService,
    private buildInContentService: BuildInContentService,
    private logger: LoggerService,
    private selfselectService: SelfSelectService,
    private hypService: HypothesisService,
    private dashboardService: DashboardService) {
    this.contentLocalCacheContract = this.vantageShellService.getContentLocalCache();
  }

  public async getCachedContents(page: string, contentCards: any) {
    const cmsOptions = await this.cmsService.generateContentQueryParams({ Page: page });
    const cacheKey = Md5.hashStr(JSON.stringify(cmsOptions));

    var cachedContents = await this.loadCachedContents(cacheKey) || await this.loadBuildInContents(cmsOptions);

    this.cacheContents(cacheKey, cmsOptions, contentCards);

    return cachedContents;
  }

  public async getArticleById(actionType: ContentActionType, articleId: any) {
    const locInfo = await this.cmsService.getLocalinfo();
    if (actionType == ContentActionType.BuildIn) {
      return this.buildInContentService.getArticle(articleId, locInfo.Lang);
    }
    else {
      return this.cmsService.fetchCMSArticle(articleId);
    }
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
    return null;
  }

  private async cacheContents(cacheKey, cmsOptions: any, contentCards: any) {
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
        await this.fillCacheValue(response, contentCards, cacheValueOfContents);
        this.saveContents(cacheKey, cacheValueOfContents);
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

  private saveContents(cacheKey: string, cacheValueOfContents: any) {
    let iCacheSettings: ICacheSettings = {
      Key: cacheKey,
      Value: JSON.stringify(cacheValueOfContents),
      Component: "ContentCache",
      UserName: "ContentCache_Contents"
    }
    this.contentLocalCacheContract.set(iCacheSettings);
  }

  private async fetchCMSContent(cmsOptions: any, contentCards: any) {
    return await this.cmsService.fetchContents(cmsOptions);
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
      throw ex;
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
      if (i == 0 && content.ExpirationDate == null) {
        return new Array(content);
      }
      if (content.ExpirationDate != null) {
        if (result.length == 1) {
           continue;
        }
        result.push(content);
      } else {
        result.push(content);
        if (result.length == 2) {
           break;
        }
      }
    }
    return result;
  }

  private formalizeContent(contents, cardId, dataSource?) {
    contents.forEach(content => {
      if (content.BrandName) {
        content.BrandName = content.BrandName.split('|')[0];
      }
      content.DataSource = dataSource;
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
