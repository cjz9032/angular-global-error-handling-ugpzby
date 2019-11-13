import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'punctuationRemoveSpace'
})
export class PunctuationRemoveSpacePipe implements PipeTransform {

	transform(value: any, ...args: any[]): any {
		let text = value.replace(' \,', ',')
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
			.replace(/(\,\,|\, \,|\, \,)/gi, ',')
			.replace(/(，，|， ，|， ，)/gi, '，')
			.replace(/(\,$|\, $|\, $)/gi, '')
			.replace(/(，$|， $|， $)/gi, '')
			;
		if (text.substr(0, 1) === ',' || text.substr(0, 1) === '，') { text = text.substr(1); }
		return text;
	}

}
