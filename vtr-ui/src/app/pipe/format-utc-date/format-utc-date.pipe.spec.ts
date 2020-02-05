import { FormatUTCDatePipe } from './format-utc-date.pipe';

describe('FormatUTCDate', () => {
	it('create an instance', () => {
		const pipe = new FormatUTCDatePipe();
		expect(pipe).toBeTruthy();
	});
});
