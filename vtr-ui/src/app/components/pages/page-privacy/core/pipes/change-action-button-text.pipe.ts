import { Pipe, PipeTransform } from '@angular/core';
import { CommunicationWithFigleafService } from '../../utils/communication-with-figleaf/communication-with-figleaf.service';
import { map } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';

@Pipe({
	name: 'changeActionButtonText'
})
export class ChangeActionButtonTextPipe implements PipeTransform {
	constructor(private communicationWithFigleafService: CommunicationWithFigleafService) {

	}

	transform(value: string): Observable<string> {
		return combineLatest([
			this.communicationWithFigleafService.isFigleafNotOnboarded$,
			this.communicationWithFigleafService.isFigleafInExit$
		]).pipe(
			map(([isFigleafNotOnboarded, isFigleafInExit]) => {
				let newValue = !isFigleafNotOnboarded ? value : this.changeText(value, 'open', 'install');
				newValue = !isFigleafInExit ? newValue : this.changeText(value, 'launch', 'install');

				return newValue;
			})
		);
	}

	private changeText(currentText: string, newText: string, oldText: string) {
		const text = newText.charAt(0).toUpperCase() + newText.slice(1);
		return currentText.toLowerCase().replace(oldText, text);
	}

}
