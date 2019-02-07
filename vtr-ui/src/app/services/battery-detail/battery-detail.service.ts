import { Injectable } from '@angular/core';
import { BaseBatteryDetail } from './base-battery-detail';
import { Observable } from 'rxjs';
import BatteryDetail from 'src/app/data-models/battery/battery-detail.model';

@Injectable({
	providedIn: 'root'
})
export class BatteryDetailService implements BaseBatteryDetail {

	constructor() { }

	/**
	 * return data from mock json file
	 */
	getBatteryDetail(): Observable<BatteryDetail[]> {
		return null;
	}
}
