import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

import BatteryDetail from 'src/app/data-models/battery/battery-detail.model';
import { BaseBatteryDetail } from './base-battery-detail';

@Injectable({
	providedIn: 'root'
})
export class BatteryDetailMockService  {

	constructor(
		private http: HttpClient
	) {
	}
}
