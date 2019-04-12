import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minutesToHourmin'
})
export class MinutesToHourminPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    const totalMin = value;
    const hours = Math.trunc(totalMin/60);
    const minutes = Math.trunc(totalMin%60);
    if(value == undefined) {
      return undefined;
    }
    if (Number.isNaN(minutes)) {
      return "0 minutes";
    }
		const hoursStr = hours > 0 && hours < 2 ? 'hour' : 'hours';
		const minutesStr = minutes > 0 && minutes < 2 ? 'minute': 'minutes';
		if(hours == 0) {
			return `${minutes} ${minutesStr}`;
		}
		return `${hours} ${hoursStr} ${minutes} ${minutesStr}`;
  }

}
