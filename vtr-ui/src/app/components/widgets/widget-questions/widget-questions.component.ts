import {Component, OnInit, Input} from '@angular/core';


@Component({
	selector: 'vtr-widget-questions',
	templateUrl: './widget-questions.component.html',
	styleUrls: ['./widget-questions.component.scss']
})
export class WidgetQuestionsComponent implements OnInit {

	@Input() title: string;
	@Input() subtitle: string;
	@Input() data: QAndA[];

	constructor() {
	}


	ngOnInit() {
		this.title = this.title || "Q&A's for your machine";
		this.subtitle = this.subtitle || "FIND ANSWERS FOR YOUR IDEAPAD";
		this.data = this.data || [{
			icon: 'fa-plane',
			text: ' Reduced batterylife working outside.',
			route: '/support'
		}, {icon: 'fa-plane', text: 'Can I use my Ideapad while in an airplane?', route: '/support'}, {
			icon: 'fa-plane',
			text: 'Will the security control scanner damage',
			route: '/support'
		}, {icon: 'fa-plane', text: 'Will the security control scanner damage', route: '/support'}]
	}

}


interface QAndA {
	icon: string;
	text: string;
	route: string;
}

