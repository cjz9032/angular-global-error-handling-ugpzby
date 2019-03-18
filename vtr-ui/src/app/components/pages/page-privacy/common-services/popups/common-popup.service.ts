import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { filter } from 'rxjs/operators';

interface PopUpInterface {
	popUpId: string;
}

export type CommonPopupEventType = {
	id: string,
	isOpenState: boolean
}

@Injectable({
	providedIn: 'root'
})
export class CommonPopupService {
	constructor() {
	}

	private subjectState = new ReplaySubject<CommonPopupEventType>(5);

	openState$(id: string) {
		return this.subjectState
			.asObservable()
			.pipe(
				filter((value) => value.id === id)
			);
	}

	open(id: string) {
		this.subjectState.next({id, isOpenState: true});
	}

	close(id: string) {
		this.subjectState.next({id, isOpenState: false});
	}
}
