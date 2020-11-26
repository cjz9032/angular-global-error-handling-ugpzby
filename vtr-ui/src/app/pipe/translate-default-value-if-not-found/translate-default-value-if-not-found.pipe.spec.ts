import { TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { TranslateDefaultValueIfNotFoundPipe } from './translate-default-value-if-not-found.pipe';

// A mocked class which acts equal to the real TranslatePipe,
// i.e. returning an empty string if the given token is not found
@Pipe({
	name: 'translateMock',
})
class TranslatePipeMock implements PipeTransform {
	public transform(value: any, ...args: any[]): any {
		return '';
	}
}

describe('TranslateDefaultValueIfNotFoundPipe', () => {
	const translatePipeMock = new TranslatePipeMock();
	let pipe: TranslateDefaultValueIfNotFoundPipe;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				TranslateDefaultValueIfNotFoundPipe,
				{
					provide: TranslatePipe,
					useValue: translatePipeMock,
				},
			],
		});

		pipe = TestBed.inject(TranslateDefaultValueIfNotFoundPipe);
	});

	it('create an instance', () => {
		expect(pipe).toBeTruthy();
	});

	it('translates a found token should return the translated value', () => {
		spyOn(translatePipeMock, 'transform').and.returnValue('A translation for a valid token!');
		const result = pipe.transform('hardwareScan.foundToken');
		expect(result).toBe('A translation for a valid token!');
	});

	it('translates a not found token should return an empty string', () => {
		const result = pipe.transform('hardwareScan.notFoundToken');
		expect(result).toBeFalsy();
	});

	it('translates a not found token should return the default value', () => {
		const defaultValue = 'This is a default value for a token not found';
		const result = pipe.transform('hardwareScan.NotFoundToken', defaultValue);
		expect(result).toEqual(defaultValue);
	});
});
