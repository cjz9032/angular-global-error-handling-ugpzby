import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchTipsComponent } from './search-tips.component';

describe('SearchTipsComponent', () => {
	let component: SearchTipsComponent;
	let fixture: ComponentFixture<SearchTipsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [SearchTipsComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SearchTipsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
