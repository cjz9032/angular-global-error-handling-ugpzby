import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { instanceDestroyed } from '../../../utils/custom-rxjs-operators/instance-destroyed';
import { RouterChangeHandlerService } from '../../services/router-change-handler.service';

@Component({
	selector: 'vtr-no-issue-pitch',
	templateUrl: './no-issue-pitch.component.html',
	styleUrls: ['./no-issue-pitch.component.scss']
})
export class NoIssuePitchComponent implements OnInit, OnDestroy {


	constructor(private routerChangeHandlerService: RouterChangeHandlerService) {
	}

	ngOnInit() {
		this.routerChangeHandlerService.onChange$
			.pipe(
				takeUntil(instanceDestroyed(this)),
			)
			.subscribe(
				(currentPath) => console.log(currentPath)
			);
	}

	ngOnDestroy() {}

}
