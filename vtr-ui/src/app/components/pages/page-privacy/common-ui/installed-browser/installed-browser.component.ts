import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'vtr-installed-browser',
  templateUrl: './installed-browser.component.html',
  styleUrls: ['./installed-browser.component.scss']
})
export class InstalledBrowserComponent implements OnInit {
  @Input() installedBrowser: object;
  constructor() { }

  ngOnInit() {
  }

}
