import { Injectable } from '@angular/core';
import { CommsService } from '../comms/comms.service';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { LocalInfoService } from '../local-info/local-info.service';
import { CommonService } from '../common/common.service';
import { DevService } from '../dev/dev.service';
import { LoggerService } from '../logger/logger.service';
import { UPEService } from '../upe/upe.service';
import { CMSService } from '../cms/cms.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { ContentActionType, ContentSource } from 'src/app/enums/content.enum';
import { BuildInContentService } from '../build-in-content/build-in-content.service';

@Injectable({
  providedIn: 'root'
})
export class ContentCacheService {
  private buildInContents = {};
  private buildInArticls = {};

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
    private logger: LoggerService) {

  }

  public async getCachedContents(page: string, contentCards: any) {
    return this.loadBuildInContents({Page: page, Lang:'en'});
  }

  getArticleById(actionType: ContentActionType, articleId: any) {
    return new Observable(subscriber => {

    });
  }

  private async loadBuildInContents(queryParams: any) {
    const key = `${queryParams.Page}_${queryParams.Lang}`;
    if(this.buildInContents[key]) {
      return this.buildInContents[key];
    }
    
    const contents = await this.buildInContentService.getContents(queryParams);
    const contentIds = Object.keys(contents);
    contentIds.forEach(id=>{
      contents[id] = this.formalizeContent(contents[id], id, ContentSource.Local);
    })
    this.buildInContents[key] = contents;
    return contents;
  }

  private async loadCachedContents() {

  }

  private async cacheContents() {

  }
  
  private formalizeContent(contents, cardId, dataSource) {
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
