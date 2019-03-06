import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'vtr-scan-steps',
  templateUrl: './scan-steps.component.html',
  styleUrls: ['./scan-steps.component.scss']
})
export class ScanStepsComponent implements OnInit {
  @Input() innerIndent: boolean;
  @Input() steps: Array<{text: string, subtext: string}>;
  constructor() { }

  ngOnInit() {
  }

}
