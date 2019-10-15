import { Injectable, OnDestroy } from '@angular/core';
import { VantageShellService } from '../../../../../../services/vantage-shell/vantage-shell.service';
import { Capability, TopRowFunctionsIdeapad } from './top-row-functions-ideapad.interface';
import { from, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class TopRowFunctionsIdeapadService implements OnDestroy {
	topRowFunctionsIdeaPadFeature: TopRowFunctionsIdeapad;
	private capabilities: Capability[];
	capabilities$;

	constructor(
		private shellService: VantageShellService
	) {
		this.topRowFunctionsIdeaPadFeature = this.shellService.getTopRowFunctionsIdeapad();
	}

	getCapability(): Observable<Capability[]> {
		if (this.capabilities) {
			return of(this.capabilities);
		}
		this.capabilities$ = from(this.topRowFunctionsIdeaPadFeature.getCapability())
			.pipe(
				map(res => res.payload.capabilityList)
			);
		return this.capabilities$;
	}

	ngOnDestroy(): void {
		this.capabilities$.unsubscribe();
	}
}
