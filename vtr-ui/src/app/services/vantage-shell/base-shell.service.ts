import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';


/**
 * interface for battery service. this will help to swap service easily once API is ready and implemented in
 * battery-detail.service.ts, for time being going to use battery-detail.service.mock.ts
 */
@Injectable({
	providedIn: 'root'
})
export abstract class BaseShellService {
	abstract getDashboard(): any;
}

