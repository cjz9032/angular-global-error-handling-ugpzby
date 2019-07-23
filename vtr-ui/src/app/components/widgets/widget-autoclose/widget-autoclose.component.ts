import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'vtr-widget-autoclose',
  templateUrl: './widget-autoclose.component.html',
  styleUrls: ['./widget-autoclose.component.scss']
})
export class WidgetAutocloseComponent implements OnInit {
  @Input() introTitle: string;
  public title: string;
  constructor() { }

  ngOnInit() {
    this.title = this.introTitle;
  }

}
