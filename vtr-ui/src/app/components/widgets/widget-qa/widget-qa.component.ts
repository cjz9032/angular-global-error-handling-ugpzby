import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SecurityQaService } from 'src/app/services/security/securityQa.service';
import { MetricService } from 'src/app/services/metric/metric.service';

@Component({
  selector: 'vtr-widget-qa',
  templateUrl: './widget-qa.component.html',
  styleUrls: ['./widget-qa.component.scss']
})
export class WidgetQaComponent implements OnInit {

  mainTitle = 'Q&A';
  openId = null;
  questions;
  isCollapse = false;
  metricsValue: any;

  constructor(
	  private qaService: SecurityQaService,
	  public metrics: MetricService) {
	  this.questions = this.qaService.question;
   }

  ngOnInit() {
  }

  openAccordion(index) {
	this.openId = this.openId === index ? null : index;
	this.isCollapse = this.openId === index ? true : !this.isCollapse;
	this.metricsValue = this.isCollapse ? 'expand' : 'collapse';
	const metricsData = {
		ItemParent: 'Security',
		ItemName: `QuestionsAndAnswersItem-${this.questions[index].id}-${this.metricsValue}`,
		ItemType: 'FeatureClick',
		ItemParm: {
			QuestionsAndAnswersId: this.questions[index].id
		}
	};
	this.metrics.sendMetrics(metricsData);
  }

}
