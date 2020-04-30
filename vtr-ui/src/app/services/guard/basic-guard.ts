import { CommonService } from '../common/common.service';
import { UrlTree } from '@angular/router';
import { GuardConstants } from './guard-constants';

export abstract class BasicGuard {
    guardFallbackRoute : UrlTree | boolean;
    constructor (commonService: CommonService, guardConstants: GuardConstants) {
        this.guardFallbackRoute = commonService.isFirstPageLoaded() ? false : guardConstants.defaultRoute;
    }
}