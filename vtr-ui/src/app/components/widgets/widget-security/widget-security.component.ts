import { Component, Input, OnInit } from '@angular/core';
// import { LandingTitle } from '@lenovo/tan-client-bridge';

@Component({
	selector: 'vtr-widget-security',
	templateUrl: './widget-security.component.html',
	styleUrls: ['./widget-security.component.scss']
})
export class WidgetSecurityComponent implements OnInit {
	@Input() percentValue: number = this.percentValue || 100;
	titleString = {
		fully: {
			title: 'Fully protected',
			subTitle: 'Congratulations! You are well protected.',
			buttonText: 'SECURITY ADVISOR 101'
		},
		notFully: {
			title: 'Not fully protected',
			subTitle: 'You are not fully protected, Learn how to better protect yourself now.',
			buttonText: 'SECURITY ADVISOR 101'
		}
	};
	titleObj = {
		title: '',
		subTitle1: '',
		subTitle2: '',
		buttonText: '',
	};
	// titleObj: LandingTitle;
	constructor() {	}

	ngOnInit() {
		if (this.percentValue === 100) {
			this.titleObj.title = this.titleString.fully.title;
			this.titleObj.subTitle1 = this.titleString.fully.subTitle;
			this.titleObj.buttonText = this.titleString.fully.buttonText;
		} else {
			this.titleObj.title = this.titleString.notFully.title;
			this.titleObj.subTitle1 = this.titleString.notFully.subTitle;
			this.titleObj.buttonText = this.titleString.notFully.buttonText;
		}
	}

	buttonClick() {

	}
}
