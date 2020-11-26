import { TranslateTokenByTokenPipe } from './translate-token-by-token.pipe';
import { Pipe, PipeTransform } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TranslateDefaultValueIfNotFoundPipe } from '../translate-default-value-if-not-found/translate-default-value-if-not-found.pipe';

@Pipe({
	name: 'translateMock',
})
class TranslatePipeMock implements PipeTransform {
	public transform(value: any, defaultValue: any, ...args: any[]): any {
		return '';
	}
}

describe('TranslateTokenByTokenPipe', () => {
	const translatePipeMock = new TranslatePipeMock();
	let pipe: TranslateTokenByTokenPipe;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				TranslateTokenByTokenPipe,
				{
					provide: TranslateDefaultValueIfNotFoundPipe,
					useValue: translatePipeMock,
				},
			],
		});

		pipe = TestBed.inject(TranslateTokenByTokenPipe);
	});

	it('should create an instance', () => {
		expect(pipe).toBeTruthy();
	});

	it('translates a found token should return the translated value', () => {
		spyOn(translatePipeMock, 'transform').and.returnValue('A translation for a valid token!');
		const result = pipe.transform('hardwareScan.foundToken');
		expect(result).toBe('A translation for a valid token!');
	});

	it('translates a not found token should return an empty string', () => {
		const result = pipe.transform('2x32KB');
		expect(result).toBeFalsy();
	});

	it('should translate a valid token inside a line', () => {
		spyOn(translatePipeMock, 'transform').and.returnValues(
			'2',
			'x',
			'32',
			'KB',
			'of some data'
		);
		const result = pipe.transform('2 x 32 KB ANY_TOKEN');
		expect(result).toBe('2 x 32 KB of some data');
	});
});
