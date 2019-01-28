import {Component, OnInit} from '@angular/core';

@Component({
	selector: 'vtr-widget-questions',
	templateUrl: './widget-questions.component.html',
	styleUrls: ['./widget-questions.component.scss']
})
export class WidgetQuestionsComponent implements OnInit {

  title: string = "Q&A's for your machine";
  description: string = "Description of component";
  qAndA: any = [
    {icon: 'fa-plane', question: 'Reduced batterylife working outside.'},
    {icon: 'fa-plane', question: 'Can I use my Ideapad while in an airplane?'},
    {icon: 'fa-edge', question: 'Will the security control scanner damage'},
    {icon: 'fa-amazon', question: 'Reduced batterylife working outside.'},
    {icon: 'fa-envira', question: 'Can I use my Ideapad while in an airplane?'},
    {icon: 'fa-chrome', question: 'Will the security control scanner damage'}
  ];
	constructor() { }

	ngOnInit() {
	}

}




