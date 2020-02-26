import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { DeviceService } from 'src/app/services/device/device.service';

@Injectable({
	providedIn: 'root'
})
export class SubpageDeviceSettingsPowerDpmGuard implements CanActivate {

	constructor(
		private deviceService: DeviceService,
	) { }

	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		return this.deviceService.getMachineType().then((type) => {
			return type === 3;
		});
	}

}
