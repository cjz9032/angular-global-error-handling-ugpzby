import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'tagPicker' })
export class TagPickerPipe implements PipeTransform {
	transform(value: string, position: number): string {
		const contentTextList: Array<string> = value.split(/<tag>.*?<\/tag>/);
		const textList: Array<string> = value.split(/<\/?tag>/);
		const tagText = textList.filter(text => !contentTextList.includes(text));
		if (position < tagText.length) {
			return tagText[position];
		} else {
			return '';
		}
	}
}
