import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'vtr-container-card-offline',
  templateUrl: './container-card-offline.component.html',
  styleUrls: ['./container-card-offline.component.scss']
})
export class ContainerCardOfflineComponent implements OnInit {

  @Input() containerCardId: string;

  constructor() { }

  ngOnInit() {
  }

}
