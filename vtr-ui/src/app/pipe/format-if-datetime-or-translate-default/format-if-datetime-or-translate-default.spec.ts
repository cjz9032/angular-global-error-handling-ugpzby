import { Pipe, PipeTransform } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormatIfDatetimeOrTranslateDefaultPipe } from './format-if-datetime-or-translate-default';

fdescribe('FormatLocaleDateTime', () => {
	let pipe: FormatIfDatetimeOrTranslateDefaultPipe;

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

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [
				MockedFormatLocaleDateTimePipe,
				MockedTranslateDefaultValueIfNotFoundPipe,
			],
		});

		pipe = TestBed.inject(FormatIfDatetimeOrTranslateDefaultPipe);
	});

	fit('checks that the input string is in datetime format and returns its mocked toLocaleString form', () =>
		expect(pipe.transform('10/11/2012 09:10:11', '10/11/2012 09:10:11')).toBe(
			'2012/11/10 09:10:11'
		));

	fit('checks that the input string is not in datetime format and applies mocked translation', () =>
		expect(pipe.transform('token_string', 'token_string')).toBe('translated_value'));
});
