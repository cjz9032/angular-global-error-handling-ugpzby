import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'percentIcon' })
export class PercentIconPipe implements PipeTransform {
	transform(percent: number): Array<string> {
		if (percent >= 0 && percent <= 25) {
			return ['fal', 'sad-cry'];
		}
		if (percent > 25 && percent <= 50) {
			return ['far', 'frown'];
		}
		if (percent > 50 && percent <= 75) {
			return ['fal', 'grin-beam-sweat'];
		}
		if (percent > 75 && percent <= 100) {
			return ['far', 'laugh-wink'];
		}
	}
}
