import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'vtr-breached-account',
  templateUrl: './breached-account.component.html',
  styleUrls: ['./breached-account.component.scss']
})
export class BreachedAccountComponent implements OnInit {
  @Input() breached_account: {domain: string, breachDate: string, breachedEmail: string, breachedPassword: string, image: string};

  constructor() { }

  ngOnInit() {
  }

}
