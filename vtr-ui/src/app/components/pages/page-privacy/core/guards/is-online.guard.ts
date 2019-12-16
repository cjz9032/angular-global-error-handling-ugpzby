import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { CommonService } from '../../../../../services/common/common.service';

@Injectable({
	providedIn: 'root'
})
export class IsOnlineGuard implements CanActivate {

	constructor(private commonService: CommonService) {
	}

	canActivate() {
		return this.commonService.isOnline;
	}
}
