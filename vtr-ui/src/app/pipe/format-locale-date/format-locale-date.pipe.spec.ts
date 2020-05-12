import { FormatLocaleDatePipe } from './format-locale-date.pipe';

describe('FormatLocaleDate', () => {
	it('create an instance', () => {
		const pipe = new FormatLocaleDatePipe();
		expect(pipe).toBeTruthy();
	});
});
