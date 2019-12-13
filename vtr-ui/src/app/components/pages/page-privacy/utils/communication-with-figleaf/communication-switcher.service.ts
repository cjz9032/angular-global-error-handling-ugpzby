import { Injectable } from '@angular/core';
import { BehaviorSubject, timer } from 'rxjs';
import { take } from 'rxjs/operators';

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
		timer(1000).pipe(take(1)).subscribe(() => this.isPullingActive.next(true));
	}
}
