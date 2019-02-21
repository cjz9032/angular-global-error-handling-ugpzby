import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'vtr-connected-home',
	templateUrl: './connected-home.component.html',
	styleUrls: ['./connected-home.component.scss']
})
export class ConnectedHomeComponent implements OnInit {

	constructor() { }

	ngOnInit() {
	}

	startTrial(event) {
		console.log('startTrial', event);
	}

	enterActivationCode(event) {
		console.log('enterActivationCode', event);
	}
}
