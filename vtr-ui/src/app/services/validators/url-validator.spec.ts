import URLValidator from './url-validator';

describe('URL Validator', () => {
	const urlValidator = new URLValidator();

	describe('Valid URL', () => {
		it('should the url follow the right format', () => {
			const url = 'http://lenovo.com';
			expect(urlValidator.isValid(url)).toBeTruthy();
		});

		it('should the url to have www prefix and https protocol', () => {
			const url = 'https://www.lenovo.com';
			expect(urlValidator.isValid(url)).toBeTruthy();
		});

		it('should validate when url contains a port', () => {
			const url = 'http://lenovo.qa.com:8080';
			expect(urlValidator.isValid(url)).toBeTruthy();
		});

		it('should validate when url has uppercase characters', () => {
			const url = 'HTTP://LENOVO.COM';
			expect(urlValidator.isValid(url)).toBeTruthy();
		});
	});

	describe('Invalid URL', () => {
		it('should not be validate an url without protocol', () => {
			const url = 'lenovo.com';
			expect(urlValidator.isValid(url)).toBeFalsy();
		});

		it('should return false for an empty url', () => {
			expect(urlValidator.isValid('')).toBeFalsy();
		});
	});
});
