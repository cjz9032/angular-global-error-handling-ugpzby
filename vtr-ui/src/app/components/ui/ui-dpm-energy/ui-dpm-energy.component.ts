import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'vtr-ui-dpm-energy',
  templateUrl: './ui-dpm-energy.component.html',
  styleUrls: ['./ui-dpm-energy.component.scss']
})
export class UiDpmEnergyComponent implements OnInit {
  @Input() value: number;
  private totalCount = 7;
  items: boolean[] = [];

  constructor() { }

  ngOnInit(): void {
    if (this.value < 0) this.value = 0;
    if (this.value > this.totalCount) this.value = this.totalCount;
    for (let i = 0; i < this.totalCount; i++) {
      if (i < this.value)
        this.items.push(true);
      else
        this.items.push(false);
    }
  }


}
