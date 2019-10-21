import { AppSearchScrollerDirective } from './app-search-scroller.directive';

describe('AppSearchDirective', () => {
	let appSearchService, elmentRef;
	it('should create an instance', () => {
		const directive = new AppSearchScrollerDirective(elmentRef, appSearchService);
		expect(directive).toBeTruthy();
	});
});
