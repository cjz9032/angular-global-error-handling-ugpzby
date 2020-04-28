import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'vtr-support-detail-article-d',
  templateUrl: './support-detail-article-d.component.html',
  styleUrls: ['./support-detail-article-d.component.scss']
})
export class SupportDetailArticleDComponent implements OnInit {
  @Input() langCode: string;

  constructor() { }

  ngOnInit(): void {
  }

}
