import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'vtr-ui-smart-performance-scanning',
  templateUrl: './ui-smart-performance-scanning.component.html',
  styleUrls: ['./ui-smart-performance-scanning.component.scss']
})
export class UiSmartPerformanceScanningComponent implements OnInit {
	@Input() showProgress = true;
	@Input() percent = 0;
	@Input() isCheckingStatus = false;
  constructor() { }

  ngOnInit() {
  }

}
