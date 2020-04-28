import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'vtr-support-detail-article-f',
  templateUrl: './support-detail-article-f.component.html',
  styleUrls: ['./support-detail-article-f.component.scss']
})
export class SupportDetailArticleFComponent implements OnInit {
  @Input() langCode: string;

  constructor() { }

  ngOnInit(): void {
  }

}
