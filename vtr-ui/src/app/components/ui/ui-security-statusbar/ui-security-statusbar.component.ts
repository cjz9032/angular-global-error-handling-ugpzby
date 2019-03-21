import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'vtr-ui-security-statusbar',
  templateUrl: './ui-security-statusbar.component.html',
  styleUrls: ['./ui-security-statusbar.component.scss']
})
export class UiSecurityStatusbarComponent implements OnInit {

  @Input() status: string;
  @Input() title: string;
  @Input() buttonTitle: string;
  @Input() metricsItem: string;

  constructor() { }

  ngOnInit() {
  }

  statusClass(): string {
    switch(this.status) {
      case 'enabled':
        return 'icon-check';
      case 'installed':
        return 'icon-dot';
      case 'disabled':
        return 'icon-times';
      case 'not-installed':
        return 'icon-times';
    }
  }

  statusIcon(): Array<string> {
    switch(this.status) {
      case 'enabled':
        return ['fas', 'check'];
      case 'installed':
        return ['fas'];
      case 'disabled':
        return ['fas', 'times'];
      case 'not-installed':
        return ['fas', 'times'];
    }
  }

  textClass(): string {
    switch(this.status) {
      case 'enabled':
        return 'badge-success';
      case 'installed':
        return 'badge-primary';
      case 'disabled':
        return 'badge-danger';
      case 'not-installed':
        return 'badge-danger';
    }
  }

}
