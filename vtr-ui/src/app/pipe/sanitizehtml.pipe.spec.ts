import { DomSanitizer } from '@angular/platform-browser';
import { inject } from '@angular/core/testing';
import { SanitizeHtmlPipe } from './sanitizehtml.pipe';

describe('SanitizeHtmlPipe', () => {
	it('create an instance', inject([DomSanitizer], (sanitizer: DomSanitizer) => {
		const pipe = new SanitizeHtmlPipe(sanitizer);
		expect(pipe).toBeTruthy();
	}));
});
