import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SecurityQaService } from 'src/app/services/security/securityQa.service';

@Component({
  selector: 'vtr-widget-qa',
  templateUrl: './widget-qa.component.html',
  styleUrls: ['./widget-qa.component.scss']
})
export class WidgetQaComponent implements OnInit {

  mainTitle = 'Q&A';
  openId = null;
  questions;
  constructor(private qaService: SecurityQaService) {
	  this.questions = this.qaService.question;
   }

  ngOnInit() {
  }

  openAccordion(index) {
	this.openId = this.openId === index ? null : index;
  }

}
