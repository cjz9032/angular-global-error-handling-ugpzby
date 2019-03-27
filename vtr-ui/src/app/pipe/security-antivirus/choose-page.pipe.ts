import { Pipe, PipeTransform } from '@angular/core';
import { Antivirus } from '@lenovo/tan-client-bridge';

@Pipe({
	name: 'choosePage'
})
export class ChoosePagePipe implements PipeTransform {

	transform(antiVirus: Antivirus): any {
		if (antiVirus.mcafee) {
			if (antiVirus.mcafee.status === true
				|| antiVirus.mcafee.firewallStatus === true) {
				return 'mcafee';
			} else if (antiVirus.others) {
				if (antiVirus.others.firewall.length < 1) {
					if (antiVirus.others.antiVirus[0].status === true) {
						return 'others';
					} else { return 'mcafee'; }
				} else if (antiVirus.others.firewall[0].status === true) {
					return 'others';
				} else { return 'mcafee'; }
			}
		} else if (antiVirus.others) {
			return 'others';
		} else { return 'windows'; }
	}

}
