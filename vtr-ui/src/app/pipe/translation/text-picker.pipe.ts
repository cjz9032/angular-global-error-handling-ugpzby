import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'textPicker' })
export class TextPickerPipe implements PipeTransform {
	transform(value: string, position: number): string {
		const contentTextList: Array<string> = value.split(/<.*?>.*?<.*?>/);
		if (position < contentTextList.length) {
			return contentTextList[position].trim();
		} else {
			return '';
		}
	}
}
