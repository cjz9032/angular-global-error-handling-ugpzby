import { Component, OnInit } from '@angular/core';
import { TopRowFunctionsIdeapadService } from './top-row-functions-ideapad.service';

@Component({
	selector: 'vtr-top-row-functions-ideapad',
	templateUrl: './top-row-functions-ideapad.component.html',
	styleUrls: ['./top-row-functions-ideapad.component.scss']
})
export class TopRowFunctionsIdeapadComponent implements OnInit {

	constructor(
		private topRowFunctionsIdeapadService: TopRowFunctionsIdeapadService
	) {
	}

	ngOnInit() {
	}

}
