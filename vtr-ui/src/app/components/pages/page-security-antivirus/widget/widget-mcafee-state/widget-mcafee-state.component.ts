import { Component, OnInit, Input } from '@angular/core';
import { AntivirusCommon } from 'src/app/data-models/security-advisor/antivirus-common.model';

@Component({
  selector: 'vtr-widget-mcafee-state',
  templateUrl: './widget-mcafee-state.component.html',
  styleUrls: ['./widget-mcafee-state.component.scss']
})
export class WidgetMcafeeStateComponent implements OnInit {

  @Input() statusList: Array<any>;
  @Input() common: AntivirusCommon;
  constructor() {
  }
  ngOnInit() {
  }

}
