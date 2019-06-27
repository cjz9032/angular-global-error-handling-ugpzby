import { Pipe, PipeTransform } from '@angular/core';
import { returnUniqueElementsInArray } from 'src/app/components/pages/page-privacy/utils/helpers';

@Pipe({ name: 'getDeviceNumber' })
export class GetDeviceNumberPipe implements PipeTransform {
	transform(state: string, num: number): number {
		if (state === 'trialExpired' || state === 'local') {
			return 0;
		} else if (num > 99) {
			return 99;
		}
		return num;
	}
}
