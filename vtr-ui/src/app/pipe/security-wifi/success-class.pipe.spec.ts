import {
	SuccessClassPipe
} from './success-class.pipe';

describe('SucessClassPipe', () => {
	it('create an instance', () => {
		const pipe = new SuccessClassPipe();
		expect(pipe).toBeTruthy();
	});
});
