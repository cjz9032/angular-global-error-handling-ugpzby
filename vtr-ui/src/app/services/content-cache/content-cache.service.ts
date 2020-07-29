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

@Injectable({
  providedIn: 'root'
})
export class ContentCacheService {

  constructor(
    private commsService: CommsService,
    private vantageShellService: VantageShellService,
    private localInfoService: LocalInfoService,
    private commonService: CommonService,
    private devService: DevService,
    private http: HttpClient,
    private cmsService: CMSService,
    private upeService: UPEService,
    private logger: LoggerService) {

  }

  getCachedContents() {
    return new Observable(subscriber => {
      
    });
  }

  getArticleById(articleId: any) {
    return new Observable(subscriber => {

    });
  }

  private async loadBuildInContents() {

  }

  private async loadCachedContents() {

  }

  private async cacheContents() {

  }
}
