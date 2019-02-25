import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'vtr-light-privacy-banner',
  templateUrl: './light-privacy-banner.component.html',
  styleUrls: ['./light-privacy-banner.component.scss']
})
export class LightPrivacyBannerComponent implements OnInit {
  @Input() data: {title: string, text, string};

  constructor() { }

  ngOnInit() {
  }

}
