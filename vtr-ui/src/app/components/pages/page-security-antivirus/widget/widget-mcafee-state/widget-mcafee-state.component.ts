import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AntivirusCommon } from 'src/app/data-models/security-advisor/antivirus-common.model';

@Component({
  selector: 'vtr-widget-mcafee-state',
  templateUrl: './widget-mcafee-state.component.html',
  styleUrls: ['./widget-mcafee-state.component.scss']
})
export class WidgetMcafeeStateComponent implements OnInit {

  @Input() statusList: Array<any>;
  @Input() common: AntivirusCommon;
  @Input() windowsDefender = false;
  @Input() url: string;
  @Input() isOnline: boolean;
  @Output() retryClick = new EventEmitter<any>();

  windowsMcAfee = [{
	status: 'not-installed',
	title: 'security.antivirus.windowsDefender.virus'
  }, {
	status: 'not-installed',
	title: 'security.antivirus.windowsDefender.homeNetwork'
  }, {
	status: 'not-installed',
	title: 'security.antivirus.windowsDefender.private'
  }, {
	status: 'not-installed',
	title: 'security.antivirus.windowsDefender.everyDevice'
  }, {
	status: 'not-installed',
	title: 'security.antivirus.windowsDefender.password'
  }];
  windowsList;
  constructor() {
  }
  ngOnInit() {
	if (this.windowsDefender && this.url) {
		this.statusList = this.windowsMcAfee;
	}

	if (this.windowsDefender && !this.url) {
		this.windowsList = this.windowsMcAfee.slice(2);
	}
  }

  retry(item) {
	  this.retryClick.emit(item.type);
  }
}
