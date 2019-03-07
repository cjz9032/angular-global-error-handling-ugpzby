import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'vtr-scan-steps',
  templateUrl: './scan-steps.component.html',
  styleUrls: ['./scan-steps.component.scss']
})


export class ScanStepsComponent implements OnInit {
  @Input() innerIndent: boolean;
  @Input() steps: 'scanSteps' | 'verifyPopUpSteps';

  constructor() { }

  private scanSteps = [
    {text: 'Enter your email', subtext: 'We’ll search the internet and the dark web for your info'},
    {text: 'Verify it’s you', subtext: 'Check your email for a verification code'},
    {text: 'See your privacy level', subtext: 'Find out if you have control of your privacy online.'}
  ];
  private verifyPopUpSteps = [
    {text: 'email', subtext: 'text'},
    {text: 'text2', subtext: 'text2'},
    {text: 'text 3', subtext: 'text3'}
  ];
  private _steps = [];

  ngOnInit() {
    if (this[this.steps]) {
      this._steps = this[this.steps];
    } else {
      console.error('invalid param steps in ScanStepsComponent');
    }
  }

}
