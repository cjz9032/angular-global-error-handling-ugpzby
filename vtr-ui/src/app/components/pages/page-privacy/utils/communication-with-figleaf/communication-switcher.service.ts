import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class CommunicationSwitcherService {
	private isPullingActive = new BehaviorSubject(true);

	isPullingActive$ = this.isPullingActive.asObservable().pipe(delay(500));

	stopPulling() {
		this.isPullingActive.next(false);
	}

	startPulling() {
		this.isPullingActive.next(true);
	}
}
