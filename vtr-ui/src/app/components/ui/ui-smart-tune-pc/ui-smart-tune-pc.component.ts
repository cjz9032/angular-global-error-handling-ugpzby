import { Component, OnInit } from '@angular/core';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'vtr-ui-smart-tune-pc',
  templateUrl: './ui-smart-tune-pc.component.html',
  styleUrls: ['./ui-smart-tune-pc.component.scss']
})
export class UiSmartTunePcComponent implements OnInit {
	activeTab = "";
  constructor() { }

  ngOnInit() {
  }
  public fetchSmartTabId($event: NgbTabChangeEvent) {
    //	activeTab = $event.nextId
    this.activeTab = $event.nextId;
  }
}
