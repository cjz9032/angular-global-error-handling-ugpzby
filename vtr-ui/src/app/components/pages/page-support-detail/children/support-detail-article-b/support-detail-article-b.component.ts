import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'vtr-support-detail-article-b',
  templateUrl: './support-detail-article-b.component.html',
  styleUrls: ['./support-detail-article-b.component.scss']
})
export class SupportDetailArticleBComponent implements OnInit {
  @Input() langCode: string;

  constructor() { }

  ngOnInit(): void {
  }

}
