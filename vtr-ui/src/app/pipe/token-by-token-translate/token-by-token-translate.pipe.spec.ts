import { TokenByTokenTranslatePipe } from './token-by-token-translate.pipe';
import { Pipe, PipeTransform } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TranslatePipe } from '@ngx-translate/core';
import { TranslateDefaultValueIfNotFoundPipe } from '../translate-default-value-if-not-found/translate-default-value-if-not-found.pipe';

@Pipe({
	name: 'translateMock'
})
class TranslatePipeMock implements PipeTransform {
	public transform(value: any, defaultValue: any, ...args: any[]): any {
		return '';
	}
}

describe('TokenByTokenTranslatePipe', () => {
	const translatePipeMock = new TranslatePipeMock();
	let pipe: TokenByTokenTranslatePipe;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				TokenByTokenTranslatePipe,
				{
					provide: TranslateDefaultValueIfNotFoundPipe,
					useValue: translatePipeMock
				}
			]
		});

		pipe = TestBed.inject(TokenByTokenTranslatePipe);
	});

	it('should create an instance', () => {
		expect(pipe).toBeTruthy();
	});

	it ('translates a found token should return the translated value', () => {
		spyOn(translatePipeMock, 'transform').and.returnValue('A translation for a valid token!');
		const result = pipe.transform('hardwareScan.foundToken');
		expect(result).toBe('A translation for a valid token!');
	});

	it ('should translate from mock dependency', () => {
		const result = pipe.transform('2 x 32 KB');
		expect(result).toBe('2 x 32 KB');
	});

	it ('it should translate a valid token inside a line', () => {
		spyOn(translatePipeMock, 'transform').and.returnValues('2', 'x', '32', 'KB', 'of some data');
		const result = pipe.transform('2 x 32 KB ANY_TOKEN');
		expect(result).toBe('2 x 32 KB of some data');
	});
});
