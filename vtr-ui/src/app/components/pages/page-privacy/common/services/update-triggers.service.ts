import { Injectable } from '@angular/core';
import { merge, Subject, timer } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class UpdateTriggersService {
	private windowFocused = new Subject<boolean>();
	private windowFocused$ = this.windowFocused.asObservable();
	shouldUpdate$ = merge(this.windowFocused$, timer(0, 30000));

	constructor() {
	}

	updateFocusedState(param: boolean) {
		this.windowFocused.next(param);
	}
}
