import { Component, OnInit, Input } from '@angular/core';
import { AntivirusCommon } from 'src/app/data-models/security-advisor/antivirus-common.model';

@Component({
  selector: 'vtr-widget-mcafee-metric',
  templateUrl: './widget-mcafee-metric.component.html',
  styleUrls: ['./widget-mcafee-metric.component.scss']
})
export class WidgetMcafeeMetricComponent implements OnInit {

  @Input() metricsList: Array<any>;
  @Input() showMetricButton;
  @Input() common: AntivirusCommon;
  constructor() {
  }

  ngOnInit() {
  }

}
