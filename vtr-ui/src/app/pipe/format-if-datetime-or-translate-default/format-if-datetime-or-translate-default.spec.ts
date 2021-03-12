import { Pipe, PipeTransform } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormatLocaleDateTimePipe } from '../format-locale-datetime/format-locale-datetime.pipe';
import { TranslateDefaultValueIfNotFoundPipe } from '../translate-default-value-if-not-found/translate-default-value-if-not-found.pipe';
import { FormatIfDatetimeOrTranslateDefaultPipe } from './format-if-datetime-or-translate-default';

describe('FormatIfDatetimeOrTranslateDefaultPipe', () => {
	// Mocked types
	@Pipe({ name: 'formatLocaleDateTime' })
	class MockedFormatLocaleDateTimePipe implements PipeTransform {
		transform(value: string): string {
			return '2012/11/10 09:10:11';
		}
	}

	@Pipe({ name: 'translateDefault' })
	class MockedTranslateDefaultValueIfNotFoundPipe implements PipeTransform {
		transform(value: string, defaultValue = ''): string {
			const mockedTranslations = {
				token_string: 'translated_value',
			};

			if (value in mockedTranslations) {
				return mockedTranslations[value];
			}
			return defaultValue;
		}
	}

	// Mocked instances
	const mockedFormatLocaleDateTimePipe = new MockedFormatLocaleDateTimePipe();
	const mockedTranslateDefaultValueIfNotFoundPipe = new MockedTranslateDefaultValueIfNotFoundPipe();

	// Instace to be tested
	let pipe: FormatIfDatetimeOrTranslateDefaultPipe;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				FormatIfDatetimeOrTranslateDefaultPipe,
				{
					provide: FormatLocaleDateTimePipe,
					useValue: mockedFormatLocaleDateTimePipe,
				},
				{
					provide: TranslateDefaultValueIfNotFoundPipe,
					useValue: mockedTranslateDefaultValueIfNotFoundPipe,
				},
			],
		});

		pipe = TestBed.inject(FormatIfDatetimeOrTranslateDefaultPipe);
	});

	// Date/time test
	it('should return a formated date as input is in date/time format', () =>
		expect(pipe.transform('10/11/2012 09:10:11', '10/11/2012 09:10:11')).toBe(
			'2012/11/10 09:10:11'
		));

	// Not Date/time tests
	[
		// Input and default are equal and Input is a valid token to be translated
		{
			title: 'should return mocked translation as input is not a date/time',
			input: 'token_string',
			default: 'token_string',
			output: 'translated_value',
		},

		// Input and default are different and Input is a valid token to be translated
		{
			title: 'should return mocked translation as input is not a date/time #2',
			input: 'token_string',
			default: 'not_default_string',
			output: 'translated_value',
		},

		// Input and default are equal and Input is not a valid token to be translated
		{
			title: 'should return default value as input is neither a date/time nor a valid token',
			input: 'not_a_token_string',
			default: 'not_a_token_string',
			output: 'not_a_token_string',
		},
	].forEach((testCase) =>
		it(testCase.title, () =>
			expect(pipe.transform(testCase.input, testCase.default)).toBe(testCase.output)
		)
	);
});
