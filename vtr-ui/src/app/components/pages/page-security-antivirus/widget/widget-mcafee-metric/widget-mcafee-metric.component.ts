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
  scanData = [
	  {
		icon: 'assets/icons/SecurityAdvisor/Files_Scanned.svg',
		name: 'security.antivirus.mcafee.fileScan'

	  }, {
		icon: 'assets/icons/SecurityAdvisor/Virus_White.svg',
		name: 'security.antivirus.mcafee.Viruses'
	  }, {
		icon: 'assets/icons/SecurityAdvisor/Hacker_Icon.svg',
		name: 'security.antivirus.mcafee.blocked'
	  }, {
		icon: 'assets/icons/SecurityAdvisor/Files_Shredded.svg',
		name: 'security.antivirus.mcafee.shredded'
	  }
  ];
  constructor() {
  }

  ngOnInit() {
  }

}
