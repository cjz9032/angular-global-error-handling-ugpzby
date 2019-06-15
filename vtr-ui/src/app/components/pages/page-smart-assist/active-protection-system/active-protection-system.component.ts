import { Component, OnInit } from '@angular/core';
import { DropDownInterval } from '../../../../data-models/common/drop-down-interval.model';

@Component({
  selector: 'vtr-active-protection-system',
  templateUrl: './active-protection-system.component.html',
  styleUrls: ['./active-protection-system.component.scss']
})
export class ActiveProtectionSystemComponent implements OnInit {
	// title: string;
	advanced: boolean;
	public intervals: DropDownInterval[];
	// public taskBarDimmerValue: number;

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
	
	toggleAdvanced(){
		this.advanced = !this.advanced;
	}
  constructor() { }

  ngOnInit() {
		this.advanced = false;
    this.populateIntervals();
   }

}
