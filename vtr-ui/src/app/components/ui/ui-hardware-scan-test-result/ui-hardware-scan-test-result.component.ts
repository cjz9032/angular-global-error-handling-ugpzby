import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'vtr-ui-hardware-scan-test-result',
  templateUrl: './ui-hardware-scan-test-result.component.html',
  styleUrls: ['./ui-hardware-scan-test-result.component.scss']
})
export class UiHardwareScanTestResultComponent implements OnInit {

  @Input() module: any;

  constructor() { }

  ngOnInit(): void { }
  
}
