import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class CommunicationSwitcherService {
	private isPullingActive = new BehaviorSubject(true);

	isPullingActive$ = this.isPullingActive.asObservable();

	stopPulling() {
		this.isPullingActive.next(false);
	}

	startPulling() {
		this.isPullingActive.next(true);
	}
}
