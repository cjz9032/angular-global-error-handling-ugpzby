import { Pipe, PipeTransform } from '@angular/core';
import { TranslateDefaultValueIfNotFoundPipe } from '../translate-default-value-if-not-found/translate-default-value-if-not-found.pipe';

@Pipe({
  name: 'translateTokenByToken'
})
export class TranslateTokenByTokenPipe implements PipeTransform {

	constructor(private translateDefaultPipe: TranslateDefaultValueIfNotFoundPipe) { }

	transform(value: string, prefix = ''): string {
		let finalTranslation;
		let token;

		finalTranslation = [];

		const tokensSplittedBySpace = value.toString().split(' ');
		tokensSplittedBySpace.forEach(word => {
			if (word.slice(-1) === ','){
				token = word.slice(0, -1);
				finalTranslation.push(this.translateDefaultPipe.transform(prefix + token, token) + ',');
			} else {
				finalTranslation.push(this.translateDefaultPipe.transform(prefix + word, word));
			}
		});

		return finalTranslation.join(' ');
	}
}
