import { Pipe, PipeTransform } from '@angular/core';
import { CommunicationWithFigleafService } from '../../utils/communication-with-figleaf/communication-with-figleaf.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Pipe({
	name: 'changeActionButtonText'
})
export class ChangeActionButtonTextPipe implements PipeTransform {
	constructor(private communicationWithFigleafService: CommunicationWithFigleafService) {

	}

	transform(value: string): Observable<string> {
		return this.communicationWithFigleafService.isFigleafNotOnboarded$.pipe(
			map((isFigleafNotOnboarded) => !isFigleafNotOnboarded ? value : this.changeText(value, 'open', 'install')));
	}

	private changeText(currentText: string, newText: string, oldText: string) {
		const text = newText.charAt(0).toUpperCase() + newText.slice(1);
		return currentText.toLowerCase().replace(oldText, text);
	}

}
