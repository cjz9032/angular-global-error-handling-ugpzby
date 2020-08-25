import { Pipe, PipeTransform } from '@angular/core';
import { TranslateDefaultValueIfNotFoundPipe } from '../translate-default-value-if-not-found/translate-default-value-if-not-found.pipe';

@Pipe({
  name: 'tokenByTokenTranslate'
})
export class TokenByTokenTranslatePipe implements PipeTransform {

	constructor(private translateDefaultPipe: TranslateDefaultValueIfNotFoundPipe) { }

	transform(value: string, prefix = ''): string {
		let finalTranslation: string;
		let endToken: string;

		finalTranslation = '';

		const tokensSplittedBySpace = value.toString().split(' ');
		if (tokensSplittedBySpace.length > 1) {
			tokensSplittedBySpace.forEach(token => {
				endToken = ' ';
				if (token[token.length - 1] === ',') {
					token = token.substr(0, token.length - 1);
					endToken = ', ';
				}
				finalTranslation += this.translateDefaultPipe.transform(prefix + token, token);
				finalTranslation += endToken;
			});
		} else {
			finalTranslation = this.translateDefaultPipe.transform(prefix + value, value);
		}
		// Remove the last added space to avoid using trim and remove unexpected spaces.
		if (finalTranslation[finalTranslation.length - 1] === ' ') {
			finalTranslation = finalTranslation.substr(0, finalTranslation.length - 1);
		}
		return finalTranslation ? finalTranslation : value;
	}
}
