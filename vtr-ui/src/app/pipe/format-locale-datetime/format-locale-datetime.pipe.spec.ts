import { FormatLocaleDateTimePipe } from './format-locale-datetime.pipe';

describe('FormatLocaleDateTime', () => {
	it('create an instance', () => {
		const pipe = new FormatLocaleDateTimePipe();
		expect(pipe).toBeTruthy();
	});
});
