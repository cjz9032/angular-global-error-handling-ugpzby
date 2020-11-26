import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'pipeInstall',
})
export class PipeInstallPipe implements PipeTransform {
	transform(mcafee: any): boolean {
		if (!mcafee) {
			return false;
		} else {
			return true;
		}
	}
}
