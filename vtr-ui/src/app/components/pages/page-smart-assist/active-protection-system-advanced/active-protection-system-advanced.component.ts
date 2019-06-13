import { Component, OnInit } from '@angular/core';
import { DropDownInterval } from '../../../../data-models/common/drop-down-interval.model';
@Component({
  selector: 'vtr-active-protection-system-advanced',
  templateUrl: './active-protection-system-advanced.component.html',
  styleUrls: ['./active-protection-system-advanced.component.scss']
})
export class ActiveProtectionSystemAdvancedComponent implements OnInit {
  public intervals: DropDownInterval[];

  private populateIntervals() {
		const seconds = 'seconds';
		const minute = 'minute';
		const minutes = 'minutes';

		this.intervals = [
		{
			name: '30',
			value: 1,
			placeholder: seconds,
			text: `30 ${seconds}`
		},
		{
			name: '1',
			value: 2,
			placeholder: minute,
			text: `1 ${minute}`
		},
		{
			name: '2',
			value: 3,
			placeholder: minutes,
			text: `2 ${minutes}`
    },
    {
			name: '3',
			value: 3,
			placeholder: minutes,
			text: `3 ${minutes}`
		}];
  }
  constructor() { }

  ngOnInit() {
    this.populateIntervals();
  }

}
