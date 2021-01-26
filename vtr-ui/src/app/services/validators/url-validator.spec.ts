import URLValidator from './url-validator';

describe('URL Validator', () => {
	const urlValidator = new URLValidator();

	it('should not validate an url without the preceding protocol', () => {
		const url = 'lenovo.com';
		expect(urlValidator.isValid(url)).toBe(false);
	});

	it('should validate when url is valid', () => {
		const url = 'http://lenovo.com';
		expect(urlValidator.isValid(url)).toBe(true);
	});

	it('should validate when url is valid, with the www prefix and https protocol', () => {
		const url = 'https://www.lenovo.com';
		expect(urlValidator.isValid(url)).toBe(true);
	});

	it('should validate when url contains a port', () => {
		const url = 'http://localhost:8080';

		expect(urlValidator.isValid(url)).toBe(true);
	});

	it('should validate when url is valid and has uppercase characters', () => {
		const url = 'HTTP://LENOVO.COM';

		expect(urlValidator.isValid(url)).toBe(true);
	});
});
