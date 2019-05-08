import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {VantageShellService} from "../services/vantage-shell/vantage-shell.service";

@Injectable({
	providedIn: 'root'
})
export class PageGuardService {

	time:number;
	metrics:any;
	constructor(private shellService: VantageShellService) {
		this.metrics = shellService.getMetrics();
	}

	canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot):Observable<boolean>|Promise<boolean>|boolean {
     this.time=new Date().getTime();
		console.log('Activate : '+activatedRouteSnapshot.data.pageName);
     return true;
	}

	canDeactivate(component:Object,activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot):Observable<boolean>|Promise<boolean>|boolean {
		const data={
			ItemType:"PageView",
			PageName:activatedRouteSnapshot.data.pageName,
			PageDuration:new Date().getTime()-this.time
		}
		console.log('Deactivate : '+activatedRouteSnapshot.data.pageName,' >>>>>>>>>> ',data);
		this.metrics.sendAsync(data);

		return true;
	}
}
