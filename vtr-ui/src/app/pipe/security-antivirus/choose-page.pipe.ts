import { Pipe, PipeTransform } from '@angular/core';
import { Antivirus } from '@lenovo/tan-client-bridge';

@Pipe({
	name: 'choosePage'
})
export class ChoosePagePipe implements PipeTransform {

	transform(antiVirus: any): any {
		console.log(antiVirus);
		if (antiVirus.mcafee) {
			if (antiVirus.mcafee.enabled || !antiVirus.others.enabled) {
				return 'mcafee';
			}
		}
		if (antiVirus.others && antiVirus.others.enabled) {
			return 'others';
		}
		return 'windows';
	}

}
