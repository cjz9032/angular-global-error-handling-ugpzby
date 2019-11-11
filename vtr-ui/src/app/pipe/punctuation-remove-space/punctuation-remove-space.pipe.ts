import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'punctuationRemoveSpace'
})
export class PunctuationRemoveSpacePipe implements PipeTransform {

	transform(value: any, ...args: any[]): any {
		const text = value.replace(' ,', ',')
			.replace(/( \.| \.)/gi, '.')
			.replace(/( \?| \?)/gi, '?')
			.replace(/( \!| \!)/gi, '!')
			.replace(/( \;| \;)/gi, ';')
			.replace(/( ，| ，)/gi, '，')
			.replace(/( 。| 。)/gi, '。')
			.replace(/( ？| ？)/gi, '？')
			.replace(/( ！| ！)/gi, '！')
			.replace(/( ；| ；)/gi, '；')
			.replace(/( 、| 、)/gi, '、')
			.replace(/(\,\!|\, \!|\, \!|\,  \!)/gi, '!')
			.replace(/(，！|， ！|， ！|，  ！)/gi, '！')
			.replace(/(\,\?|\, \?|\, \?|\,  \?)/gi, '?')
			.replace(/(，？|， ？|， ？|，  ？)/gi, '？')
			.replace(/(,|, ,|, ,)/gi, ',')
			.replace(/(，，|， ，|， ，)/gi, '，')
			.replace(/(\,$|\, $|\, $)/gi, '')
			.replace(/(，$|， $|， $)/gi, '')
			;
		return text;
	}

}
