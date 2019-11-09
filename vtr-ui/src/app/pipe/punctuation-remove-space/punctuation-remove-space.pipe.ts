import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'punctuationRemoveSpace'
})
export class PunctuationRemoveSpacePipe implements PipeTransform {

	transform(value: any, ...args: any[]): any {
		return value
			.replace(' ,', ',')
			.replace(' .', '.')
			.replace(' ?', '?')
			.replace(' !', '!')
			.replace(' ;', ';')
			.replace(' ，', '，')
			.replace(' 。', '。')
			.replace(' ？', '？')
			.replace(' ！', '！')
			.replace(' ；', '；')
			.replace(' 、', '、')
			;
	}

}
